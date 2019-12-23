using NUnit.Framework;
using datastructuresalgorithms;
using System;
using System.Collections.Generic;
using System.Linq;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for IHeap interface implementations.
     */
    [TestFixture()]
    public class HeapTest
    {
        /**
         * Asserts that empty heap has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagTrueInEmptyHeap()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            Assert.IsTrue(heap.IsEmpty);
        }

        /**
         * Asserts that non-empty heap has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagFalseInNonEmptyHeap()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            Assert.IsFalse(heap.IsEmpty);
        }

        /**
         * Asserts that empty flag is correctly set after heap becomes empty.
         */
        [Test()]
        public void EmptyFlagTrueAfterHeapBecomesEmpty()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            heap.Remove();
            Assert.IsTrue(heap.IsEmpty);
        }

        /**
         * Asserts that empty flag is correctly set after clearing the heap.
         */
        [Test()]
        public void EmptyFlagTrueAfterHeapIsCleared()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            heap.Clear();
            Assert.IsTrue(heap.IsEmpty);
        }

        /**
         * Asserts that size is zero in an empty heap.
         */
        [Test()]
        public void SizeIsZeroInEmptyHeap()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            Assert.AreEqual(0, heap.Size);
        }

        /**
         * Asserts that non-empty heap has correct size.
         */
        [Test()]
        public void SizeIsOneInOneEntryHeap()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            Assert.AreEqual(1, heap.Size);
        }

        /**
         * Asserts that size is zero after heap becomes empty.
         */
        [Test()]
        public void SizeIsZeroAfterHeapBecomesEmpty()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            heap.Remove();
            Assert.AreEqual(0, heap.Size);
        }

        /**
         * Asserts that size is zero after clearing the heap.
         */
        [Test()]
        public void SizeIsZeroAfterHeapIsCleared()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            heap.Insert(5);
            heap.Clear();
            Assert.AreEqual(0, heap.Size);
        }

        /**
         * Asserts that an exception is thrown if initial capacity is negative
         * or zero.        
         */
        [Test()]
        public void ExceptionThrownIfInitialCapacityIsNonPositive()
        {
            Assert.Throws<ArgumentException>(() => new ArrayHeap<int>(-10));
            Assert.Throws<ArgumentException>(() => new ArrayHeap<int>(0));
        }

        /**
         * Asserts that an exception is thrown if custom comparator is not
         * provided but the type of objects stored in heap doesn't implement
         * the IComparable interface.
         */
        [Test()]
        public void ExceptionThrownIfObjectTypeIsNotComparable()
        {
            Assert.Throws<ApplicationException>(() => new ArrayHeap<object>());
        }

        /**
         * Asserts that insertion method throws an exception if NULL is passed
         * to it.
         */
        [Test()]
        public void ExceptionThrownIfNullIsInserted()
        {
            ArrayHeap<int?> heap = new ArrayHeap<int?>(
                10,
                (x, y) => Nullable.Compare(x, y));
            Assert.Throws<ArgumentNullException>(() => heap.Insert(null));
        }

        /**
         * Asserts that removal method throws an exception if heap is empty.
         */
        [Test()]
        public void ExceptionThrownIfRemovingFromEmptyHeap()
        {
            ArrayHeap<int> heap = new ArrayHeap<int>();
            Assert.Throws<IndexOutOfRangeException>(() => heap.Remove());
        }

        /**
         * Tests insertion and removal heap operations. The order of elements
         * (ascending or descending) is determined by the comparator. Testing
         * is ran with 3 different comparators: the default comparator that
         * orders objects in ascending order, the custom comparator that orders
         * objects in ascending order and the custom comparator that orders
         * objects in descending order.
         */
        [Test()]
        public void TestInsertionAndRemoval()
        {
            var test_vectors = new[]
            {
                new
                {
                    m_initial_capacity = 10,
                    m_objects_to_insert = new int[] { },
                    m_remove_count = 7,
                    m_more_objects_to_insert = new int[] { }
                },

                new
                {
                    m_initial_capacity = 10,
                    m_objects_to_insert = new int[] { 10 },
                    m_remove_count = 6,
                    m_more_objects_to_insert = new int[] { }
                },

                new
                {
                    m_initial_capacity = 5,
                    m_objects_to_insert = new int[] { 0, -10, 100, 4, 5, 3, -5, 0 },
                    m_remove_count = 5,
                    m_more_objects_to_insert = new int[] { -90, 100, 34, 3, -10, 0 }
                },

                new
                {
                    m_initial_capacity = 3,
                    m_objects_to_insert = new int[] { -10, 30, 50, 74, 120, 80, 90, 80, 85, -50, 35, 55, 130 },
                    m_remove_count = 7,
                    m_more_objects_to_insert = new int[] { 25, -25, 74, 90, 55, -10 }
                },

                new
                {
                    m_initial_capacity = 4,
                    m_objects_to_insert = new int[] { -19, 20, 34, 3, -2, 21, 100, -150, 49, 27, -5 },
                    m_remove_count = 20,
                    m_more_objects_to_insert = new int[] { -19, 33, -9, 18, 100, 17, -2, 27 }
                }
            };

            // The list of comparators
            Comparison<int>[] comparators =
            {
                null,

                // Orders integers in ascending order
                (x, y) =>
                {
                    if (x == y)
                    {
                        return 0;
                    }
                    else if (x < y)
                    {
                        return -1;
                    }
                    else
                    {
                        return 1;
                    }
                },

                // Orders integers in descending order
                (x, y) =>
                {
                    if (x == y)
                    {
                        return 0;
                    }
                    else if (x < y)
                    {
                        return 1;
                    }
                    else
                    {
                        return -1;

                    }
                }
            };

            foreach (var comparator in comparators)
            {
                foreach (var test_vector in test_vectors)
                {
                    ArrayHeap<int> heap = new ArrayHeap<int>(test_vector.m_initial_capacity, comparator);

                    // Populate the heap
                    List<int> reference_data = new List<int>(test_vector.m_objects_to_insert.Length);
                    foreach (var value in test_vector.m_objects_to_insert)
                    {
                        heap.Insert(value);
                        reference_data.Add(value);
                    }

                    Assert.AreEqual(reference_data.Count, heap.Size);

                    // Sort the reference data array in the specified order
                    if (comparator != null)
                    {
                        reference_data.Sort(comparator);
                    }
                    else
                    {
                        reference_data.Sort();
                    }

                    // Try removing the specified number of elements from the heap
                    for (int i = 0; i < test_vector.m_remove_count; ++i)
                    {
                        if (heap.IsEmpty)
                        {
                            Assert.Throws<IndexOutOfRangeException>(() => heap.Remove());
                            continue;
                        }

                        Assert.AreEqual(reference_data[0], heap.Remove());
                        reference_data.RemoveAt(0);
                        Assert.AreEqual(reference_data.Count, heap.Size);
                    }

                    Assert.AreEqual(reference_data.Count, heap.Size);
                    Assert.IsTrue(heap.Size == 0 && heap.IsEmpty || heap.Size > 0 && !heap.IsEmpty);

                    // Insert more objects
                    foreach (var value in test_vector.m_more_objects_to_insert)
                    {
                        heap.Insert(value);
                        reference_data.Add(value);
                    }

                    // Sort the reference data array in the specified order
                    if (comparator != null)
                    {
                        reference_data.Sort(comparator);
                    }
                    else
                    {
                        reference_data.Sort();
                    }

                    while (!heap.IsEmpty)
                    {
                        Assert.AreEqual(reference_data[0], heap.Remove());
                        reference_data.RemoveAt(0);
                    }

                    Assert.AreEqual(reference_data.Count, heap.Size);
                    Assert.IsTrue(heap.Size == 0 && heap.IsEmpty || heap.Size > 0 && !heap.IsEmpty);
                }
            }
        }
    }
}
