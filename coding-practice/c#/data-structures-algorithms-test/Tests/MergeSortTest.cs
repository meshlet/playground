using System;
using NUnit.Framework;
using System.Linq;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the MergeSort class.
     */
    [TestFixture()]
    public class MergeSortTest
    {
        [Test()]
        public void TestMergeSort()
        {
            int[][] test_arrays =
            {
                new int[] { },
                new int[] { 3 },
                new int[] { 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1 },
                new int[] { 2, 5, 6, 8, 10, 99, -56 },
                new int[] { -1, 5, -5, -3, 5, 9, 3, 0, -34, 19, 87, 13 }
            };

            foreach (var test_array in test_arrays)
            {
                int[] tmp_array = new int[test_array.Length];
                test_array.CopyTo(tmp_array, 0);

                // Sort the tmp_array using in-built sort method
                Array.Sort(tmp_array);

                // Sort the test_array using custom MergeSort implementation
                MergeSort<int>.Sort(test_array);
                Assert.True(Enumerable.SequenceEqual(tmp_array, test_array));
            }
        }
    }
}
