using System;
using System.Collections.Generic;
using System.Linq;
using System.Diagnostics;

namespace datastructuresalgorithms
{
    /**
     * Heap implementation using an array to store nodes.
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
    public class ArrayHeap<T> : IHeap<T>
    {
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
        private Comparison<T> Comparator
        {
            get; set;
        }

        /**
         * Whether type T is nullable or not.
         *
         * This field exists only to remove the overhead of checking whether
         * a type is nullable each time Insert method is called.
         */
        private bool IsNullable
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
         * @throws ApplicationException if comparator is null and the T is
         *         neither a Nullable type nor it implements the IComparable
         *         interface.
         * @throws ArgumentException if initial_capacity is negative or zero
         *
         */
        public ArrayHeap(int initial_capacity = 10, Comparison<T> comparator = null)
        {
            if (initial_capacity <= 0)
            {
                throw new ArgumentException("initial_capacity must positive");
            }

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

            Nodes = new T[initial_capacity];
            IsNullable = !typeof(T).IsValueType || Nullable.GetUnderlyingType(typeof(T)) != null;
        }

        /**
         * Double the size of the underlying array.
         *
         * The method will allocate a new array and copy contents of the
         * existing array to it.        
         */
        private void Resize()
        {
            T[] old_nodes = Nodes;
            Nodes = new T[2 * Nodes.Length];

            old_nodes.CopyTo(Nodes, 0);
        }

        /**
         * Inserts the object into the heap.
         *
         * The algorithm conceptually works as follows:
         * 1) The new node is inserted at the very end of the array. This
         *    makes sure that the heap tree stays complete. However, this
         *    might break the heap-condition in the parent of the new node.
         * 2) The new node is trickled up the tree until we find a location
         *    where new node is greater (as defined by the comparator) than
         *    its parent. Note that every node that is found to be greater
         *    than the new node is swapped with the new node during this
         *    traversal. This makes sure that new node is in the correct
         *    position in respect to these nodes.        
         *
         * @param obj  The object to insert.
         * @throws ArgumentNullException if obj is NULL (can happen only if T is
         * a reference or nullable value type).        
         */
        public void Insert(T obj)
        {
            if (IsNullable && obj == null)
            {
                throw new ArgumentNullException(nameof(obj), "Parameter 'obj' is NULL");
            }

            // Resize the underlying array if necessary
            if (Size == Nodes.Length)
            {
                Resize();
            }

            // The array index where the new node will be placed to. We start
            // at the first free array cell, which is the cell at the array
            // index 'Size'. Note that we don't actually copy the 'obj' into
            // this array index. We'll only do the copy once we find the cell
            // where new node belongs to.
            int new_node_index = Size;

            // The following loop trickles up the new node until its place in
            // the heap is found.
            while (new_node_index > 0)
            {
                int parent_index = (new_node_index - 1) >> 1;

                if (Comparator(obj, Nodes[parent_index]) >= 0)
                {
                    // New node is greater (comes after) the node at parent_index.
                    // In other words, we've found the place for the new node at
                    // new_node_index
                    break;
                }

                // Otherwise, continue the search one level up. We now know that
                // the node at parent_index is greater (comes after) the new
                // node so copy it to new_node_index
                Nodes[new_node_index] = Nodes[parent_index];
                new_node_index = parent_index;
            }

            // Place the new node in its place and increment the heap size
            Nodes[new_node_index] = obj;
            ++Size;
        }

        /**
         * Removes and returns the root of the heap tree.
         *
         * Note that root is either the largest (heap sorted in the
         * desceding order) or the smallest (heap sorted in the
         * ascending order) node in the tree.
         *
         * The algorithm conceptually works as follows:
         * 1) The very last node in the heap tree replaces the root node.
         *    This makes sure that the tree stays complete after this step.
         *    However, this operation might break the heap-condition in the
         *    root.
         * 2) The new root node (which used to be the last node in the tree)
         *    is trickled down the tree until we find a location where this
         *    node is smaller than both its children.
         *    In each step of this traversal, the node is checked with the
         *    smaller of two its children and if greater than that child the
         *    node is swapped with the child. Note that it is important to
         *    swap the node and the smaller child - swapping with the larger
         *    child could break the heap condition, because the larger child
         *    could become a parent of the smaller child.        
         *
         * @returns The root of the heap tree or NULL if the heap is empty.
         * @throws IndexOutOfRangeException if heap is empty.
         */
        public T Remove()
        {
            if (Size == 0)
            {
                throw new IndexOutOfRangeException("heap is empty");
            }

            // Handle the corner-case of a heap with single node
            if (Size == 1)
            {
                Size = 0;
                return Nodes[0];
            }

            // Save the root as we need to return it later
            T root = Nodes[0];

            // Save the last node in the heap. This is the node that will be
            // trickled down the tree to find its new location and in doing so
            // restore the heap condition to that node.
            T last_node = Nodes[Size - 1];

            // Decrement the heap size
            --Size;

            // The index of the parent of the nodes to be examined in each
            // iteration of the following loop and the index of its left
            // child
            int parent_index = 0;
            int left_child_index = 1;

            // At the moment, last_node might not satisfy the heap condition
            // (that is, it might not 'come before' both of its children as
            // specified by the comparator). The following loop with trickle
            // this node down the heap tree to find its location in which the
            // heap condition will be satisfied. Note that this loop terminates
            // if: 1) the end of the heap is reached which means that the
            // last_node will replace one of the nodes in the last level of
            // the tree, or 2) we find two child nodes that are both greater
            // than the last_node at which point we know that last_nodes should
            // take place of their parent (which is moved one level up).
            while (left_child_index < Size)
            {
                // Which of the two children is smaller, or in other words which
                // child 'comes before'. The ordering is defined by the comparator
                int smaller_child_index = left_child_index;

                if (left_child_index + 1 < Size &&
                    Comparator(Nodes[left_child_index + 1], Nodes[left_child_index]) < 0)
                {
                    // The right child exists and it is smaller than the left
                    // child, so set the smaller_child_index to point to the
                    // right child
                    ++smaller_child_index;
                }

                if (Comparator(last_node, Nodes[smaller_child_index]) <= 0)
                {
                    // Found the spot for the last_node as it is smaller (comes
                    // before) both of the children of the current parent node.
                    // The last_node will replace the current parent node, which
                    // was moved to its new location (one level up the tree) in
                    // the previous iteration of the loop.
                    //
                    // Note that this is not the last level of the tree, otherwise
                    // the while loop would've been terminated already.
                    break;
                }

                // Otherwise, replace the current parent node by its child at
                // smaller_child_index (this restores the heap condition at
                // that node) and continue the trickle down procedure in the
                // smaller_child_index subtree
                Nodes[parent_index] = Nodes[smaller_child_index];
                parent_index = smaller_child_index;

                // Left child of the current parent node. Note that the right
                // child is always located at (left_child_index + 1) index
                left_child_index = (parent_index << 1) + 1;
            }

            // last_node takes its place at the node located at parent_index
            Nodes[parent_index] = last_node;
            return root;
        }

        /**
         * Clears the heap.
         *
         * The heap will be empty after this call. The clearing is done by
         * simply setting the heap size to 0.
         *
         * @note The current implementation doesn't shrink the array when heap
         * is cleared. It might make sense to do that when heap grows a lot.
         * This could be implemented by allocating a new array of size determined
         * by the initial_capacity passed in by the user.        
         */
        public void Clear()
        {
            Size = 0;
        }

        /**
         * The number of nodes in the heap.
         *
         * @return The number of nodes in the heap.
         */
        public int Size
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
