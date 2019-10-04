using System;
using NUnit.Framework;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the RecursiveBinarySearch class.
     */
    [TestFixture()]
    public class RecursiveBinarySearchTest
    {
        [Test()]
        public void TestBinarySearch()
        {
            // The first item is a sorted array, the second item is the
            // value to search for and the third item is the expected index
            // returned by the search method.
            Tuple<int[], int, int>[] test_inputs =
            {
                new Tuple<int[], int, int>(
                    new int[] { },
                    7, -1),

                new Tuple<int[], int, int>(
                    new int[] { 5 },
                    -5, -1),

                new Tuple<int[], int, int>(
                    new int[] { 5 },
                    5, 0),

                new Tuple<int[], int, int>(
                    new int[] { -5, -3, 0, 1, 5, 9, 14, 90, 93 },
                    93, 8),

                new Tuple<int[], int, int>(
                    new int[] { 0, 1, 2, 3, 4, 5, 6, 7 },
                    8, -1),

                new Tuple<int[], int, int>(
                    new int[] { -4, -2, 0, 2, 5, 7, 10, 99 },
                    0, 2),

                new Tuple<int[], int, int>(
                    new int[] { 8, 90, 100, 345, 598, 1054, 3929 },
                    400, -1)
            };

            foreach (var test_input in test_inputs)
            {
                Assert.AreEqual(
                    test_input.Item3,
                    RecursiveBinarySearch<int>.Search(test_input.Item1, test_input.Item2));
            }
        }
    }
}
