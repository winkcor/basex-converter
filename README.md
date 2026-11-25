# basex-converter

[![NPM Package](https://img.shields.io/npm/v/basex-converter?logo=npm)](https://www.npmjs.org/package/basex-converter)
![NPM License](https://img.shields.io/npm/l/basex-converter)
![NPM Types](https://img.shields.io/npm/types/basex-converter)
![npm bundle size](https://img.shields.io/bundlephobia/min/basex-converter)
![NPM Download](https://badgen.net/npm/dm/basex-converter)


JavaScript numbers cannot exactly represent integers larger than 2^53 - 1. This library uses arbitrary-precision
integers to encode and convert large values without that limitation. Encoding is not encryption.

## Features

- Regular numerical values
- Hexadecimal values
- Binary data as Uint8Array
- Base conversion with `convert_base()`, without rounding or a fixed value-size limit

For large integer inputs, pass decimal values as strings to avoid JavaScript number precision loss.

> [!CAUTION]  
> Numeric encodings represent a number, so leading zeroes are not preserved. Use the byte methods when leading zero
> bytes must be preserved. Do not include spaces in encoded values.

<hr>

Default alphabet: `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"`  
Inverted alphabet: `"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"`  
Default base: `62`

### Alphabets

See below for a list of commonly recognized alphabets, and their respective base.

| Base | Import Name             | Alphabet                                                              |
|:----:|:------------------------|-----------------------------------------------------------------------|
|  2   | ALPHABET_BASE2          | `01`                                                                  |
|  8   | ALPHABET_BASE8          | `01234567`                                                            |
|  11  | ALPHABET_BASE11         | `0123456789a`                                                         |
|  16  | ALPHABET_BASE16         | `0123456789abcdef`                                                    |
|  32  | ALPHABET_BASE32         | `0123456789ABCDEFGHJKMNPQRSTVWXYZ`                                    |
|  36  | ALPHABET_BASE36         | `0123456789abcdefghijklmnopqrstuvwxyz`                                |
|  58  | ALPHABET_BASE58         | `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`          |
|  62  | ALPHABET_BASE62_Default | `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`      |
|  64  | ALPHABET_BASE64         | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`    |
|  67  | ALPHABET_BASE67         | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~` |

## Getting started

### Installation

```bash
pnpm add basex-converter
```

Alternatively using npm:

```bash
npm install basex-converter
```

Alternatively using Yarn:

```bash
yarn add basex-converter
```

### Usage

<hr>

#### Import

```typescript
import base62 from 'basex-converter';
// or for making instance with custom alphabet
import { Base62, ALPHABET_BASE62_Default, ALPHABET_BASE62_INVERTED, BASE_DEFAULT } from 'basex-converter';
```

#### CommonJS require

```typescript
const base62 = require('basex-converter').default;
const { Base62, ALPHABET_BASE62_Default, ALPHABET_BASE62_INVERTED, BASE_DEFAULT } = require('basex-converter');
```

```typescript
console.log(base62.decode('base62'));
// '34441886726'
console.log(base62.encode('34441886726'));
// 'base62'
```

### Encode and decode bytes

```typescript
console.log(base62.encode_bytes(new Uint8Array([0x01, 0x01])));
// '49'
console.log(base62.decode_bytes('49'));
// Uint8Array(2) [ 1, 1 ]
```

### Encode and decode hex

#### This function is useful to encode and decode MongoDB ObjectId too

```typescript
console.log(base62.encode_hex('604a38563'));
// 'SDG16R'
console.log(base62.decode_hex('SDG16R'));
// '604a38563'

// encode and decode mongodb objectid
console.log(base62.encode_hex('63d91de18f092ab964484b9e'));
// 'eBhQNIyMqR6WH3XS'
console.log(base62.decode_hex('eBhQNIyMqR6WH3XS'));
// '63d91de18f092ab964484b9e'
```

### Base conversion

Convert between bases without a fixed value-size limit:

```typescript
console.log(base62.convert_base('ff', 16, 10));
// '255'
console.log(base62.convert_base('wiv', 36, 10));
// '42151'
console.log(base62.convert_base('123456789123456789123456789123456789123456789', 10, 16));
// '58936e53d139afefabb2683f150b684045f15'
```


You can change the alphabet and base. The alphabet must contain exactly one unique character per base value. When
changing the base, provide a compatible alphabet as well.

```typescript
import { Base62, ALPHABET_BASE58 } from 'basex-converter';

const defaultBase = new Base62();
const base58 = new Base62(ALPHABET_BASE58, 58);
const customAlphabet = new Base62('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
const customBase = new Base62('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 62);
```

#### Passing a custom alphabet

```typescript
console.log(base62.decode('base62', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'));
// '34441886726'
console.log(base62.encode('34441886726', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'));
// 'base62'
```

#### Changing the alphabet or base

```typescript
import base62, { ALPHABET_BASE58, ALPHABET_BASE62_INVERTED } from 'basex-converter';
// Use a custom alphabet with the current base
base62.setAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
// Or use a predefined alphabet
base62.setAlphabet(ALPHABET_BASE62_INVERTED);
// Change both the alphabet and base together
base62.setBaseAlphabet(ALPHABET_BASE58, 58);
```