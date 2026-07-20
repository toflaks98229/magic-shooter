/**
 * @fileoverview 의존성 없는 최소 PNG 코덱.
 *
 * 아틀라스 생성 도구가 타일시트를 열어 보고, 검수용 이미지를 써내기 위해 필요합니다.
 * 이 프로젝트는 npm 의존성이 없는 상태를 유지하고 있으므로 sharp 같은 라이브러리 대신
 * Node 내장 zlib만으로 처리합니다.
 *
 * 지원 범위는 이 저장소가 다루는 PNG로 한정합니다.
 *   - 비트 심도 1/2/4/8 (4비트 이하는 팔레트 이미지에서 쓰입니다)
 *   - 컬러 타입 0(그레이) 2(RGB) 3(팔레트) 4(그레이+알파) 6(RGBA)
 *   - 비인터레이스
 * 그 외 형식은 명시적으로 오류를 냅니다. 조용히 잘못된 픽셀을 내놓는 것보다 낫습니다.
 *
 * DCSS 원본 타일 중 일부가 4비트 팔레트 PNG라 낮은 비트 심도까지 다룹니다.
 */

import { inflateSync, deflateSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';

/** @description PNG 파일 시그니처 */
const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** @description 컬러 타입별 채널 수 */
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/**
 * PNG 파일을 읽어 RGBA 픽셀 배열로 반환합니다.
 * @param {string} path - PNG 파일 경로
 * @returns {{width: number, height: number, data: Uint8ClampedArray}} RGBA 이미지
 */
export function readPng(path) {
    const buffer = readFileSync(path);
    if (!buffer.subarray(0, 8).equals(SIGNATURE)) throw new Error(`PNG가 아닙니다: ${path}`);

    let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
    let palette = null, transparency = null;
    const idatParts = [];

    let offset = 8;
    while (offset < buffer.length) {
        const length = buffer.readUInt32BE(offset);
        const type = buffer.toString('ascii', offset + 4, offset + 8);
        const body = buffer.subarray(offset + 8, offset + 8 + length);

        if (type === 'IHDR') {
            width = body.readUInt32BE(0);
            height = body.readUInt32BE(4);
            bitDepth = body[8];
            colorType = body[9];
            interlace = body[12];
        } else if (type === 'PLTE') {
            palette = Buffer.from(body);
        } else if (type === 'tRNS') {
            transparency = Buffer.from(body);
        } else if (type === 'IDAT') {
            idatParts.push(body);
        } else if (type === 'IEND') {
            break;
        }
        offset += 12 + length;
    }

    if (![1, 2, 4, 8].includes(bitDepth)) throw new Error(`비트 심도 ${bitDepth}는 지원하지 않습니다: ${path}`);
    if (interlace !== 0) throw new Error(`인터레이스 PNG는 지원하지 않습니다: ${path}`);
    if (!(colorType in CHANNELS)) throw new Error(`컬러 타입 ${colorType}는 지원하지 않습니다: ${path}`);
    if (bitDepth < 8 && colorType !== 0 && colorType !== 3) {
        throw new Error(`비트 심도 ${bitDepth}는 팔레트/그레이스케일에서만 지원합니다: ${path}`);
    }

    const channels = CHANNELS[colorType];
    const raw = inflateSync(Buffer.concat(idatParts));

    // 한 행의 바이트 수. 비트 심도가 8 미만이면 한 바이트에 여러 픽셀이 들어갑니다.
    const stride = Math.ceil((width * channels * bitDepth) / 8);
    // 필터가 '왼쪽 픽셀'로 참조하는 거리. 1바이트 미만이면 1바이트로 취급합니다.
    const filterBytes = Math.max(1, (channels * bitDepth) >> 3);

    const filtered = unfilter(raw, height, filterBytes, stride);
    const pixels = bitDepth === 8 ? filtered : unpackSamples(filtered, width, height, channels, bitDepth, stride);

    return { width, height, data: toRgba(pixels, width, height, colorType, channels, palette, transparency, bitDepth) };
}

/**
 * PNG의 스캔라인 필터를 해제해 원본 바이트를 복원합니다.
 * @param {Buffer} raw - 압축 해제된 데이터 (각 행 앞에 필터 바이트 1개)
 * @param {number} height - 이미지 높이
 * @param {number} filterBytes - 필터가 '왼쪽'으로 참조할 바이트 거리
 * @param {number} stride - 필터 바이트를 제외한 한 행의 바이트 수
 * @returns {Buffer} 필터가 해제된 바이트
 */
function unfilter(raw, height, filterBytes, stride) {
    const out = Buffer.alloc(height * stride);

    for (let y = 0; y < height; y++) {
        const filterType = raw[y * (stride + 1)];
        const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
        const target = y * stride;
        const above = target - stride;

        for (let x = 0; x < stride; x++) {
            const rawByte = line[x];
            const left = x >= filterBytes ? out[target + x - filterBytes] : 0;
            const up = y > 0 ? out[above + x] : 0;
            const upLeft = (y > 0 && x >= filterBytes) ? out[above + x - filterBytes] : 0;

            let value;
            switch (filterType) {
                case 0: value = rawByte; break;                              // None
                case 1: value = rawByte + left; break;                       // Sub
                case 2: value = rawByte + up; break;                         // Up
                case 3: value = rawByte + ((left + up) >> 1); break;         // Average
                case 4: value = rawByte + paeth(left, up, upLeft); break;    // Paeth
                default: throw new Error(`알 수 없는 필터 타입: ${filterType}`);
            }
            out[target + x] = value & 0xff;
        }
    }
    return out;
}

/**
 * PNG Paeth 예측자.
 * @param {number} a - 왼쪽 픽셀
 * @param {number} b - 위쪽 픽셀
 * @param {number} c - 왼쪽 위 픽셀
 * @returns {number} 예측값
 */
function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    return pb <= pc ? b : c;
}

