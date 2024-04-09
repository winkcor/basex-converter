import {expect, test} from '@jest/globals';
import base62, {
    ALPHABET_BASE16,
    ALPHABET_BASE2, ALPHABET_BASE58,
    ALPHABET_BASE62_Default,
    ALPHABET_BASE62_INVERTED,
    Base62,
    BASE_DEFAULT
} from '../src';
import BN from "bn.js";

const bytes: [Uint8Array, string][] = [
    [Uint8Array.of(0x01), '1'],
    [Uint8Array.of(0x01, 0x01), '257'],
    [Uint8Array.of(0xff, 0xff), '65535'],
    [Uint8Array.of(0x01, 0x01, 0x01), '65793'],
    [Uint8Array.of(0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08), '72623859790382856']
];

test('Test Charsets', () => {
    expect(ALPHABET_BASE62_Default.length).toBe(62);
    expect(ALPHABET_BASE62_INVERTED.length).toBe(62);
    expect(BASE_DEFAULT).toBe(62);
});

test('Test Decode and Encode', () => {
    expect(base62.encode('0')).toBe('0');
    expect(base62.decode('0')).toBe('0');
    expect(base62.decode('0000')).toBe('0');
    expect(base62.decode('000001')).toBe('1');
    expect(base62.encode('34441886726')).toBe('base62');
    expect(base62.decode('base62')).toBe('34441886726');
    expect(base62.encode('9999')).toBe('2bH');
    expect(() => base62.decode(' ')).toThrow();
});

test('Test Inverted', () => {
    let charset = ALPHABET_BASE62_INVERTED;
    expect(base62.encode('0', charset)).toBe('0');
    expect(base62.decode('0', charset)).toBe('0');
    expect(base62.decode('0000', charset)).toBe('0');
    expect(base62.decode('000001', charset)).toBe('1');
    expect(base62.encode('10231951886', charset)).toBe('base62');
    expect(base62.decode('base62', charset)).toBe('10231951886');
});

test('Test Byte To Int', () => {
    for (let [b, i] of bytes) {
        expect(BigInt("0x" + Array.from(b).map(byte => byte.toString(16).padStart(2, '0')).join('')).toString()).toBe(i);
    }
});
test('Test Encode Bytes', () => {
    for (let [b, i] of bytes) {
        expect(base62.encode_bytes(b)).toBe(base62.encode(i));
    }
});

test('Test arg type', () => {
    // @ts-ignore
    expect(() => base62.encode_bytes('data')).toThrow(TypeError('Invalid type, value must be Uint8Array'));
    // @ts-ignore
    expect(() => base62.encode_bytes(12)).toThrow(TypeError('Invalid type, value must be Uint8Array'));
    // @ts-ignore
    expect(() => base62.decode_bytes(11)).toThrow(TypeError('Unexpected value, Expected a string value, but received a number instead'));
});

test('Test Decode Bytes', () => {
    let values: [string, string][] = [['0', '0'], ['1', '1'], ['a', '36'], ['z', '61'], ['ykzvd7ga', '213966422887588']]
    for (let [b, i] of values) {
        expect(new BN(base62.decode_bytes(b)).toString()).toBe(i);
    }
});

test('Test null bytes are not lost', () => {
    let values: [Uint8Array, string][] = [
        [new Uint8Array([]), ''],
        [new Uint8Array([0x00]), '01'],
        [new Uint8Array([0x00, 0x00]), '02'],
        [new Uint8Array([0x00, 0x01]), '011'],
        [new Uint8Array(61).fill(0x00), '0z'],
        [new Uint8Array(62).fill(0x00), '0z01']]
    for (let [b, i] of values) {
        let encoded_text = base62.encode_bytes(b)
        expect(encoded_text).toBe(i);
        let output_bytes = base62.decode_bytes(encoded_text);
        expect(output_bytes).toStrictEqual(b);
    }
});

test("Test Base converter", () => {
    expect(base62.convert_base('-12', 10, 16)).toBe('-c');
    expect(base62.convert_base('-12', 10, 12)).toBe('-10');
    expect(base62.convert_base('-0', 10, 12)).toBe('0');
    expect(base62.convert_base('0', 10, 12)).toBe('0');
    expect(base62.convert_base('16', 10, 16)).toBe('10');
    expect(base62.convert_base('16', 10, 2)).toBe('10000');
});

test("Test Encode and decode hex", () => {
    expect(base62.encode_hex('63d91de18f092ab964484b9e')).toBe('eBhQNIyMqR6WH3XS');
    expect(base62.encode_hex('0')).toBe('0');
    expect(base62.encode_hex('00000000000000')).toBe('0');
    expect(base62.encode_hex('000000000000001')).toBe('1');

    expect(base62.decode_hex('eBhQNIyMqR6WH3XS')).toBe('63d91de18f092ab964484b9e');
    expect(base62.decode_hex('0')).toBe('0');
    expect(base62.decode_hex('00000000000000')).toBe('0');
    expect(base62.decode_hex('000000000000001')).toBe('1');
});

test('Test setter and getter', () => {
    expect(() => base62.alphabet = '1').toThrow(Error);
    // @ts-ignore
    expect(() => base62.setBaseAlphabet('a', '1')).toThrow(TypeError('Unexpected value, Expected a number value, but received a string instead'));
    // @ts-ignore
    expect(() => base62.alphabet = 12).toThrow(TypeError('Unexpected value, Expected a string value, but received a number instead'));
    expect(base62.base).toBe(62);
    expect(base62.alphabet).toBe(ALPHABET_BASE62_Default);
    base62.setBaseAlphabet('abcd', 4);
    expect(base62.base).toBe(4);
    expect(base62.alphabet).toBe('abcd');
});

test('Test Other bases', () => {
    const base2 = new Base62(ALPHABET_BASE2, 2);
    const base16 = new Base62(ALPHABET_BASE16, 16);
    const base58 = new Base62(ALPHABET_BASE58, 58);


    expect(base2.encode_hex('f')).toBe('1111');
    expect(base2.encode_hex('00ff')).toBe('11111111');
    expect(base2.encode_hex('ff00ff00')).toBe('11111111000000001111111100000000');
    expect(base2.encode_hex('fb6f9ac3')).toBe('11111011011011111001101011000011');
    expect(base2.encode_hex('179eea7a')).toBe('10111100111101110101001111010');
    expect(base2.encode_hex('6db825db')).toBe('1101101101110000010010111011011');
    expect(base2.decode_hex('11111111')).toBe('ff');
    expect(base2.decode_hex('11111111000000001111111100000000')).toBe('ff00ff00');

    expect(base16.encode_hex('ffff')).toBe('ffff');
    expect(base16.encode_hex('00000f')).toBe('f');
    expect(base16.decode_hex('00000f')).toBe('f');

    expect(base58.encode_hex('636363')).toBe('aPEr');
    expect(base58.encode_hex('626262')).toBe('a3gV');
    expect(base58.encode_hex('73696d706c792061206c6f6e6720737472696e67')).toBe('2cFupjhnEsSn59qHXstmK2ffpLv2');
    expect(base58.encode_hex('00eb15231dfceb60925886b67d065299925915aeb172c06647')).toBe('NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L');
    expect(base58.encode_hex('516b6fcd0f')).toBe('ABnLTmg');
    expect(base58.decode_hex('aPEr')).toBe('636363');
    expect(base58.decode_hex('2cFupjhnEsSn59qHXstmK2ffpLv2')).toBe('73696d706c792061206c6f6e6720737472696e67');
    expect(base58.decode_hex('ABnLTmg')).toBe('516b6fcd0f');

});