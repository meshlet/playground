using System;
using System.Linq;

namespace datastructuresalgorithms
{
    /**
     * The base class for heap implementations.
     *
     * By default, the nodes are stored in the heap in ascending
     * order - parent is lower-or-equal than both its children
     * where the ordering of the objects is determined by the
     * IComparable<T> implementation. For example, a heap of
     * integers would by default be sorted in ascending order.
     * Note, however, that one can introduce a custom integer class
     * that implements the IComparable<> interface that orders
     * integers in descending order, i.e. X.CompareTo(Y) < 0 when
     * X > Y. Such integers would effectively be sorted in
     * descending order in the heap.
     * 
     * @note The T generic type is not constrained to types that implement
     * IComparable<T> to simplify the usage in the case where user provides
     * the custom comparator. Otherwise, type T would have to implement
     * IComparable<T> even when a custom comparator is provided.
     */
    public abstract class HeapBase<T> : IHeap<T>
    {
        /**
         * The comparer used to compare the nodes.
         *
         * By default, the comparer will use IComparable<T> inteface
         * to compare nodes. However, class user can specify a custom
         * comparator object to use instead.
         */
        protected Comparison<T> Comparator
        {
            get; set;
        }

        /**
         * Whether type T is nullable or not.
         *
         * This field exists only to remove the overhead of checking whether
         * a type is nullable each time Insert method is called.
         */
        protected bool IsNullable
        {
            get; set;
        }

        /**
         * Creates a heap instance.
         *
         * @param comparator        The comparator used to order the heap nodes.
         *                          If null, then the default comparator is used
         *                          that relies on the IComparable<T> interface
         *                          to order the objects. Hence, T must implement
         *                          IComparable<T> in this case.
         *
         * @throws ApplicationException if comparator is null but T doesn't
         *         implement the IComparable<T> interface.
         */
        public HeapBase(Comparison<T> comparator)
        {
            if (comparator == null)
            {
                if (!typeof(T).GetInterfaces().Any(i => i == typeof(IComparable<T>)))
                {
                    throw new ApplicationException("T doesn't implement IComparable<T> interface");
                }
                Comparator = (x, y) =>
                {
                    return ((IComparable<T>)x).CompareTo(y);
                };
            }
            else
            {
                Comparator = comparator;
            }

            IsNullable = !typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null;
            Size = 0;
        }

        /**
         * The number of nodes in the heap.
         *
         * @return The number of nodes in the heap.
         */
        public int Size
        {
            get; protected set;
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

        /**
         * To be implemented by the concrete classes.
         */
        public abstract void Insert(T obj);
        public abstract T Remove();
        public abstract void Clear();
    }
}
