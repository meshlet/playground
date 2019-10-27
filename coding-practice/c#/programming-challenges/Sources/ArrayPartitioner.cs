using System;

namespace programmingchallenges
{
    public class ArrayPartitioner
    {
        /**
         * Partitions an array in two partitions given the pivot value. The
         * lgorithm will rearrange the array in such a way that its left partition
         * contains only values lower than pivot, and the right partition contains
         * only values larger or equal to the pivot. There is no guarantees about
         * the ordering of values in either partition.
         *
         * For input array: { 33, 0, -1, 5, 10, 7, 8, 11, -5, -2, 4, 13 }
         * algoritm produces:
         * { 4, 0, -1, 5, -2, -5, 8, 11, 7, 10, 33, 13 } and returns 6 which is
         * the index of the first element of the right partition of the array (
         * values greater or equal to the pivot). If all values in the array
         * are greater or equal to the pivot (none of the values are moved) the
         * algorithm will return 0 (the start of the array is also the start of
         * the right partition of the array). If all values in the array are lower
         * than the pivot, the algorithm returns the Array.Length indicating that
         * the right partition of the array is empty.
         *
         * @param[in,out] array  The array to partition.
         * @param         pivot  The pivot value.
         *
         * @return The index of the first element in the right partition of the
         *         array (values greater or equal to the pivot). -1 is returned
         *         if the array is empty.        
         */
        public static int Partition<T>(T[] array, T pivot) where T : IComparable<T>
        {
            // Handle empty array as a special case
            if (array.Length == 0)
            {
                return -1;
            }

            int left_ptr = -1, right_ptr = array.Length;

            while (true)
            {
                // Increment the left_ptr until an element greater or equal to
                // the pivot is found
                do
                {
                    ++left_ptr;
                } while (left_ptr < array.Length && array[left_ptr].CompareTo(pivot) < 0);

                // Decrement the right_ptr until an element lower than the pivot
                // is found
                do
                {
                    --right_ptr;
                } while (right_ptr >= 0 && array[right_ptr].CompareTo(pivot) >= 0);

                if (left_ptr >= right_ptr)
                {
                    break;
                }
                else
                {
                    // Swap the array[left_ptr] and array[right_ptr] elements, so that array[left_ptr]
                    // lands in the right partition of the array where values are >= pivot and
                    // array[right_ptr] lands in the left partition of the array where values are < pivot.
                    T tmp = array[left_ptr];
                    array[left_ptr] = array[right_ptr];
                    array[right_ptr] = tmp;
                }
            }

            // right_ptr + 1 always points to the beginning of the right partition of the array
            return right_ptr + 1;
        }
    }
}
