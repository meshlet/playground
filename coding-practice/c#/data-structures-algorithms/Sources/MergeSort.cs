using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the MergeSort algorithm.
     *
     * The array is sorted in ascending order.
     */
    public class MergeSort<T> where T : IComparable<T>
    {
        public static void Sort(T[] inarray)
        {
            // For empty or single-element arrays return right away
            if (inarray.Length <= 1)
            {
                return;
            }

            // Allocate a temporary array of the same size as the input array
            T[] tmp_array = new T[inarray.Length];

            // Run sorting and then copy tmp_array to inarray.
            Split(inarray, tmp_array, 0, inarray.Length - 1);
        }

        /**
         * Recursively splits the array in halves until a single element is left.
         *
         * After splitting is done the method calls the Merge method to merge the
         * left and right arrays into a single sorted array.
         */        
        private static void Split(T[] inarray, T[] tmp_array, int start_index, int end_index)
        {
            if (start_index == end_index)
            {
                // This is sub-array with a single element
                return;
            }

            int left_array_end_index = (start_index + end_index) / 2;

            // Split the left half
            Split(inarray, tmp_array, start_index, left_array_end_index);

            // Split the right half
            Split(inarray, tmp_array, left_array_end_index + 1, end_index);

            // Merge the two halves together
            Merge(inarray, tmp_array, start_index, left_array_end_index, end_index);
        }

        /**
         * Merges left and right arrays into a single sorted array.
         *
         * Note that sorting is done directly to the tmp_array to a region
         * specified by the left and right array indices.
         */        
        private static void Merge(
            T[] inarray, T[] tmp_array, int left_array_start_index, int left_array_end_index,
            int right_array_end_index)
        {
            int tmp_array_index = left_array_start_index;
            int left_array_index = left_array_start_index;
            int right_array_index = left_array_end_index + 1;

            // The following loop merges arrays as long as there are elements left
            // in both left and right array. After this loop the only thing that is
            // potentially left is to simply copy the rest of the non-empty array
            // to the tmp_array. Only left or right array can be non-empty, but not both.
            while (left_array_index <= left_array_end_index && right_array_index <= right_array_end_index)
            {
                if (inarray[left_array_index].CompareTo(inarray[right_array_index]) <= 0)
                {
                    tmp_array[tmp_array_index] = inarray[left_array_index++];
                }
                else
                {
                    tmp_array[tmp_array_index] = inarray[right_array_index++];
                }

                ++tmp_array_index;
            }

            // If left array isn't empty copy its remaining items to the tmp_array
            while (left_array_index <= left_array_end_index)
            {
                tmp_array[tmp_array_index++] = inarray[left_array_index++];
            }

            // If right array isn't empty copy its remaining items to the tmp_array
            while (right_array_index <= right_array_end_index)
            {
                tmp_array[tmp_array_index++] = inarray[right_array_index++];
            }

            // Copy merged array back to the original array
            for (int i = left_array_start_index; i <= right_array_end_index; ++i)
            {
                inarray[i] = tmp_array[i];
            }
        }
    }
}
