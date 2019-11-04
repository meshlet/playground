using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the radix sort algorithm where the items are placed into
     * buckets based on the decimal digits. The algorithm starts with the
     * least significant digit and progresses to the most significant one.
     * The algorithm terminates when there are no more digits left in any
     * of the array items. Hence the time complexity of the algorithm is
     * O(N*W) where N is the number of array items and W is the maximal
     * number of decimal digits of any array item.
     */
    public class RadixSortDecimal
    {
        public static void Sort(long[] array)
        {
            // Return right away if array is empty or has 1 element
            if (array.Length <= 1)
            {
                return;
            }

            // Partition the array around 0
            int non_negative_partition_start = PartitionAroundZero(array);

            // Setup 10 buckets for each of the 10 decimal digits (from 0 to 9 or
            // from -9 to 0). Buckets are setup here and not in SortInternal to
            // avoid setting them up twice (when sorting the non-positive and
            // non-negative partitions). Note that buckets are cleared by each
            // call to SortInternal so one call to SortInternal won't affect
            // the other.
            DoublyLinkedList<long>[] buckets = new DoublyLinkedList<long>[10];
            for (int i = 0; i < buckets.Length; ++i)
            {
                buckets[i] = new DoublyLinkedList<long>();
            }

            // Radix sort the non-positive (left) partition of the array
            SortInternal(array, buckets, 0, non_negative_partition_start - 1, true);

            // Radix sort the non-negative (right) partition of the array
            SortInternal(array, buckets, non_negative_partition_start, array.Length - 1, false);
        }

        private static void SortInternal(
            long[] array, DoublyLinkedList<long>[] buckets, int start, int end,
            bool is_negative_partition)
        {
            // Return right away if partition is empty or has a single element
            if (start >= end)
            {
                return;
            }

            long divisor = 1;
            bool run = true;

            // The values are usually placed in their buckets using the current
            // digit as an index. This doesn't work for negative numbers though,
            // as their digits will be negative integers. Hence, if we're currently
            // sorting the partition with non-positive values, add '9' to the digit
            // value to form the index into the bucket. For digit value of -9 this
            // will result in index 0, and for digit 0 it will result in 9 which
            // means that negative numbers are properly sorted in the bucket.
            int bucket_offset = is_negative_partition ? 9 : 0;

            while (run)
            {
                run = false;

                // Iterate over the array and place items into the buckets according
                // to the value of the current decimal digit
                for (int i = start; i <= end; ++i)
                {
                    long tmp = array[i] / divisor;
                    long digit = (tmp % 10);
                    buckets[digit + bucket_offset].InsertLast(array[i]);

                    // If this is the last decimal digit for all array items we'll
                    // break the outer-most while loop
                    run = run || (tmp > 9 || tmp < -9);
                }

                // Next iteration handles the next decimal digit
                divisor *= 10;

                // Copy buckets' contents back to the array. For example, if array
                // contains items 36 and 37, the first iteration of the other most
                // do loop will place 36 into bucket 'i' and 37 into bucket 'i+1'.
                // The following for loop will copy these items back to the original
                // array in the sorted order ([...,36,...,37,...]). In the next
                // iteration of the outer most do loop, these items are placed in
                // the same bucket in which they will keep their order. In other
                // words, these sub-sorts are stable.
                long array_index = start;
                for (int i = 0; i < buckets.Length; ++i)
                {
                    while (!buckets[i].IsEmpty())
                    {
                        array[array_index++] = buckets[i].RemoveFirst();
                    }
                }
            }
        }

        private static int PartitionAroundZero(long[] array)
        {
            int start = 0;
            int end = array.Length - 1;
            int left_ptr = -1;
            int right_ptr = array.Length;

            while (true)
            {
                // Increment the left_ptr until an element greater or equal
                // to 0 is found or end of array is reached
                while (left_ptr < end && array[++left_ptr] < 0)
                {
                }

                // Decrement the right_ptr until an element lower or equal
                // to 0 is found or start of array is reached
                while (right_ptr > start && array[--right_ptr] > 0)
                {
                }

                // If left_ptr and right_ptr have overlapped, return the left_ptr
                // which points to the start of the right partition (values >= 0)
                if (left_ptr >= right_ptr)
                {
                    return left_ptr;
                }

                // Swap elements at left_ptr and right_ptr
                long tmp = array[left_ptr];
                array[left_ptr] = array[right_ptr];
                array[right_ptr] = tmp;
            }
        }
    }
}