/**
 * 한 바이트에 여러 개가 들어 있는 샘플을 픽셀당 한 바이트로 펼칩니다.
 * @param {Buffer} filtered - 필터가 해제된 바이트
 * @param {number} width - 이미지 너비
 * @param {number} height - 이미지 높이
 * @param {number} channels - 픽셀당 채널 수
 * @param {number} bitDepth - 비트 심도 (1, 2, 4)
 * @param {number} stride - 한 행의 바이트 수
 * @returns {Buffer} 샘플당 한 바이트로 펼친 데이터
 */
function unpackSamples(filtered, width, height, channels, bitDepth, stride) {
    const out = Buffer.alloc(width * height * channels);
    const mask = (1 << bitDepth) - 1;
    const perByte = 8 / bitDepth;

    for (let y = 0; y < height; y++) {
        for (let i = 0; i < width * channels; i++) {
            const byte = filtered[y * stride + ((i / perByte) | 0)];
            // 상위 비트부터 채워집니다.
            const shift = 8 - bitDepth * ((i % perByte) + 1);
            out[y * width * channels + i] = (byte >> shift) & mask;
        }
    }
    return out;
}

/**
 * 임의의 컬러 타입 픽셀을 RGBA로 변환합니다.
 * @returns {Uint8ClampedArray} RGBA 픽셀
 */
function toRgba(pixels, width, height, colorType, channels, palette, transparency, bitDepth = 8) {
    const rgba = new Uint8ClampedArray(width * height * 4);

    for (let i = 0; i < width * height; i++) {
        const src = i * channels;
        const dst = i * 4;

        if (colorType === 6) {                       // RGBA
            rgba[dst] = pixels[src]; rgba[dst + 1] = pixels[src + 1];
            rgba[dst + 2] = pixels[src + 2]; rgba[dst + 3] = pixels[src + 3];
        } else if (colorType === 2) {                // RGB
            rgba[dst] = pixels[src]; rgba[dst + 1] = pixels[src + 1];
            rgba[dst + 2] = pixels[src + 2]; rgba[dst + 3] = 255;
        } else if (colorType === 3) {                // 팔레트
            const index = pixels[src];
            rgba[dst] = palette[index * 3]; rgba[dst + 1] = palette[index * 3 + 1];
            rgba[dst + 2] = palette[index * 3 + 2];
            rgba[dst + 3] = transparency && index < transparency.length ? transparency[index] : 255;
        } else if (colorType === 0) {                // 그레이스케일
            // 낮은 비트 심도의 값을 0~255 범위로 늘립니다.
            const level = bitDepth === 8 ? pixels[src] : Math.round((pixels[src] * 255) / ((1 << bitDepth) - 1));
            rgba[dst] = rgba[dst + 1] = rgba[dst + 2] = level;
            rgba[dst + 3] = 255;
        } else if (colorType === 4) {                // 그레이스케일 + 알파
            rgba[dst] = rgba[dst + 1] = rgba[dst + 2] = pixels[src];
            rgba[dst + 3] = pixels[src + 1];
        }
    }
    return rgba;
}

