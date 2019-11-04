using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the binary RadixSort algorithm that iterates over all 64 bits
     * of a key and sorts items in bucket 0 or 1 based on the value of the bit
     * in the current iteration.The algorithm only differentiates between the
     * positive and negative numbers when MSB bit is reached: at that point the
     * negative numbers (those with MSB bit set to 1) are placed in the bucket
     * 0, and positive numbers (those with MSB bit set to 0) are placed in the
     * bucket 1 - for all the other bits this behavior is reversed.
     *
     * The implementation assumes that machine's integer binary representation
     * is such that both positive and negative numbers can be ordered among
     * themselves by comparing the individual bits (satisfied by the 2's complement
     * representation). For instance, in case of 4-bit 2's complement integers
     * -1 (1111) and -3 (1101), the algorithm will produce { -3, -1 } order
     * because bit 1 is equal to 1 in -1 and 0 in -3.
     *
     * The time complexity of this algorithm is O(64*N) as it iterates over the
     * array 64 times (once for each bit).    
     */
    public class RadixSortBinary
    {
        public static void Sort(long[] array)
        {
            // Return right away if empty or 1-element array is passed in
            if (array.Length <= 1)
            {
                return;
            }

            int num_bits = 8 * sizeof(long);
            ulong mask = 1;

            // Setup 2 buckets for 2 bits.
            DoublyLinkedList<long>[] buckets =
            {
                new DoublyLinkedList<long>(),
                new DoublyLinkedList<long>()
            };

            for (int bit_index = 0; bit_index < num_bits; ++bit_index)
            {
                // Whether the outer-most loop reached the most-significant bit
                ulong is_msb = Convert.ToUInt64(bit_index == num_bits - 1);

                for (int i = 0; i < array.Length; ++i)
                {
                    // Extract the bit at 'bit_index'. Note that array[i] must
                    // be cast to an unsigned long to make sure the right shift
                    // is a logical and not an arithmetic shift.
                    ulong bit = ((ulong)array[i] & mask) >> bit_index;

                    // If the current bit is 0 the item is placed in the bucket
                    // 0, and if it's 1 then its placed in the bucket 1 unless
                    // this is a MSB bit. For MSB bit this behavior is reversed
                    // so that negative numbers (those with MSB bit 1) are placed
                    // in the bucket 0 while positive numbers (those with MSB bit
                    // 0) are placed in the bucket 1. In other words, the bucket
                    // index is equal to 'bit' if 'is_msb' is 0 and to '!bit' if
                    // 'is_mbs' is 1. Truth table shows that this is actually XOR
                    // operation of 'bit' and 'is_msb' bits.
                    buckets[bit ^ is_msb].InsertLast(array[i]);
                }

                int array_index = 0;
                for (int bucket_index = 0; bucket_index < buckets.Length; ++bucket_index)
                {
                    while (!buckets[bucket_index].IsEmpty())
                    {
                        array[array_index++] = buckets[bucket_index].RemoveFirst();
                    }
                }

                // Shift the mask so that next iteration of the outer-most loop
                // selects the next bit to the left
                mask = mask << 1;
            }
        }
    }
}
