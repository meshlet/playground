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
            // The first item is the string whose permutations are to
            // be generated, and the second is the array of permutations
            // to check against.
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
                        "DABC", "DACB", "DBAC", "DBCA", "DCAB", "DCBA"
                    }),

                new Tuple<string, string[]>(
                    "cats",
                    new string[]
                    {
                        "cats", "cast", "ctsa", "ctas", "csat", "csta",
                        "atsc", "atcs", "asct", "astc", "acts", "acst",
                        "tsca", "tsac", "tcas", "tcsa", "tasc", "tacs",
                        "scat", "scta", "satc", "sact", "stca", "stac"
                    })
            };

            foreach (var test_input in test_inputs)
            {
                List<string> anagrams = Anagram.FindAnagrams(test_input.Item1);
                anagrams.Sort();
                Array.Sort(test_input.Item2);

                Assert.True(test_input.Item2.SequenceEqual(anagrams));
            }
        }
    }
}
