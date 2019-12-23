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
     * It is up to the implementation to provide means to control the
     * order of objects in the heap (ascending or descending).    
     */
    public interface IHeap<T>
    {
        /**
         * Inserts the object into the heap.
         *
         * The insertion is done so that heap condition is preserved. That is,
         * the new node comes before both its children (in case they exist) and
         * it comes after its parent.
         *
         * @param obj  The object to insert.
         * @throws ArgumentNullException if obj is NULL.
         */
        void Insert(T obj);

        /**
         * Removes and returns the root of the heap tree.
         *
         * Note that root is either the largest (heap sorted in the
         * desceding order) or the smallest (heap sorted in the
         * ascending order) node in the tree.
         *
         * @returns The root of the heap tree.
         * @throws IndexOutOfRangeException if heap is empty.
         */
        T Remove();

        /**
         * Clears the heap.
         *
         * The heap will be empty after this call.
         */
        void Clear();

        /**
         * The number of nodes in the heap.
         *
         * @return The number of nodes in the heap.
         */
        int Size
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
