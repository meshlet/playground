using System;

namespace datastructuresalgorithms
{
    /**
     * Implements binary search using recursion.
     */
    public class RecursiveBinarySearch<T> where T : IComparable<T>
    {
        /**
         * Runs a recursive binary search.
         *
         * @return The index of the array entry that contains the
         *         value, -1 if value is not within the array.
         */        
        public static int Search(T[] array, T value)
        {
            return SearchInternal(array, value, 0, array.Length - 1);
        }

        private static int SearchInternal(T[] array, T value, int start_index, int end_index)
        {
            if (start_index > end_index)
            {
                // 'value' not in the array
                return -1;
            }

            int guess_index = (start_index + end_index) / 2;
            if (value.CompareTo(array[guess_index]) == 0)
            {
                // Found the value
                return guess_index;
            }
            else if (value.CompareTo(array[guess_index]) < 0)
            {
                // 'value' is lower than the current guess
                return SearchInternal(array, value, start_index, end_index - 1);
            }
            else
            {
                // 'value' is greater than the current guess
                return SearchInternal(array, value, start_index + 1, end_index);
            }
        }
    }
}
