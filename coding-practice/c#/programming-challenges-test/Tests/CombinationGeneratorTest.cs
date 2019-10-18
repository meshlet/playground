using NUnit.Framework;
using System;
using System.Collections.Generic;
using programmingchallenges;

namespace programmingchallengestest
{
    /**
     * Unit tests for the CombinationGenerator class.
     */
    [TestFixture()]
    public class CombinationGeneratorTest
    {
        [Test()]
        public void TestCombinationGenerator()
        {
            // Item1 is the input string whose characters will be used to
            // generate combinations, item2 is the desired combination size
            // and item3 is the array of combinations expected to be generated.
            Tuple<string, uint, string[]>[] test_vectors =
            {
                new Tuple<string, uint, string[]>(
                    "ABC",
                    0,
                    new string[] { }),

                new Tuple<string, uint, string[]>(
                    "ABCDE",
                    6,
                    new string[] { }),

                new Tuple<string, uint, string[]>(
                    "ABCDE",
                    3,
                    new string[] { "ABC", "ABD", "ABE", "ACD", "ACE", "ADE", "BCD", "BCE", "BDE", "CDE" }),

                new Tuple<string, uint, string[]>(
                    "ABCDE",
                    1,
                    new string[] { "A", "B", "C", "D", "E" }),

                new Tuple<string, uint, string[]>(
                    "ABCDE",
                    2,
                    new string[] { "AB", "AC", "AD", "AE", "BC", "BD", "BE", "CD", "CE", "DE" }),

                new Tuple<string, uint, string[]>(
                    "ABCDE",
                    4,
                    new string[] { "ABCD", "ABCE", "ABDE", "ACDE", "BCDE" })
            };

            foreach (var test_vector in test_vectors)
            {
                List<string> combinations = new List<string>();
                CombinationGenerator.Run(test_vector.Item1, test_vector.Item2, combinations);

                Assert.AreEqual(test_vector.Item3.Length, combinations.Count);

                Array.Sort(test_vector.Item3);
                combinations.Sort();

                int i = 0;
                foreach (var combination in test_vector.Item3)
                {
                    Assert.AreEqual(combination, combinations[i++]);
                }
            }
        }
    }
}
