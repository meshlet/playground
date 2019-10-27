using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the QuickSort algorithm where pivot is selected as the right-most
     * element of the partition. The performance of this implementation can degenerate
     * to O(n^2) in with certain layouts of the array data (for example, if the array
     * is sorted in reverse order this QuickSort implementation will degrate to
     * O(n^2) time complexity).
     */
    public class QuickSortBasic
    {
        public static void Sort<T>(T[] array) where T : IComparable<T>
        {
            SortInternal(array, 0, array.Length - 1);
        }

        private static void SortInternal<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            if (end - start <= 0)
            {
                // Return right away as this is either an empty or single-element
                // array
                return;
            }

            // Partition the sub-array (after which the pivot is placed in its
            // final place in the array
            int final_pivot_index = Partition(array, start, end);

            // Sort the left partition
            SortInternal(array, start, final_pivot_index - 1);

            // Sort the right partition
            SortInternal(array, final_pivot_index + 1, end);
        }
        private static int Partition<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            // Pivot is the right-most element of this subarray
            T pivot = array[end];

            // left_ptr is initialized to the index of the element right before
            // the start of this sub-array because left_ptr is incremented before
            // it is used
            int left_ptr = start - 1;

            // right_ptr is initialized to the index of the right-most element
            // in this sub-array because the pivot shouldn't be included in the
            // partitioning itself. right_ptr is also decremented before it is
            // used
            int right_ptr = end;

            while (true)
            {
                // Increment the left_ptr until an element greater or equal to
                // the pivot is found
                while (pivot.CompareTo(array[++left_ptr]) > 0) { }

                // Increment the right_ptr until an element lower or equal to
                // the pivot is found
                while (right_ptr > start && pivot.CompareTo(array[--right_ptr]) < 0) { }

                if (left_ptr >= right_ptr)
                {
                    // left_ptr now holds the index of the first element in the right
                    // right partition. Swap the pivot and this element, which effectively
                    // places pivot in its final position
                    array[end] = array[left_ptr];
                    array[left_ptr] = pivot;

                    return left_ptr;
                }
                else
                {
                    // Swap the array[left_ptr] and array[right_ptr] so that array[left_ptr]
                    // ends up in the right partition of the array (elements greater or equal
                    // to the pivot) and array[right_ptr] ends up in the left partition of
                    // the array (elements lower or equal to the pivot)
                    T tmp = array[left_ptr];
                    array[left_ptr] = array[right_ptr];
                    array[right_ptr] = tmp;
                }
            }
        }
    }
}
