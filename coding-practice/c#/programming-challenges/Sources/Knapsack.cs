using System;
using System.Diagnostics;
using System.Collections.Generic;

namespace programmingchallenges
{
    /**
     * Solves a standard knapsack problem defined as trying to fit items
     * of different weights into a knapsack so that the knapsack ends up
     * with a specified total weight. One doesn't have to select all items.
     *
     * For example, if items are { 11, 8, 7, 5, 6 } and the target weight
     * is 20, the knapsack would contain { 8, 7, 5 } items.
     *
     * The algorithm will return the first combination of items whose sum
     * of weights is equal to the target weight.    
     */    
    public class Knapsack
    {
        public static bool Run(uint[] items, List<uint> bag, uint target_weight)
        {
            Debug.Assert(bag != null);

            if (target_weight == 0)
            {
                // Leave the bag empty
                return true;
            }

            return RunHelper(new ArraySegment<uint>(items, 0, items.Length), bag, target_weight, 0) == target_weight;
        }

        private static uint RunHelper(ArraySegment<uint> items, List<uint> bag, uint target_weight, uint current_weight)
        {
            if (items.Count == 0)
            {
                return current_weight;
            }

            for (int i = items.Offset; i < (items.Offset + items.Count); ++i)
            {
                uint tmp_weight = items.Array[i] + current_weight;

                if (tmp_weight == target_weight)
                {
                    bag.Add(items.Array[i]);
                    return tmp_weight;
                }
                else if (tmp_weight < target_weight)
                {
                    tmp_weight =
                        RunHelper(new ArraySegment<uint>(items.Array, i + 1, items.Array.Length - i - 1),
                                  bag, target_weight, tmp_weight);

                    if (tmp_weight == target_weight)
                    {
                        // Now that we reached the desired weight, add the item
                        // to the bag
                        bag.Add(items.Array[i]);
                        return tmp_weight;
                    }
                }
            }

            // Failed to find the the set of items that amount to desired weight
            return current_weight;
        }
    }
}
