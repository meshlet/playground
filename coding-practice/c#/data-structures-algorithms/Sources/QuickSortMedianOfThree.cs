using System;

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
        public static void Sort(long[] array)
        {

        }

        private static int Partition(long[] array, int start, int end)
        {

        }

        private static long MedianOfThree(long[] array, int start, int end)
        {

        }
    }
}
