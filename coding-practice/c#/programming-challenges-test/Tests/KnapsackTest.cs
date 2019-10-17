using NUnit.Framework;
using System;
using System.Collections.Generic;
using programmingchallenges;

namespace programmingchallengestest.Tests
{
    /**
     * Unit tests for the Knapsack class.
     */
    [TestFixture()]
    public class KnapsackTest
    {
        [Test()]
        public void TestKnapsack()
        {
            // Item1 is the array of available items, item2 is the target weight,
            // item3 is the expected return value and item4 is the expected content
            // of the knapsack (only checked if item2 is true)
            Tuple<uint[], uint, bool, uint[]>[] test_vectors =
            {
                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { },
                    0,
                    true,
                    new uint[] { }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 5 },
                    5,
                    true,
                    new uint[] { 5 }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 11, 8, 7, 6, 5 },
                    20,
                    true,
                    new uint[] { 8, 7, 5 }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 10, 4, 32, 1, 5, 87, 7, 17 },
                    17,
                    true,
                    new uint[] { 10, 7 }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 5, 1, 99, 4, 19, 26, 41, 98 },
                    43,
                    false,
                    new uint[] { }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 9, 10, 4, 1, 77, 45, 12, 456, 512, 31, 67 },
                    999,
                    true,
                    new uint[] { 9, 10, 12, 456, 512 }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 612, 45, 67, 1, 38, 99, 81, 9, 7, 6, 19, 49, 59, 30, 101, 33 },
                    611,
                    true,
                    new uint[] { 45, 67, 1, 38, 99, 81, 9, 7, 6, 19, 49, 59, 30, 101 }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 13, 45, 67, 1, 38, 99, 81, 9, 7, 6, 19, 49, 59, 30, 101, 33 },
                    900,
                    false,
                    new uint[] { }),

                new Tuple<uint[], uint, bool, uint[]>(
                    new uint[] { 10, 4, 32, 1, 5, 87, 7, 1000 },
                    1000,
                    true,
                    new uint[] { 1000 })
            };

            foreach (var test_vector in test_vectors)
            {
                List<uint> bag = new List<uint>();

                Assert.AreEqual(
                    test_vector.Item3,
                    Knapsack.Run(test_vector.Item1, bag, test_vector.Item2));

                if (test_vector.Item3)
                {
                    Array.Sort(test_vector.Item4);
                    bag.Sort();

                    Assert.AreEqual(test_vector.Item4.Length, bag.Count);
                    int i = 0;
                    foreach (var item in test_vector.Item4)
                    {
                        Assert.AreEqual(item, bag[i++]);
                    }
                }
            }
        }
    }
}