/**
 * RGBA 픽셀 배열을 PNG 파일로 씁니다. (필터 없음, 검수용이므로 압축률보다 단순함 우선)
 * @param {string} path - 저장할 경로
 * @param {{width: number, height: number, data: Uint8ClampedArray}} image - RGBA 이미지
 */
export function writePng(path, { width, height, data }) {
    const stride = width * 4;
    const raw = Buffer.alloc(height * (stride + 1));
    for (let y = 0; y < height; y++) {
        raw[y * (stride + 1)] = 0; // 필터: None
        Buffer.from(data.buffer, data.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;   // 비트 심도
    ihdr[9] = 6;   // RGBA
    ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

    writeFileSync(path, Buffer.concat([
        SIGNATURE,
        chunk('IHDR', ihdr),
        chunk('IDAT', deflateSync(raw)),
        chunk('IEND', Buffer.alloc(0)),
    ]));
}

/**
 * PNG 청크 하나를 만듭니다 (길이 + 타입 + 데이터 + CRC).
 * @param {string} type - 청크 타입 (4글자)
 * @param {Buffer} body - 청크 데이터
 * @returns {Buffer} 완성된 청크
 */
function chunk(type, body) {
    const head = Buffer.alloc(4);
    head.writeUInt32BE(body.length, 0);
    const typeAndBody = Buffer.concat([Buffer.from(type, 'ascii'), body]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndBody), 0);
    return Buffer.concat([head, typeAndBody, crc]);
}

/** @description CRC32 룩업 테이블 */
const CRC_TABLE = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        table[n] = c >>> 0;
    }
    return table;
})();

/**
 * PNG 청크용 CRC32를 계산합니다.
 * @param {Buffer} buffer - 대상 바이트
 * @returns {number} CRC32 값
 */
function crc32(buffer) {
    let c = 0xffffffff;
    for (let i = 0; i < buffer.length; i++) c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

/**
 * 이미지에서 사각 영역을 잘라냅니다.
 * @param {object} image - 원본 RGBA 이미지
 * @param {number} x - 잘라낼 좌상단 X
 * @param {number} y - 잘라낼 좌상단 Y
 * @param {number} w - 너비
 * @param {number} h - 높이
 * @returns {object} 잘라낸 RGBA 이미지
 */
export function crop(image, x, y, w, h) {
    const out = new Uint8ClampedArray(w * h * 4);
    for (let row = 0; row < h; row++) {
        const src = ((y + row) * image.width + x) * 4;
        out.set(image.data.subarray(src, src + w * 4), row * w * 4);
    }
    return { width: w, height: h, data: out };
}

/**
 * 이미지를 정수배로 확대합니다. (검수용 이미지에서 픽셀을 알아보기 위함)
 * @param {object} image - 원본 이미지
 * @param {number} factor - 확대 배율
 * @returns {object} 확대된 이미지
 */
export function scale(image, factor) {
    const w = image.width * factor, h = image.height * factor;
    const out = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const src = (((y / factor) | 0) * image.width + ((x / factor) | 0)) * 4;
            const dst = (y * w + x) * 4;
            out[dst] = image.data[src]; out[dst + 1] = image.data[src + 1];
            out[dst + 2] = image.data[src + 2]; out[dst + 3] = image.data[src + 3];
        }
    }
    return { width: w, height: h, data: out };
}
