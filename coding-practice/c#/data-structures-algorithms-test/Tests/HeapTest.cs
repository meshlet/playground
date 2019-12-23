using NUnit.Framework;
using datastructuresalgorithms;
using System;
using System.Collections.Generic;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for IHeap interface implementations.
     */
    [TestFixture(typeof(string), "ARRAY_HEAP")]
    [TestFixture(typeof(string), "TREE_HEAP")]
    public class HeapTest<T>
    {
        /**
         * All the heap implementations tested by this test fixture.
         */
        private enum HeapImplementation
        {
            ARRAY_HEAP,
            TREE_HEAP
        }

        /**
         * Heap implementation tested by this test fixture instance.
         */
        private HeapImplementation m_implementation;

        /**
         * Invoked by NUnit with argument set to the string defined
         * in the TestFixture attribute.
         *
         * @throws ArgumentException if impl_str doesn't match any of
         * the enum values in HeapImplementation enum.        
         */        
        public HeapTest(T obj)
        {
            Assert.AreEqual(typeof(string), typeof(T));
            switch (obj.ToString())
            {
                case "ARRAY_HEAP":
                    m_implementation = HeapImplementation.ARRAY_HEAP;
                    break;

                case "TREE_HEAP":
                    m_implementation = HeapImplementation.TREE_HEAP;
                    break;

                default:
                    throw new ArgumentException("impl_str doesn't match any HeapImplementation");
            }
        }

        private IHeap<T2> NewHeapInstance<T2>()
        {
            switch (m_implementation)
            {
                case HeapImplementation.ARRAY_HEAP:
                    return new ArrayHeap<T2>();

                case HeapImplementation.TREE_HEAP:
                    return new TreeHeap<T2>();

                default:
                    Assert.Fail("Unknown heap implementation");
                    return null;
            }
        }

        private IHeap<T2> NewHeapInstance<T2>(int initial_capacity)
        {
            switch (m_implementation)
            {
                case HeapImplementation.ARRAY_HEAP:
                    return new ArrayHeap<T2>(initial_capacity);

                case HeapImplementation.TREE_HEAP:
                    return new TreeHeap<T2>();

                default:
                    Assert.Fail("Unknown heap implementation");
                    return null;
            }
        }

        private IHeap<T2> NewHeapInstance<T2>(int initial_capacity, Comparison<T2> comparator)
        {
            switch (m_implementation)
            {
                case HeapImplementation.ARRAY_HEAP:
                    return new ArrayHeap<T2>(initial_capacity, comparator);

                case HeapImplementation.TREE_HEAP:
                    return new TreeHeap<T2>(comparator);

                default:
                    Assert.Fail("Unknown heap implementation");
                    return null;
            }
        }

        /**
         * Asserts that empty heap has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagTrueInEmptyHeap()
        {
            IHeap<int> heap = NewHeapInstance<int>();
            Assert.IsTrue(heap.IsEmpty);
        }

        /**
         * Asserts that non-empty heap has correctly set empty flag.
         */
        [Test()]
        public void EmptyFlagFalseInNonEmptyHeap()
        {
            IHeap<int> heap = NewHeapInstance<int>();
            heap.Insert(5);
            Assert.IsFalse(heap.IsEmpty);
        }

        /**
         * Asserts that empty flag is correctly set after heap becomes empty.
         */
        [Test()]
        public void EmptyFlagTrueAfterHeapBecomesEmpty()
        {
            IHeap<int> heap = NewHeapInstance<int>();
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
            IHeap<int> heap = NewHeapInstance<int>();
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
            IHeap<int> heap = NewHeapInstance<int>();
            Assert.AreEqual(0, heap.Size);
        }

        /**
         * Asserts that non-empty heap has correct size.
         */
        [Test()]
        public void SizeIsOneInOneEntryHeap()
        {
            IHeap<int> heap = NewHeapInstance<int>();
            heap.Insert(5);
            Assert.AreEqual(1, heap.Size);
        }

        /**
         * Asserts that size is zero after heap becomes empty.
         */
        [Test()]
        public void SizeIsZeroAfterHeapBecomesEmpty()
        {
            IHeap<int> heap = NewHeapInstance<int>();
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
            IHeap<int> heap = NewHeapInstance<int>();
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
            if (m_implementation == HeapImplementation.TREE_HEAP)
            {
                Assert.Ignore("Initial capacity cannot be specified for a tree based heap");
            }

            Assert.Throws<ArgumentException>(() => NewHeapInstance<int>(-10));
            Assert.Throws<ArgumentException>(() => NewHeapInstance<int>(0));
        }

        /**
         * Asserts that an exception is thrown if custom comparator is not
         * provided but the type of objects stored in heap doesn't implement
         * the IComparable interface.
         */
        [Test()]
        public void ExceptionThrownIfObjectTypeIsNotComparable()
        {
            Assert.Throws<ApplicationException>(() => NewHeapInstance<object>());
        }

        /**
         * Asserts that insertion method throws an exception if NULL is passed
         * to it.
         */
        [Test()]
        public void ExceptionThrownIfNullIsInserted()
        {
            IHeap<int?> heap = NewHeapInstance<int?>(
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
            IHeap<int> heap = NewHeapInstance<int>();
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
                    IHeap<int> heap = NewHeapInstance(test_vector.m_initial_capacity, comparator);

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
