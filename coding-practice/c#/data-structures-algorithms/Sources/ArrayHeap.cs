using System;
using System.Collections.Generic;
using System.Linq;

namespace datastructuresalgorithms
{
    /**
     * Heap implementation using an array to store nodes.
     *
     * @note The T generic type is not constrained to types that implement
     * IComparable<T> to simplify the usage in the case where user wants
     * to provide its own comparator. Otherwise, type T would have to implement
     * IComparable<T> even when a custom comparator is provided.    
     */
    public class ArrayHeap<T> : IHeap<T>
    {
        /**
         * The default comparator implementation.
         *
         * The default comparator that relies on the IComparable<T>
         * interface to order the objects.
         */        
        class DefaultComparator : IComparer<T>
        {
            /**
             * @throws SystemException is thrown if T does not implement
             * IComparable<T>.
             */
            public DefaultComparator()
            {
                if (!typeof(T).GetInterfaces().Any(
                    i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IComparable<T>)))
                {
                    throw new SystemException("T doesn't implement IComparable<T> interface");
                }
            }

            public int Compare(T obj_1, T obj_2)
            {
                return ((IComparable<T>)obj_1).CompareTo(obj_2);
            }
        }

        /**
         * The array used to store the heap tree nodes.
         */
        private T[] Nodes
        {
            get; set;
        }

        /**
         * The comparer used to compare the nodes.
         *
         * By default, the comparer will use IComparable<T> inteface
         * to compare nodes. However, class user can specify a custom
         * comparator object to use instead.
         */
        private IComparer<T> Comparator
        {
            get; set;
        }

        /**
         * Creates a heap instance.
         *
         * @param initial_capacity  The initial capacity of the heap. The higher
         *                          this value is the lower the number of times
         *                          the heap needs to be resized.
         * @param comparator        The comparator used to order the heap nodes.
         *                          If null, then the default comparator is used
         *                          that relies on the IComparable<T> interface
         *                          to order the objects. Hence, T must implement
         *                          IComparable<T> in this case.
         *
         * @throws SystemException if comparator is null but T doesn't implement
         * IComparable<T> interface.        
         */
        public ArrayHeap(uint initial_capacity = 10, IComparer<T> comparator = null)
        {
            Nodes = new T[initial_capacity];
            Comparator = comparator ?? new DefaultComparator();
        }

        /**
         * The number of nodes in the heap.
         *
         * @return The number of nodes in the heap.
         */
        public uint Size
        {
            get; private set;
        }

        /**
         * Whether heap is empty.
         *
         * @return True if heap is empty, false otherwise.
         */
        public bool IsEmpty
        {
            get { return Size == 0; }
        }
    }
}
