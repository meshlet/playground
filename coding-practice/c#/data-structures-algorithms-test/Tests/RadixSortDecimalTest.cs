using System;
using NUnit.Framework;
using System.Linq;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the QuickSortBasic.
     */
    [TestFixture()]
    public class RadixSortDecimalTest
    {
        [Test()]
        public void TestRadixSortDecimal()
        {
            long[][] test_arrays =
            {
                new long[] { },
                new long[] { 3 },
                new long[] { 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 1 },
                new long[] { 2, 5, 6, 8, 10, 99, 56 },
                new long[] { -1, 5, -5, -3, 5, 9, 3, 0, -34, 19, 87, 13 },
                new long[] { 10, 2, 5, 11, 3, 10, 7, -5, -2, 4, 17, -7 },
                new long[] { 33, 0, -1, 5, 10, 3, 7, 11, -5, -2, 4, 13 },
                new long[] { 33, 0, -1, 5, 10, 7, 8, 11, -5, -2, 4, 13 },
                new long[] { 8, 10, 12, 7, 16, 15, 17, 13, 11, 23, 24, 31 },
                new long[] { 17, 10, 21, -50, 50, 9, 17, -5, 25, 0, 100, -1, 101, 8, 80, -3, 33, 4 },
                new long[] { 0, -4, 10, 7, -6, 0, 37, 14, 198, -45, 0, -9, 9, 13, 0 },
                new long[] { -5, 34, 18, 0, 1, -5, 9, 13, 19, -18, 0, 45 },
                new long[] { -2, 5, 3, 10, 4, -7, 3, 15 }
            };

            foreach (var test_array in test_arrays)
            {
                long[] tmp_array = new long[test_array.Length];
                test_array.CopyTo(tmp_array, 0);

                // Sort the tmp_array using in-built sort method
                Array.Sort(tmp_array);

                // Sort the test_array using custom RadixSortDecimal implementation
                RadixSortDecimal.Sort(test_array);
                Assert.True(Enumerable.SequenceEqual(tmp_array, test_array));
            }
        }
    }
}
