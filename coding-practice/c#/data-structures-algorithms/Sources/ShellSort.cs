using System;

namespace datastructuresalgorithms
{
    /**
     * Implements the shell sort algorithm using Knuth's interval sequence
     * to determine the gaps in each iteration.
     */    
    public class ShellSort
    {
        public static void Sort<T>(T[] array) where T : IComparable<T>
        {
            int h = FindInitialInterval(array);

            while (h > 0)
            {
                for (int i = 0; i < array.Length && h > 0; i += h)
                {
                    T tmp = array[i];
                    int j = i - h;
                    for (; j >= 0 && tmp.CompareTo(array[j]) < 0; j -= h)
                    {
                        array[j + h] = array[j];
                    }

                    // Put tmp in its place in h-sorted subarray
                    array[j + h] = tmp;
                }

                // Calculate the h for the next iteration
                h = (h - 1) / 3;
            }
        }

        /**
         * Find the initial interval sequence using Knuth's formula:
         * h(0) = 1, h(i) = 3 * h(i-1) + 1.
         * 
         * The method returns the largest h that is smaller than the length
         * of the array.
         */
        private static int FindInitialInterval<T>(T[] array)
        {
            int h = 1;
            // The while loop condition comes from the inequality: 3*h + 1 <= length.
            // The loop should run as long as the next value of h doesn't  beyond
            // length. From this inequality (assuming integer math): h <= length / 3.
            while (h <= array.Length / 3)
            {
                h = 3 * h + 1;
            }

            return h;
        }
    }
}
