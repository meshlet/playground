using NUnit.Framework;
using datastructuresalgorithms;
using System;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the SortedLinkedList class.
     */
    public class SortedLinkedListTest
    {
        /**
         * Asserts that an empty list has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagTrueInEmptyLinkedList()
        {
            var list = new SortedLinkedList<int>();
            Assert.IsTrue(list.IsEmpty());
        }

        /**
         * Asserts that a non-empty list has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagFalseInNonEmptyLinkedList()
        {
            var list = new SortedLinkedList<int>();
            list.Insert(4);
            Assert.IsFalse(list.IsEmpty());
        }

        /**
         * Exercies the insertion operation.
         */
        [Test()]
        public void ExerciseInsertion()
        {
            int[] values = { 90, -45, 0, 8, -32, 10, -5, -43, 45, 8, 90, -32, 10, -5 };
            var list = new SortedLinkedList<int>();

            // Insert values from the 'values' array into the sorted list
            foreach (int value in values)
            {
                list.Insert(value);
            }

            // Verify that the elements in the list are sorted
            Array.Sort(values);
            uint i = 0;
            foreach (int value in list)
            {
                Assert.AreEqual(values[i++], value);
            }

            // Assert that the list reports the correct size
            Assert.AreEqual(values.Length, list.Size);
        }

        /**
         * Tests the PopFront method.
         */
        [Test()]
        public void TestPopFront()
        {
            var list = new SortedLinkedList<int>();
            int[] values = { -4, 3, 5, -6, 3, 5, -20, 0 };

            // Push the items from 'values' array to the list
            foreach (int val in values)
            {
                list.Insert(val);
            }

            // Repeatedly call PopFront until list gets empty
            int i = 0;
            Array.Sort(values);
            int expected_size = values.Length;
            while (!list.IsEmpty())
            {
                Assert.AreEqual(expected_size--, list.Size);
                Assert.AreEqual(values[i++], list.PopFront());
            }
        }

        [Test()]
        public void TestRemove()
        {
            // The first array in the tuple represents the contents of
            // the list before calling 'Remove', the second array is
            // the list after calling 'Remove'. The third element of
            // the tuple represents the value to be removed from the
            // list.
            Tuple<int[], int[], int>[] test_vectors =
            {
                new Tuple<int[], int[], int>(
                    new int[] { },
                    new int[] { },
                    5),

                new Tuple<int[], int[], int>(
                    new int[] { -2, 9, 0 },
                    new int[] { -2, 0, 9 },
                    6),

                new Tuple<int[], int[], int>(
                    new int[] { 6 },
                    new int[] { },
                    6),

                new Tuple<int[], int[], int>(
                    new int[] { -2, 5, 0 },
                    new int[] { -2, 0 },
                    5),

                new Tuple<int[], int[], int>(
                    new int[] { 4, 4, 4, 4, 4 },
                    new int[] { },
                    4),

                new Tuple<int[], int[], int>(
                    new int[] { -3, 7, 8, 6, -3 },
                    new int[] { 6, 7, 8 },
                    -3),

                new Tuple<int[], int[], int>(
                    new int[] { 10, 2, -5, 6, 2, 2, 2 },
                    new int[] { -5, 6, 10 },
                    2),

                new Tuple<int[], int[], int>(
                    new int[] { -1, 0, 0, 5, -1, 9 },
                    new int[] { 0, 0, 5, 9 },
                    -1),
            };

            foreach (Tuple<int[], int[], int> test_vector in test_vectors)
            {
                var list = new SortedLinkedList<int>();

                // Populate the list with the items from Tuple.Item1
                foreach (int value in test_vector.Item1)
                {
                    list.Insert(value);
                }

                // Remove Tuple.Item3 value from the list
                list.Remove(test_vector.Item3);

                // Verify that the contents of the list is equal to Tuple.Item2
                Assert.AreEqual(test_vector.Item2.Length, list.Size);
                int index = 0;
                foreach (int value in list)
                {
                    Assert.AreEqual(test_vector.Item2[index++], value);
                }
            }
        }

        /**
         * Tests the Clear method.
         */
        [Test()]
        public void TestClear()
        {
            var list = new SortedLinkedList<int>();
            list.Insert(5);
            list.Insert(-4);
            list.Clear();
            Assert.AreEqual(0, list.Size);
            Assert.True(list.IsEmpty());
        }
    }
}
