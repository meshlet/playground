using System.Collections.Generic;

namespace programmingchallenges
{
    /**
     * Implements an algorithm for finding all anagrams of a
     * string (all permutations).
     */
    public class Anagram
    {
        public static List<string> FindAnagrams(string str)
        {
            var anagrams = new List<string>();
            FindAnagramsInternal(str, "", anagrams);
            return anagrams;
        }

        private static void FindAnagramsInternal(string str, string prefix, List<string> anagrams)
        {
            if (string.IsNullOrEmpty(str))
            {
                anagrams.Add(prefix);
                return;
            }

            for (int i = 0; i < str.Length; ++i)
            {
                FindAnagramsInternal(
                    str.Substring(0, i) + str.Substring(i + 1), prefix + str[i], anagrams);
            }
        }
    }
}