import { HeatshrinkDecoder } from "heatshrink-ts";
import { describe, expect, test } from "vitest";

import { HeatshrinkEncoder } from "../../virtual/heatshrink";

const decode = (encoded: Uint8Array): string => {
    const decoder = new HeatshrinkDecoder(8, 4, encoded.byteLength);
    decoder.process(encoded);
    return new TextDecoder().decode(decoder.getOutput());
};

const decodeBytes = (encoded: Uint8Array): Uint8Array => {
    const decoder = new HeatshrinkDecoder(8, 4, encoded.byteLength);
    decoder.process(encoded);
    return decoder.getOutput();
};

describe("HeatshrinkEncoder", () => {
    test("リテラルのみの入力が復号できる", () => {
        const input = "The quick brown fox jumps over the lazy dog";
        const encoded = HeatshrinkEncoder.encode(Buffer.from(input));

        expect(decode(encoded)).toBe(input);
    });

    test("反復を含む入力が圧縮され、復号できる", () => {
        const input = "ab".repeat(400);
        const encoded = HeatshrinkEncoder.encode(Buffer.from(input));

        expect(encoded.byteLength).toBeLessThan(input.length);
        expect(decode(encoded)).toBe(input);
    });

    test("256 バイトを超える距離の反復（窓より遠いマッチ）でも復号できる", () => {
        const block = "abcdefghijklmnopqrstuvwxyz0123456789";
        const far = `${block}\x00na-repeat`.repeat(2) + block.repeat(20);
        // 2 ブロック目以降は 1 つ目のブロックから 256 バイト以上離れている
        const input = `${far}\n${"same-pattern-1234567890".repeat(30)}`;
        const encoded = HeatshrinkEncoder.encode(Buffer.from(input));

        expect(decode(encoded)).toBe(input);
    });

    test("0x00 を含むバイナリデータが復号できる", () => {
        const raw = new Uint8Array(300);
        for (let i = 0; i < raw.length; i++) {
            raw[i] = i % 7 === 0 ? 0 : i % 251;
        }
        const encoded = HeatshrinkEncoder.encode(raw);

        const decoded = decodeBytes(encoded);
        expect(decoded.length).toBe(raw.length);
        for (let i = 0; i < raw.length; i++) {
            expect(decoded[i]).toBe(raw[i]);
        }
    });

    test("空入力は空を返す", () => {
        const encoded = HeatshrinkEncoder.encode(new Uint8Array(0));
        expect(encoded.byteLength).toBe(0);
    });

    test("1〜16 バイトの短いマッチが連続しても復号できる", () => {
        const input = "short-short-short-other-short-short";
        const encoded = HeatshrinkEncoder.encode(Buffer.from(input));

        expect(decode(encoded)).toBe(input);
    });
});
