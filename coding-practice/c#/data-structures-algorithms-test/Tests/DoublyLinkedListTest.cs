using NUnit.Framework;
using datastructuresalgorithms;
using System;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the DoublyLinkedList
     */
    [TestFixture()]
    public class DoublyLinkedListTest
    {
        /**
         * Asserts that an empty list has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagTrueInEmptyLinkedList()
        {
            var list = new DoublyLinkedList<int>();
            Assert.IsTrue(list.IsEmpty());
        }

        /**
         * Asserts that a non-empty list has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagFalseInNonEmptyLinkedList()
        {
            var list = new DoublyLinkedList<int>();
            list.InsertLast(4);
            Assert.IsFalse(list.IsEmpty());
        }

        /**
         * Exercises the InsertFirst method.
         */
        [Test()]
        public void TestInsertFirst()
        {
            var list = new DoublyLinkedList<int>();
            int[] values = { -5, 3, 1, 4, 4, 18, -20, 7, 12 };

            // Push all items from 'values' to the list with PushFront
            foreach (int i in values)
            {
                list.InsertFirst(i);
            }

            // Iterate through the list and verify that elements are
            // exactly in reversed order compared to 'values' array
            Assert.AreEqual(values.Length, list.Size);
            int index = values.Length - 1;

            foreach (int i in list)
            {
                Assert.AreEqual(values[index--], i);
            }
        }

        /**
         * Exercises the InsertLast method.
         */
        [Test()]
        public void TestInsertLast()
        {
            var list = new DoublyLinkedList<int>();
            int[] values = { -5, 3, 1, 4, 4, 18, -20, 7, 12 };

            // Push all items from 'values' to the list with PushBack
            foreach (int i in values)
            {
                list.InsertLast(i);
            }

            // Iterate through the list and verify that elements are
            // in the same order as in 'values' array
            Assert.AreEqual(values.Length, list.Size);
            int index = 0;

            foreach (int i in list)
            {
                Assert.AreEqual(values[index++], i);
            }
        }

        /**
         * Tests the RemoveFirst method.
         */
        [Test()]
        public void TestRemoveFirst()
        {
            var list = new DoublyLinkedList<int>();
            int[] values = { -4, 3, 5, -6, 3, 5, -20, 0 };

            // Push the items from 'values' array to the list
            foreach (int val in values)
            {
                list.InsertLast(val);
            }

            // Repeatedly call PopFront until list gets empty
            int i = 0;
            int expected_size = values.Length;
            while (!list.IsEmpty())
            {
                Assert.AreEqual(expected_size--, list.Size);
                Assert.AreEqual(values[i++], list.RemoveFirst());
            }
        }

        /**
         * Tests the RemoveLast method.
         */
        [Test()]
        public void TestPopBack()
        {
            var list = new DoublyLinkedList<int>();
            int[] values = { -4, 3, 5, -6, 3, 5, -20, 0 };

            // Push the items from 'values' array to the list
            foreach (int val in values)
            {
                list.InsertLast(val);
            }

            // Repeatedly call PopBack until list gets empty
            int i = values.Length - 1;
            int expected_size = values.Length;
            while (!list.IsEmpty())
            {
                Assert.AreEqual(expected_size--, list.Size);
                Assert.AreEqual(values[i--], list.RemoveLast());
            }
        }

        /**
         * Tests the Remove method.
         */
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
                    new int[] { -2, 9, 0 },
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
                    new int[] { 4, 4, 4, 4 },
                    4),

                new Tuple<int[], int[], int>(
                    new int[] { -3, 5, 6, 7, -3 },
                    new int[] { 5, 6, 7, -3 },
                    -3),

                new Tuple<int[], int[], int>(
                    new int[] { 10, 2, 5, 6, 2, 2, 2 },
                    new int[] { 10, 5, 6, 2, 2, 2 },
                    2),

                new Tuple<int[], int[], int>(
                    new int[] { -1, 0, 0, 5, -1, 9 },
                    new int[] { 0, 0, 5, -1, 9 },
                    -1),
            };

            foreach (Tuple<int[], int[], int> test_vector in test_vectors)
            {
                var list = new DoublyLinkedList<int>();

                // Populate the list with the items from Tuple.Item1
                foreach (int value in test_vector.Item1)
                {
                    list.InsertLast(value);
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
    }
}
