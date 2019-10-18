using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace programmingchallenges
{
    /**
     * Given an input string with N characters, generates all the
     * character combinations of desired length L. For example for
     * input string ABCDE and desired combination length 3 the
     * algorithm will produce:
     *
     * ABC, ABD, ABE, ACD, ACE, ADE, BCD, BCE, BDE, CDE
     */
    public class CombinationGenerator
    {
        public static void Run(string input, uint size, List<string> combinations)
        {
            Debug.Assert(combinations != null);

            // Return immediatelly if requested combination size is 0 or the
            // number of items in the input array is smaller than size.
            if (size == 0 || input.Length < size)
            {
                return;
            }

            RunHelper("", input, size, combinations);
        }

        private static void RunHelper(string prefix, string input, uint size, List<string> combinations)
        {
            if (prefix.Length == size)
            {
                combinations.Add(prefix);
                return;
            }

            for (int i = 0; i < input.Length; ++i)
            {
                // Break the loop if we know we can't reach the desired size
                if (prefix.Length + input.Length - i >= size)
                {
                    RunHelper(prefix + input[i], input.Substring(i + 1), size, combinations);
                }
            }
        }
    }
}
