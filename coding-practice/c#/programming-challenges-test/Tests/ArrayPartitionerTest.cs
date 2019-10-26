using System;
using NUnit.Framework;
using programmingchallenges;

namespace programmingchallengestest
{
    /**
     * Unit tests for the Partitioner class.
     */
    [TestFixture()]
    public class ArrayPartitionerTest
    {
        [Test()]
        public void TestArrayPartitioner()
        {
            // Item1 is the input array, item2 is the pivot value, item3 is the
            // partitioned array and item4 is the return value of the partitioning
            // method (the index to the first element of the right portion of the
            // array - values greater or equal to the pivot.
            Tuple<int[], int, int[], int>[] test_vectors =
            {
                new Tuple<int[], int, int[], int>(
                    new int[] { },
                    9,
                    new int[] { },
                    -1),

                new Tuple<int[], int, int[], int>(
                    new int[] { 4 },
                    2,
                    new int[] { 4 },
                    0),

                new Tuple<int[], int, int[], int>(
                    new int[] { 4 },
                    4,
                    new int[] { 4 },
                    0),

                new Tuple<int[], int, int[], int>(
                    new int[] { 4 },
                    6,
                    new int[] { 4 },
                    1),

                new Tuple<int[], int, int[], int>(
                    new int[] { 33, 0, -1, 5, 10, 3, 7, 11, -5, -2, 4, 13 },
                    7,
                    new int[] { 4, 0, -1, 5, -2, 3, -5, 11, 7, 10, 33, 13 },
                    7),

                new Tuple<int[], int, int[], int>(
                    new int[] { 33, 0, -1, 5, 10, 7, 8, 11, -5, -2, 4, 13 },
                    7,
                    new int[] { 4, 0, -1, 5, -2, -5, 8, 11, 7, 10, 33, 13 },
                    6),

                new Tuple<int[], int, int[], int>(
                    new int[] { 9, 9, 9, 9, 9, 9, 9, 9, 9 },
                    9,
                    new int[] { 9, 9, 9, 9, 9, 9, 9, 9, 9 },
                    0),

                new Tuple<int[], int, int[], int>(
                    new int[] { 5, 5, 5, 5, 5, 5, 5 },
                    9,
                    new int[] { 5, 5, 5, 5, 5, 5, 5 },
                    7),

                new Tuple<int[], int, int[], int>(
                    new int[] { -2, 5, 3, 10, 4, -7, 3, 15 },
                    15,
                    new int[] { -2, 5, 3, 10, 4, -7, 3, 15 },
                    7),

                new Tuple<int[], int, int[], int>(
                    new int[] { -5, 34, 18, 0, 1, -5, 9, 13, 19, -18, 0, 45 },
                    10,
                    new int[] { -5, 0, 1, -5, 9, -18, 0, 34, 18, 13, 19, 45 },
                    7),

                new Tuple<int[], int, int[], int>(
                    new int[] { 0, -4, 10, 7, -6, 0, 37, 14, 198, -45, 0, -9, 9, 13, 0 },
                    0,
                    new int[] { -4, -6, -45, -9, 0, 10, 7, 0, 37, 14, 198, 0, 9, 13, 0 },
                    4),

                new Tuple<int[], int, int[], int>(
                    new int[] { 17, 10, 21, -50, 50, 9, 17, -5, 25, 0, 100, -1, 101, 8, 80, -3, 33, 4 },
                    15,
                    new int[] { 10, -50, 9, -5, 0, -1, 8, -3, 4, 17, 21, 50, 17, 25, 100, 101, 80, 33 },
                    9)
            };

            foreach (var test_vector in test_vectors)
            {
                int[] array = test_vector.Item1;
                int pivot = test_vector.Item2;
                int[] ref_array = test_vector.Item3;

                int right_partition_start = ArrayPartitioner.Partition(array, pivot);
                Assert.AreEqual(test_vector.Item4, right_partition_start);
                Assert.AreEqual(ref_array.Length, array.Length);

                // Check the contents of paritions only for non-empty test arrays
                if (right_partition_start != -1)
                {
                    // Sort the left and right partitions of the ref_array independently
                    Array.Sort(ref_array, 0, right_partition_start);
                    Array.Sort(ref_array, right_partition_start, ref_array.Length - right_partition_start);

                    // Sort the left and right partitions of the array independently
                    Array.Sort(array, 0, right_partition_start);
                    Array.Sort(array, right_partition_start, array.Length - right_partition_start);

                    // Compare the left partition of the reference array to the left parition of the
                    // actual array
                    for (int i = 0; i < right_partition_start - 1; ++i)
                    {
                        Assert.AreEqual(ref_array[i], array[i]);
                    }

                    // Compare the right partition of the reference array to the right partition of the
                    // actual array
                    for (int i = right_partition_start; i < ref_array.Length; ++i)
                    {
                        Assert.AreEqual(ref_array[i], array[i]);
                    }
                }
            }
        }
    }
}
