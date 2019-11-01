using System;
using System.Diagnostics;

namespace datastructuresalgorithms
{
    /**
     * Implements the QuickSort algorithm with median-of-three approach for
     * selecting the pivot. The algorithm takes the first, last and middle
     * elements of the current sub-array, finds the median of these values
     * and uses that as a pivot.
     *
     * Such pivot selection avoids the issue of performance degrading to
     * O(N^2) in case of an array sorted in reverse (that can appear if
     * pivot is selected as the right-most element of the sub-array). It
     * also removes the need to check whether right_ptr has gone past the
     * start of the array - with the median-of-three approach the element
     * at the start of the array will always be lower or equal to the pivot
     * meaning right_ptr can never pass it by.
     */    
    public class QuickSortMedianOfThree
    {
        public static void Sort<T>(T[] array) where T : IComparable<T>
        {
            SortInternal(array, 0, array.Length - 1);
        }

        private static void SortInternal<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            if (end - start <= 2)
            {
                // Arrays with 3 or fewer elements are manually sorted
                ManualSort(array, start, end);
            }
            else
            {
                int right_partition_start_index = Partition(array, start, end);

                // Sort the left partition
                SortInternal(array, start, right_partition_start_index - 1);

                // Sort the right partition (skip the current pivot which is
                // at the beginning of the right partition)
                SortInternal(array, right_partition_start_index + 1, end);
            }
        }

        private static int Partition<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            T pivot = MedianOfThree(array, start, end);

            // left_ptr is pointed to just before the current partition, as it
            // incremented before used
            int left_ptr = start - 1;

            // right_ptr is pointed to the end of current partition. As it is
            // decremented before used this means that the pivot (which is always
            // the right-most element in the partition) is skipped which is what
            // we want
            int right_ptr = end;

            while (true)
            {
                // Increment the left_ptr until a value greater or equal to the
                // pivot is found
                while (array[++left_ptr].CompareTo(pivot) < 0)
                {
                }

                // Decrement the right_ptr until a value smaller or equal to the
                // pivot is found
                while (array[--right_ptr].CompareTo(pivot) > 0)
                {
                }

                if (left_ptr >= right_ptr)
                {
                    // left_ptr now points to the start of the right partition.
                    // Swap this element with the pivot (which is at the right-
                    // most index), which will be the pivot's final place.
                    Swap(array, left_ptr, end);

                    return left_ptr;
                }

                // Swap the values at left_ptr and right_ptr. This swap will place
                // the array[left_ptr] in the partition of values >= pivot and
                // array[right_ptr] in the partition of values <= pivot.
                Swap(array, left_ptr, right_ptr);
            }
        }

        /**
         * @brief Finds pivot as a median of {array[start], array[middle], array[end]}.
         *
         * The method also orders the elements in the following order: {min, max, median}
         * because the algorithm requires the pivot (median value) to be the right-most
         * element of the sub-array.
         *
         * @param[in,out] array   An array that is being sorted.
         * @param         start   The index where the current sub-array starts.
         * @param         end     The index where the current sub-array ends.
         *
         * @return The median of {array[start], array[middle], array[end]}.
         */        
        private static T MedianOfThree<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            int middle = (start + end) / 2;

            // Sort the start and end
            if (array[start].CompareTo(array[end]) > 0)
            {
                Swap(array, start, end);
            }

            // Sort start and middle
            if (array[start].CompareTo(array[middle]) > 0)
            {
                Swap(array, start, middle);
            }

            // At this point, pivot is either at 'middle' or 'end' index. The
            // algorithm wants it at the 'end' index however, so do the swap
            // only if its not already there
            if (array[middle].CompareTo(array[end]) < 0)
            {
                Swap(array, middle, end);
            }

            // Return the median of three value which is now placed at the
            // index 'end'
            return array[end];
        }

        /**
         * @brief Manually sorts the 1-, 2- or 3-elements sub-array.
         */
        private static void ManualSort<T>(T[] array, int start, int end) where T : IComparable<T>
        {
            // Empty (only possible if user provides empty array to the sorting
            // method) or single-element sub-array
            if (end <= start)
            {
                return;
            }

            // Sort start and end
            if (array[start].CompareTo(array[end]) > 0)
            {
                Swap(array, start, end);
            }

            // Need to do more sorting if this is 3-elements sub-array
            if (end - start > 1)
            {
                int middle = start + 1;

                // Sort start and middle
                if (array[start].CompareTo(array[middle]) > 0)
                {
                    Swap(array, start, middle);
                }

                // Sort middle and end
                if (array[middle].CompareTo(array[end]) > 0)
                {
                    Swap(array, middle, end);
                }
            }
        }

        private static void Swap<T>(T[] array, int index0, int index1)
        {
            T tmp = array[index0];
            array[index0] = array[index1];
            array[index1] = tmp;
        }
    }
}
