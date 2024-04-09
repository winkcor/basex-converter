# baseX-converter
[![NPM Package](https://img.shields.io/npm/v/npm.svg?logo=npm)](https://www.npmjs.org/package/basex-converter)
![NPM License](https://img.shields.io/npm/l/basex-converter)
![npm bundle size](https://img.shields.io/bundlephobia/min/basex-converter)


Due to the limitation of JavaScript's integer representation, which is limited to 53 bits, handling large numbers for
encryption tasks can be challenging. Existing libraries run into problems when dealing with such values;  
To fix this limitation, This library provides encoding of large numbers. This library provides the
following features:

> Encoding and decoding of various data types:
> - Regular numerical values
> - Hexadecimal values
> - Binary data as Uint8Array
>
> Base Conversion: This library provides a multipurpose convert_base() function that can convert a value from any base
> to another base without rounding off and size restriction

By overcoming JavaScript's integer limitations, this library allows developers to efficiently work with large numbers in
encoding and base conversion tasks.

### __Be careful, spaces(" ") in the whole value and zeros(0) at the beginning of the value being ignored__

<hr>

default alphabet: `"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"`  
inverted alphabet: `"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"`  
default base: `62`

### Alphabets

See below for a list of commonly recognized alphabets, and their respective base.

|  Base  | Import Name             | Alphabet                                                              |
|:------:|:------------------------|-----------------------------------------------------------------------|
|   2    | ALPHABET_BASE2          | `01`                                                                  |
|   8    | ALPHABET_BASE8          | `01234567`                                                            |
|   11   | ALPHABET_BASE11         | `0123456789a`                                                         |
|   16   | ALPHABET_BASE16         | `0123456789abcdef`                                                    |
|   32   | ALPHABET_BASE32         | `0123456789ABCDEFGHJKMNPQRSTVWXYZ`                                    |
|   36   | ALPHABET_BASE36         | `0123456789abcdefghijklmnopqrstuvwxyz`                                |
|   58   | ALPHABET_BASE58         | `123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`          |
|   62   | ALPHABET_BASE62_Default | `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`      |
|   64   | ALPHABET_BASE64         | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`    |
|   67   | ALPHABET_BASE67         | `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~` |

# Getting started
<hr>

### Installation

```bash
npm install base-62
```

Alternatively using Yarn:

```bash
yarn add base-62
```

### Usage

<hr>

#### Import

```typescript
import base62 from 'base62';
// or for making instance with custom alphabet
import {Base62, ALPHABET_BASE62_Default, ALPHABET_BASE62_INVERTED, BASE_DEFAULT} from 'base62';
```
#### Commonjs require
```typescript
const base62 = require('base62').default;
const {Base62, ALPHABET_BASE62_Default, ALPHABET_BASE62_INVERTED, BASE_DEFAULT} = require('base62');
```
```typescript
base62.decode('base62');
// '34441886726'
base62.encode('34441886726');
// 'base62'
```

This library provides the ability to change the alphabet and base for encoding and decoding. However, changing the base
is not recommended unless you are sure that the chosen base works without error.  
But the alphabet can be changed without functional problems. it just sensitive to "space" character and we can not use
it.

```typescript
import base62, {
    ALPHABET_BASE58,
    ALPHABET_BASE62_INVERTED,
} from 'base62';
// make instance
const base62 = new Base62();
// make another base
const base62 = new Base62(ALPHABET_BASE58, 58);;
// or you can set alphabet
const base62 = new Base62('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
// or base
const base62 = new Base62('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 62);
```

#### Can pass custom alphabet for each converting

```typescript
base62.decode('base62', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
// '34441886726'
base62.encode('34441886726', '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
// 'base62'
```

#### Change alphabet or base, for changing base you should set a compatible alphabet too

```typescript
import base62, {
    ALPHABET_BASE58,
    ALPHABET_BASE62_INVERTED,
} from 'base62';
// use costom alphabet
base62.setAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
// or use existing ones
base62.setAlphabet(ALPHABET_BASE62_INVERTED);
base62.setBaseAlphabet(ALPHABET_BASE58, 58);
```

### Encode and decode bytes

```typescript
base62.encode_bytes(new Uint8Array([0x01, 0x01]));
// '49'
base62.decode_bytes('49');
// Uint8Array(2) [ 1, 1 ]
```

### Encode and decode hex

#### This function is useful to encode and decode MongoDB ObjectId too

```typescript
base62.encode_hex('604a38563');
// 'sdg16r'
base62.decode_hex('sdg16r');
// '604a38563'

// encode and decode mongodb objectid
base62.encode_hex('63d91de18f092ab964484b9e');
// 'eBhQNIyMqR6WH3XS'
base62.decode_hex('eBhQNIyMqR6WH3XS');
// '63d91de18f092ab964484b9e'
```

### Base converter

#### This function is able to convert any base to another with no limit on the size of value

```typescript
base62.convert_base('ff', 16, 10);
// '255'
base62.convert_base('wiv', 36, 10);
// '42151'
base62.convert_base('123456789123456789123456789123456789123456789', 10, 16);
// '58936e53d139afefabb2683f150b684045f15'
```
