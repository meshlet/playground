using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the InsertionSort algorithm.
     */
    public class InsertionSort<T> where T : IComparable<T>
    {
        public static void Sort(T[] array)
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
