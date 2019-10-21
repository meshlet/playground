using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the InsertionSort algorithm.
     */
    public class InsertionSort
    {
        public static void Sort<T>(T[] array) where T : IComparable<T>
        {
            for (int i = 0; i < array.Length; ++i)
            {
                T tmp = array[i];
                int j = i - 1;
                for (; j >= 0 && tmp.CompareTo(array[j]) < 0; --j)
                {
                    array[j + 1] = array[j];
                }

                // Put the current element in its place
                array[j + 1] = tmp;
            }
        }
    }
}
