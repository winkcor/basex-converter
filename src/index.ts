import BN from 'bn.js'

export const ALPHABET_BASE62_Default = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    ALPHABET_BASE62_INVERTED = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ALPHABET_BASE2 = '01',
    ALPHABET_BASE8 = '01234567',
    ALPHABET_BASE11 = '0123456789a',
    ALPHABET_BASE16 = '0123456789abcdef',
    ALPHABET_BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
    ALPHABET_BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz',
    ALPHABET_BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    ALPHABET_BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    ALPHABET_BASE67 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~',
    BASE_DEFAULT = 62;

export class Base62 {
    private ALPHABET = ALPHABET_BASE62_Default;
    private BASE = BASE_DEFAULT;

    /**
     * @param {string | undefined} alphabet Alphabet
     * @param {number | undefined} base Base
     */
    constructor(alphabet: string = ALPHABET_BASE62_Default, base: number = BASE_DEFAULT) {
        this.check_type(base, 'number');
        this.BASE = base;
        this.alphabet = alphabet;
    }

    set alphabet(alphabet: string) {
        this.check_type(alphabet, 'string');
        if (alphabet.length != this.BASE) throw new Error('The length of the alphabet and the base value must be equal; alphabet length is: ' + alphabet.length + ' and base is: ' + this.BASE);
        this.ALPHABET = alphabet;
    }

    get alphabet(): string {
        return this.ALPHABET;
    }

    get base(): number {
        return this.BASE;
    }

    /**
     * Change the alphabet of instance
     * @param {string} alphabet Alphabet
     * @return {string} Alphabet
     */
    readonly setAlphabet = (alphabet: string): string =>
        this.alphabet = alphabet;

    /**
     * Change the base and alphabet of instance
     * @param {string} alphabet Alphabet
     * @param {number} base Base
     */
    readonly setBaseAlphabet = (alphabet: string, base: number): void => {
        this.check_type(base, 'number');
        this.BASE = base;
        this.alphabet = alphabet;
    }

    private readonly check_type = (value: unknown, type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"): void => {
        if (typeof value !== type) throw new TypeError(`Unexpected value, Expected a ${type} value, but received a ${typeof value} instead`)
    }
    private readonly value = (ch: string, alphabet: string): number => {
        const value = alphabet.search(ch);
        if (value === -1) throw new Error(`Invalid Character: "${ch}"`);
        return value;
    }

    /**
     * Encode a given number into a base62 string
     * @param {string|number} number Number(for BigInt must send as string)
     * @param {string} alphabet Alphabet
     * @return {string} Encoded string
     */
    encode(number: string, alphabet: string = this.ALPHABET): string {
        let chs = '',
            base = new BN(this.BASE),
            num;
        try {
            num = new BN(number);
        } catch (e) {
            throw new Error('Invalid Value, Value must be a Number in String format');
        }
        while (num.gt(new BN(0))) {
            let r = num.mod(base);
            num = new BN(num.div(base));
            chs = alphabet[r.toNumber()] + chs;
        }
        return chs.length ? chs : '0';
    }


    /**
     * Decodes a base62 encoded value
     *
     * the return value is in string format
     * @param {string} encoded Encoded string
     * @param {string} alphabet Alphabet
     * @return {string} Decoded number in string format
     */
    decode(encoded: string, alphabet: string = this.ALPHABET): string {
        this.check_type(encoded, 'string');
        let base = new BN(this.BASE),
            l = encoded.length,
            i = 0,
            v = new BN(0);
        for (let x of encoded) {
            v = v.add(new BN(this.value(x, alphabet)).mul((base.pow(new BN(l - (i + 1))))));
            i++
        }
        return v.toString();
    }

    /**
     * Encodes a byteArray into a base62 string
     * @param {Uint8Array} binaryArray Uint8Array
     * @param {string} alphabet Alphabet
     * @return {string} Encoded string
     */
    encode_bytes(binaryArray: Uint8Array, alphabet: string = this.ALPHABET): string {
        if (!(binaryArray instanceof Uint8Array))
            throw new TypeError('Invalid type, value must be Uint8Array');


        let leadingZerosCount = 0;
        for (let i = 0; i < binaryArray.length; i++) {
            if (binaryArray[i] != 0)
                break;
            leadingZerosCount++;
        }
        const [n, r] = [Math.floor(leadingZerosCount / (alphabet.length - 1)), leadingZerosCount % (alphabet.length - 1)];

        let zero_padding = `0${alphabet[alphabet.length - 1]}`.repeat(n);
        if (r)
            zero_padding += `0${alphabet[r]}`;


        if (leadingZerosCount === binaryArray.length)
            return zero_padding;

        let value = this.encode(BigInt("0x" + Array.from(binaryArray).map(byte => byte.toString(16).padStart(2, '0')).join('')).toString(), this.ALPHABET);
        return zero_padding + value;
    }

    /**
     * Decodes a string of base62 data into a Uint8Array of bytes
     * @param {string} encoded Encoded string
     * @param {string} alphabet Alphabet
     * @return {Uint8Array} Decoded bytes
     */
    decode_bytes(encoded: string, alphabet: string = this.ALPHABET): Uint8Array {
        this.check_type(encoded, "string");
        let leading_null_bytes = new Uint8Array();
        while (encoded.startsWith('0') && encoded.length >= 2) {
            leading_null_bytes = new Uint8Array([...leading_null_bytes, ...new Uint8Array(this.value(encoded[1], alphabet)).fill(0)]);
            encoded = encoded.slice(2);
        }
        let decoded = new BN(this.decode(encoded, alphabet));
        let buf = new Uint8Array();
        while (decoded.gt(new BN(0))) {
            buf = new Uint8Array([...buf, decoded.and(new BN(0xFF)).toNumber()]);
            decoded = decoded.div(new BN(256));
        }
        buf.reverse();
        return new Uint8Array([...leading_null_bytes, ...buf]);
    }

    /**
     * Encode and hex string into base62 string
     * @param {string} hex Hex string
     * @param {string} alphabet Alphabet
     * @return {string|null}
     */
    encode_hex(hex: string, alphabet: string = this.ALPHABET): string | null {
        hex = hex.replace(' ', '');
        if (!hex.length) throw new Error(`Invalid Value, hex is Empty`);
        try {
            return this.encode(new BN(hex, 16).toString(), alphabet)
        } catch (e) {
            console.log(e)
            throw new Error(`Invalid character in ${hex} valid value is 0-9a-f`);
        }
    }
    /**
     * Decode and hex string into base62 string
     * @param {string} encoded encoded string
     * @param {string} alphabet Alphabet
     * @return {string|null} Hex string
     */
    decode_hex(encoded: string, alphabet: string = this.ALPHABET): string | null {
        return new BN(this.decode(encoded, alphabet), 10).toString(16) || null;
    }

    /**
     * Convert a string From a Base to another
     * @param {string} value Value
     * @param {number} from FromBase
     * @param {number} to ToBase
     */

    convert_base(value: string, from: number, to: number): string {
        return new BN(value, from).toString(to);
    }
}


const base62 = new Base62();
export default base62;