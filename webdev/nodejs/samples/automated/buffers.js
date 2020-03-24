/**
 * Illustrates the NodeJS buffers. NodeJS buffers are used to
 * represent binary data.
 */
const assert = require("assert").strict;

describe("Buffers", function () {
    it('illustrates creating buffers', function () {
        // Creates a zero-filled buffer of length 10 (bytes)
        const buf1 = Buffer.alloc(10);
        buf1.equals(Buffer.allocUnsafe(10).fill(0));

        // Creates a buffer of length 10 bytes and initializes each
        // element to 1
        const buf2 = Buffer.alloc(10, 1);
        buf2.equals(Buffer.allocUnsafe(10).fill(1));

        // Creates an uninitialized buffer. Allocation buffers with
        // `allocUnsafe` is faster than allocating with `alloc`,
        // however care must be taken because the data that previously
        // resided at given memory range will be accessible. Hence,
        // care must be taken to avoid leaking information.
        const buf3 = Buffer.allocUnsafe(10);

        // Creates a buffer from an array
        const buf4 = Buffer.from([1, 50, 3]);
        buf4.equals(Buffer.from([1, 50, 3]));

        // Creates a buffer from an array. Note that some of the values
        // in the array are out of [0, 255] scope. These are truncated
        // with (value & 255) to make them fit into a single byte. Strings
        // are converted to numbers before truncation.
        const buf5 = Buffer.from([257, 113, "10", -1]);
        buf5.equals(Buffer.from([1, 113, 10, 255]));

        // Creates a buffer containing UTF-8 encoded bytes for the string
        // `tést`. Note that `é` is encoded as two bytes
        const buf6 = Buffer.from("tést");
        buf6.equals(Buffer.from([0x74, 0xc3, 0xa9, 0x73, 0x74]));

        // Creates a buffer containing Latin-1 encoded bytes for the string
        // `tést`. Character `é` is encoded as single byte in this encoding
        const buf7 = Buffer.from("tést", "latin1");
        buf7.equals(Buffer.from([0x74, 0xe9, 0x73, 0x74]));
    });

    it('illustrates converting between buffers and strings', function () {
        // Create a buffer from a string using UTF-8 encoding (this is the
        // default). Then, convert the buffer to hex string using the
        // Buffer.toString method. UTF-8 is a multi-byte encoding where
        // each character is encoded with 1 or more bytes.
        const buf1 = Buffer.from("au}ÆÐ", "utf8");
        assert.deepEqual(buf1.toString("hex"), "61757dc386c390");
        assert.deepEqual(buf1.toString("utf8"), "au}ÆÐ");

        // Create a buffer from a string using latin1 encoding. Then, convert
        // the buffer to base64 string. Latin1 encoding supports only unicode
        // characters from U+0000 to U+00FF.
        const buf2 = Buffer.from("au}ÆÐ", "latin1");
        assert.deepEqual(buf2.toString("base64"), "YXV9xtA=");

        // Create a buffer from a string using U+0000 to U+00FF encoding. Then, convert
        // the buffer to hex string. The U+0000 to U+00FF encodes every character in
        // 2 or 4 bytes and bytes in a single character respect little-endian ordering
        // (the least significant byte placed first and the most significant byte placed
        // last)
        const buf3 = Buffer.from("au}ÆÐ", "utf16le");
        assert.deepEqual(buf3.toString("hex"), "610075007d00c600d000");
    });

    it('illustrates converting from binary strings to buffers', function () {
        // Creates a buffer from a binary hex string
        const buf1 = Buffer.from("91ab3f11de0c", "hex");
        buf1.equals(Buffer.from([0x91, 0xab, 0x3f, 0x11, 0xde, 0x0c]));

        // Creates a buffer from a binary hex string that ends with a
        // non-hexadecimal value. That value is simply ignored
        const buf2 = Buffer.from("88a5fe04q", "hex");
        buf2.equals(Buffer.from([0x88, 0xa5, 0xfe, 0x04]));

        // Creates a buffer from a binary hex string that ends with a
        // non-hexadecimal value. Ignoring this value leaves the hex
        // string with odd number of characters, hence conversion will
        // also ignore the last hex digit
        const buf3 = Buffer.from("7f1b55eca29q", "hex");
        buf3.equals(Buffer.from([0x7f, 0x1b, 0x55, 0xec, 0xa2]));
    });

    it('illustrates different buffer allocation methods', function () {
        // Buffer.alloc allocates the buffer of given `size` bytes and
        // fills the memory (zeroed by default).
        const buf1 = Buffer.alloc(5, 0x11);
        buf1.equals(Buffer.allocUnsafe(5).fill(0x11));

        // Buffer.allocUnsafe allocates the buffer of given `size` bytes
        // but does not fill the memory. Additionally, the buffer will
        // be created in the pre-allocated memory pool if requested buffer
        // size is: bufSize <= Buffer.poolSize / 2. These two features of
        // Buffer.allocUnsafe make it measurably more efficient than the
        // Buffer.alloc method. However, as the buffer memory is not
        // cleared, buffer memory may contain sensitive data.
        const buf2 = Buffer.allocUnsafe(7);
        buf2.fill(0x0a);
        buf2.equals(Buffer.from(Array(7).fill(0x8a)));

        // Buffer.allocUnsafeSlow is similar to Buffer.allocUnsafe, the
        // difference being that it will always allocate new memory for
        // the buffer instead of using the pre-allocated memory pool.
        // Using this method is appropriate when we want to keep a buffer
        // around for indeterminate amount of time. This helps reducing
        // the pre-allocated memory pool consumption so that more ad-hoc
        // buffers may be created from the pool
        const buf3 = Buffer.allocUnsafeSlow(6);
        buf3.fill(0x99);
        buf3.equals(Buffer.from(Array(6).fill(0x99)));
    });

    it('illustrates Buffer.byteLength method', function () {
        // The following string contains some unicode characters
        // that are encoded with multiple bytes in UTF-8 encoding
        let str = "¼ + ¾ = 1";

        // The length of this string is 9 (4 whitespace characters and
        // 5 other characters)
        assert.equal(str.length, 9);

        // Buffer.byteLength tells us the length of a string in
        // bytes when encoded with the specified encoding. For
        // example, the string above is encoded with 11 bytes if
        // UTF-8 is used: ¼ and ¾ are encoded with 2 bytes and
        // the other characters are all encoded with one byte.
        assert.equal(Buffer.byteLength(str, "utf8"), 11);
    });

    it('illustrates Buffer.compare and buf1.compare(buf2) methods', function () {
        // Buffer.compare can be used to compare binary buffers. If one buffer
        // has fewer bytes than the other, it's shifted left to match to match
        // the length of the larger buffer with zeros shifted in (i.e. if buf1
        // is 876 and buf2 is 90, buf2 is extended to 900). The comparison then
        // starts with the MSB and proceeds until reaching the point where buf1
        // and buf2 bytes differ - if buf1.byte < buf2.byte negative value is
        // returned and if buf1.byte > buf2.byte positive value is returned. If
        // all bytes in both buffers are found to be equal, the original buffers'
        // length is checked. If their lengths match the buffers are considered
        // equal and 0 is returned. If buf1.length < buf1.length negative value
        // is returned, otherwise positive value is returned.
        assert.ok(
            Buffer.compare(Buffer.from("1234"), Buffer.from("0934")) > 0
        );
        assert.ok(
            Buffer.compare(Buffer.from("000000"), Buffer.from("54")) < 0
        );
        assert.ok(
            Buffer.compare(Buffer.from("1234"), Buffer.from("1234")) === 0
        );
        assert.ok(
            Buffer.compare(Buffer.from("900"), Buffer.from("0900")) > 0
        );
        assert.ok(
            Buffer.compare(Buffer.from("0000"), Buffer.from("00")) > 0
        );
        assert.ok(
            Buffer.compare(Buffer.from("569023"), Buffer.from("9")) < 0
        );

        // buf1.compare(buf2) instance method works exactly the same way
        assert.ok(
            Buffer.from("1234").compare(Buffer.from("0934")) > 0
        );
        assert.ok(
            Buffer.from("000000").compare(Buffer.from("54")) < 0
        );
        assert.ok(
            Buffer.from("1234").compare(Buffer.from("1234")) === 0
        );
        assert.ok(
            Buffer.from("900").compare(Buffer.from("0900")) > 0
        );
        assert.ok(
            Buffer.from("0000").compare(Buffer.from("00")) > 0
        );
        assert.ok(
            Buffer.from("569023").compare(Buffer.from("9")) < 0
        );
    });

    it('illustrates Buffer.concat method', function () {
        // Concatenate several buffers using Buffer.concat
        const concatBuf1 = Buffer.concat([
            Buffer.from("090802", "hex"),
            Buffer.from("0203", "hex"),
            Buffer.from("000000", "hex")
        ]);
        assert.equal(concatBuf1.length, 8);
        concatBuf1.equals(Buffer.from([9, 8, 2, 2, 3, 0, 0, 0]));

        // Buffer.concat also accepts the `totalLength`. If the combined
        // length of all concatenated buffers exceeds the `totalLength`
        // the resulting buffer is truncated to totalLength.
        const concatBuf2 = Buffer.concat([
            Buffer.from("8ab011", "hex"),
            Buffer.from("aabb", "hex"),
            Buffer.from("7100bff429", "hex")
        ], 2);

        // The resulting buffer must have length of two bytes
        assert.equal(concatBuf2.length, 2);
        concatBuf2.equals(Buffer.from([0x8a, 0xb0]));
    });

    it('illustrates creating Buffer view of native ArrayBuffer', function () {
        // Create a native JavaScript Uint16Array array
        const uint8Arr = new Uint8Array(4);
        uint8Arr[0] = 30;
        uint8Arr[1] = 235;
        uint8Arr[2] = 90;
        uint8Arr[3] = 147;

        // Create a Buffer that shares the memory with uint8Arr. In other
        // words, the following buffer is a view of the uint8Arr (or more
        // precisely, the view of the underlying ArrayBuffer)
        const buf = Buffer.from(uint8Arr.buffer);
        buf.equals(uint8Arr);

        // Changing the original typed array changes the buffer
        uint8Arr[1] = 245;
        uint8Arr[3] = 0;
        buf.equals(uint8Arr);

        // And vice-versa
        buf[0] = 0;
        buf[2] = 255;
        buf.equals(uint8Arr);
    });

    /**
     * NodeJS Buffer objects may be allocated from the pre-allocated memory
     * pool (for example, buffers allocated with Buffer.allocUnsafe). The
     * pre-allocated memory pool is essentially an ArrayBuffer whose length
     * is the pool size. The buffers backed by the memory regions of this
     * ArrayBuffers are essentially its data views. Thus, buffers created
     * this way might have non-zero bufferOffset, because they don't start
     * at the very beginning of the pre-allocated ArrayBuffer.
     *
     * This becomes important when creating another view of this buffer.
     * For this to work properly the actual byteOffset must be used, making
     * sure that the view covers the correct region of the pre-allocated
     * NodeJS ArrayBuffer.
     */
    it('illustrates creating data view of NodeJS Buffer', function () {
        // Create a buffer using Buffer.allocUnsafe. Considering the size
        // of the buffer is rather small, the buffer should be allocated
        // from the pre-allocated ArrayBuffer. Assuming that other buffers
        // have already been allocated from that memory pool, the byteOffset
        // of this buffer will be non-zero
        const buf1 = Buffer.allocUnsafe(10);
        buf1.fill(0x0A);

        // Create another buffer that will share the memory with buf1. To
        // make this work even if buf1 has non-zero byteOffset we have to
        // pass this offset to the Buffer.from method
        const buf2 = Buffer.from(buf1.buffer, buf1.byteOffset, buf1.length);
        buf2.equals(buf1);

        // The same procedure must be followed when creating a native typed
        // array that shares memory with a NodeJS buffer
        const typedArr = new Uint8Array(buf1.buffer, buf1.byteOffset, buf1.length);
        buf1.equals(typedArr);
    });

    it('illustrates buf.copy method', function () {
        // Create two buffers
        const buf1 = Buffer.from("01234", "utf8");
        const buf2 = Buffer.from("56789", "utf8");

        // Copy buf1 bytes 2 and 3 to buf2 starting at byte 3 of buf2
        buf1.copy(buf2, 3, 2, 4);
        buf2.equals(Buffer.from("56723", "utf8"));

        // Create another buffer
        const buf3 = Buffer.from("abcdefghij", "utf8");

        // Copy first 4 bytes of buf3 back to buf3 starting at byte
        // 2. Note that the source and target regions overlap which
        // is handled by buf.copy method
        buf3.copy(buf3, 2, 0, 4);
        buf3.equals(Buffer.from("ababcdghij", "utf8"));
    });

    it('illustrates buf.subarray method', function () {
        // Create a buffer
        const buf1 = Buffer.from("abcdefgh");

        // Create another buffer using buf1.subarray. This buffer shares
        // the memory with the buf1
        const buf2 = buf1.subarray(2, 6);
        buf2.equals(Buffer.from("cdef"));

        // Using negative indices in `subarray` method causes the slices
        // to be calculated from the end of the buffer (i.e. -1 will be
        // buf.length - 1 and so on)
        const buf3 = buf1.subarray(-5, -1);
        buf3.equals(Buffer.from("defg"));
    });

    it('illustrates buf.toJSON method', function () {
        assert.deepEqual(
            Buffer.from([0x90, 0xa5, 0x11, 0x2c]).toJSON(),
            {
                "type": "Buffer",
                "data": [0x90, 0xa5, 0x11, 0x2c]
            }
        );
    });
});