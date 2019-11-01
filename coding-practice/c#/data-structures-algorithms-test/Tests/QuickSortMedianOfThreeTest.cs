using System;
using NUnit.Framework;
using System.Linq;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the QuickSortMedianOfThree.
     */
    [TestFixture()]
    public class QuickSortMedianOfThreeTest
    {
        [Test()]
        public void TestQuickSortMedianOfThree()
        {
            int[][] test_arrays =
            {
                new int[] { },
                new int[] { 3 },
                new int[] { 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1 },
                new int[] { 2, 5, 6, 8, 10, 99, -56 },
                new int[] { -1, 5, -5, -3, 5, 9, 3, 0, -34, 19, 87, 13 },
                new int[] { 10, 2, 5, 11, 3, 10, 7, -5, -2, 4, 17, -7 },
                new int[] { 33, 0, -1, 5, 10, 3, 7, 11, -5, -2, 4, 13 },
                new int[] { 33, 0, -1, 5, 10, 7, 8, 11, -5, -2, 4, 13 },
                new int[] { 8, 10, 12, 7, 16, 15, 17, 13, 11, 23, 24, 31 },
                new int[] { 17, 10, 21, -50, 50, 9, 17, -5, 25, 0, 100, -1, 101, 8, 80, -3, 33, 4 },
                new int[] { 0, -4, 10, 7, -6, 0, 37, 14, 198, -45, 0, -9, 9, 13, 0 },
                new int[] { -5, 34, 18, 0, 1, -5, 9, 13, 19, -18, 0, 45 },
                new int[] { -2, 5, 3, 10, 4, -7, 3, 15 },
                new int[] { 2, -2, 1, 0, -10, 5, 7, -2, 2, 4, 5, -8 }
            };

            foreach (var test_array in test_arrays)
            {
                int[] tmp_array = new int[test_array.Length];
                test_array.CopyTo(tmp_array, 0);

                // Sort the tmp_array using in-built sort method
                Array.Sort(tmp_array);

                // Sort the test_array using custom QuickSortMedianOfThree implementation
                QuickSortMedianOfThree.Sort(test_array);
                Assert.True(Enumerable.SequenceEqual(tmp_array, test_array));
            }
        }
    }
}
