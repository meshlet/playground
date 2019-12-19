using System;
namespace datastructuresalgorithms
{
    /**
     * The heap interface.
     *
     * Defines the heap data structure interface.
     *
     * The objects must be stored in the heap in such a way so that
     * the heap binary tree stays complete and each node still satisfies
     * the heap-condition (each parent must be either greater-or-equal
     * than both its children, or lower-or-equal than both its children).
     * A complete binary tree is a binary tree whose each level, except
     * possibly that last, is completely filled and all nodes in the
     * last level are as far left as possible.        
     *
     * By default, the nodes are stored in the heap in descending
     * order - parent is greater-or-equal than both its children
     * where the ordering of the objects is determined by the
     * IComparable<T> implementation. For example, a heap of
     * integers would by default be sorted in descending order.
     * Note, however, that one can introduce a custom Integer class
     * that implements the IComparable<> interface that orders
     * integers in reversed order, i.e. X.CompareTo(Y) > 0 when
     * X < Y. Such integers would effectively be sorted in
     * ascending order in the heap.
     *
     * Implementations may decide to implement other ways to suport
     * sorting objects in ascending or descending order.
     */
    public interface IHeap<T>
    {
        /**
         * Inserts the object into the heap.
         *
         * @param obj  The object to insert.
         */
        void Insert(T obj);

        /**
         * Removes and returns the root of the heap tree.
         *
         * Note that root is either the largest (heap sorted in the
         * desceding order) or the smallest (heap sorted in the
         * ascending order) node in the tree.
         *
         * @note It is a programming error to call remove on an empty
         * heap and result in an undefined behavior.
         *
         * @returns The root of the heap tree.
         */        
        T Remove();

        /**
         * The number of nodes in the heap.
         *
         * @return The number of nodes in the heap.
         */
        uint Size
        {
            get;
        }

        /**
         * Whether heap is empty.
         *
         * @return True if heap is empty, false otherwise.
         */
        bool IsEmpty
        {
            get;
        }
    }
}
