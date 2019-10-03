using NUnit.Framework;
using System;
using System.Linq;
using System.Collections.Generic;
using programmingchallenges;

namespace programmingchallengestest
{
    /**
     * Unit tests for the Anagram class.
     */
    [TestFixture()]
    public class AnagramTest
    {
        [Test()]
        public void TestAnagramGeneration()
        {
            // Permutation are sorted in alphabetical order to simplify comparison
            // with the generated permutations
            Tuple<string, string[]>[] test_inputs =
            {
                new Tuple<string, string[]>(
                    "",
                    new string[] { "" }),

                new Tuple<string, string[]>(
                    "A",
                    new string[] { "A" }),

                new Tuple<string, string[]>(
                    "AB",
                    new string[] { "AB", "BA" }),

                new Tuple<string, string[]>(
                    "ABC",
                    new string[] { "ABC", "ACB", "BAC", "BCA", "CAB", "CBA" }),

                new Tuple<string, string[]>(
                    "ABCD",
                    new string[]
                    {
                        "ABCD", "ABDC", "ACBD", "ACDB", "ADBC", "ADCB",
                        "BACD", "BADC", "BCAD", "BCDA", "BDAC", "BDCA",
                        "CABD", "CADB", "CBAD", "CBDA", "CDAB", "CDBA",
                        "DABC", "DACB", "DBAC", "DBCA", "DCAB", "DCBA"})
            };

            foreach (var test_input in test_inputs)
            {
                List<string> anagrams = Anagram.FindAnagrams(test_input.Item1);
                anagrams.Sort();

                Assert.True(test_input.Item2.SequenceEqual(anagrams));
            }
        }
    }
}
