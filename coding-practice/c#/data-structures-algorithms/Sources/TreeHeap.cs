using System;
using System.Diagnostics;

namespace datastructuresalgorithms
{
    /**
     * Heap implementation that uses binary tree to store nodes.
     *
     * Consider the following binary tree representing a heap of
     * strings sorted in ascending order:
     *
     *                                                      (0001)    
     *                                                         A
     *                                 _______________________| |_______________________
     *                                |                                                 |
     *                              (0010)                                            (0011)
     *                                B                                                 C
     *                  ______________||______________                      ____________||______________
     *                 |                              |                    |                            |
     *               (0100)                         (0101)               (0110)                       (0111)
     *                 D                              E                    F                            G
     *        _________||_________           _________||_________
     *       |                    |         |                    |
     *     (1000)               (1001)    (1010)               (1011)
     *       H                    I         J                    K
     *
     * The digits in the parenthes above each node is the binary representation
     * of the index of that node in the tree, where nodes around counted from
     * up to down and left to right and root starting at index 1. For example,
     * the 7th node in the tree (node G) has index 0111 (7) and the last 11th
     * node in the tree (node K) has index 1011 (11).
     *
     * Interestingly, we can find any node in the tree following the bits of
     * its index. Take the last node with index 1011.  Each time we encounter
     * a 0 bit we go left, and each time we encounter a bit 1 we go right.
     * Ignoring the bit that corresponds to the root (MSB bit or bit 3) we
     * have the following:
     *
     * 011 => Go from A to its left child B
     *  11 => Go from B to its right child E
     *   1 => Go from E to its right child K
     *
     * Hence we traced the path to the last node K simply using its index
     * in the tree. Note that index of the last node is equal to the tree
     * size. Similarly, the first empty node has index (size + 1) and we
     * can use the same procedure to find this node (or rather find its
     * parent).    
     */
    public class TreeHeap<T> : HeapBase<T>
    {
        /**
         * Represents a single node in the heap binary tree.
         */
        private class Node
        {
            public T Data { get; set; }
            public Node Parent { get; set; }
            public Node LeftChild { get; set; }
            public Node RightChild { get; set; }

            public Node(T data, Node parent = null, Node left_child = null, Node right_child = null)
            {
                Data = data;
                Parent = parent;
                LeftChild = left_child;
                RightChild = right_child;
            }
        }

        private Node Root { get; set; }

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
         *
         */
        public TreeHeap(Comparison<T> comparator = null) : base(comparator)
        {
            Root = null;
        }

        /**
         * Finds the last node in the tree.
         *
         * Uses the procedure described in the class @brief to find the
         * last node in the tree.
         *
         * @return The last node in the tree.
         */
        private Node FindLastNode()
        {
            Debug.Assert(Size > 0);

            // Firstly compute a power-of-two mask that is smaller or equal
            // to the tree size. Note, however, that this will produce a
            // mask where the MSB bit index is the same as that of the
            // tree size. This mask will need to be shifted right before
            // used to make sure we ignore the MSB bit of the size.
            uint mask = (uint)Size >> 1;

            // The following will set all bits below the highest set bit.
            mask |= mask >> 1;
            mask |= mask >> 2;
            mask |= mask >> 4;
            mask |= mask >> 8;
            mask |= mask >> 16;

            // Add 1 to the mask to make it a power of two
            ++mask;

            // Traverse the tree until the mask is not zero. Note that mask
            // is shifted to the right before used in the loop. This is to
            // ignore the MSB bit of the tree size.
            Node last_node = Root;
            while ((mask >>= 1) != 0)
            {
                if ((mask & Size) == 0)
                {
                    // Continue the traversal in the left child
                    last_node = last_node.LeftChild;
                }
                else
                {
                    // Continue the traversal in the right child
                    last_node = last_node.RightChild;
                }
            }
            return last_node;
        }

        /**
         * Find the parent of the first empty node in the tree.
         *
         * Uses the procedure describe in the class @brief to find the
         * parent of the first empty node in the tree. Note that the
         * first empty node has (size + 1) index.        
         *
         * @note The caller will have to check whether the first empty
         * node is the left or right child of the returned parent node.
         * If left child is not NULL then the right child is the first
         * empty node, otherwise the left child is the first empty node.
         *
         * @return The parent of the first empty node in the tree.
         */
        private Node FindFirstEmptyNodeParent()
        {
            Debug.Assert(Size > 0);

            // Firstly compute a power-of-two mask that is smaller or equal
            // to the (size + 1). Note, however, that this will produce a
            // mask where the MSB bit index is the same as that of the
            // (size + 1). This mask will need to be shifted right before
            // used to make sure we ignore the MSB bit of the (size + 1)
            // which corresponds to the root node and is always 1.
            uint empty_node_index = (uint)Size + 1;
            uint mask = empty_node_index >> 1;

            // The following will set all bits below the highest set bit.
            mask |= mask >> 1;
            mask |= mask >> 2;
            mask |= mask >> 4;
            mask |= mask >> 8;
            mask |= mask >> 16;

            // Add 1 to the mask to make it a power of two
            ++mask;

            // Traverse the tree until the mask is not one. Note that we
            // stop the loop before mask becomes 0. This is because we'll
            // reach the parent node when mask is 2, and executing another
            // iteration would cause NullPointerException as we'd try to
            // access the fields of the left or child child of a NULL node.
            // Also note that mask is shifted to the right before used in
            // the loop. This is to ignore the MSB bit of the tree size.
            Node parent = Root;
            while ((mask >>= 1) != 1)
            {
                if ((mask & empty_node_index) == 0)
                {
                    // Continue the traversal in the left child
                    parent = parent.LeftChild;
                }
                else
                {
                    // Continue the traversal in the right child
                    parent = parent.RightChild;
                }
            }
            return parent;
        }

        /**
         * Inserts the object into the heap.
         *
         * The algorithm conceptually works as follows:
         * 1) The new node is inserted in the first empty place in the tree.
         *    The parent of the empty node is obtained using the
         *    FindFirstEmptyNodeParent() method. Note that this makes sure
         *    that the heap tree stays complete. However, this might break
         *    the heap-condition in the parent of the new node.
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
        public override void Insert(T obj)
        {
            if (IsNullable && obj == null)
            {
                throw new ArgumentNullException(nameof(obj), "Parameter 'obj' is NULL");
            }

            // If tree is empty allocate the root
            if (Root == null)
            {
                Root = new Node(obj);
                ++Size;
                return;
            }

            // Find the parent of the first empty node
            Node parent = FindFirstEmptyNodeParent();

            // Assign a new node to its parent. If parent's left child is
            // NULL assign the new node to its left child, otherwise assign
            // the new node to its right child. This will make sure the
            // tree stays complete. Note that we're assigning the new node
            // to the parent node so we don't have to check whether child is
            // NULL before copying parent node to the child node in the
            // following loop. Also note that we don't set the actual data
            // in the new node at this point. This is because the following
            // loop might overwrite that data with the data from the node in
            // the upper level.
            Node child = new Node(default(T), parent);
            if (parent.LeftChild == null)
            {
                parent.LeftChild = child;
            }
            else
            {
                parent.RightChild = child;
            }

            // Making the new node child of the parent node could've broken
            // the heap-condition in the parent node. The following loop
            // trickles the new node up the tree until a suitable location
            // is found for it (the place where new node will be greater or
            // come after its parent).
            while (parent != null)
            {
                if (Comparator(obj, parent.Data) >= 0)
                {
                    // New node is greater (comes after) the current parent node.
                    // In other words, we've found the place for the new node as
                    // (left or right) child of the current parent node.
                    break;
                }

                // Otherwise, continue the search one level up. We now know that
                // the current parent node is greater (comes after) the new node
                // so copy its data down to its child
                child.Data = parent.Data;
                child = parent;
                parent = parent.Parent;
            }

            // The 'child' references the tree node where the new value fits in,
            // so copy the new data to it and increment the tree size.
            child.Data = obj;
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
         *    The last node is located via FindLastNode() method. Note that        
         *    this operation might break the heap-condition in the root.
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
         * @returns The root of the heap tree.
         * @throws IndexOutOfRangeException if heap is empty.
         */
        public override T Remove()
        {
            if (Size == 0)
            {
                throw new IndexOutOfRangeException("heap is empty");
            }

            // Handle the corner-case of a heap with a single node
            if (Size == 1)
            {
                Size = 0;
                Node tmp = Root;
                Root = null;
                return tmp.Data;
            }

            // Save the root's data as we need to return it later
            T root_data = Root.Data;

            // Find the last node in the tree. This is the node that will be
            // trickled down the tree to find its new location and in doing so
            // restore the heap condition to that node.
            Node last_node = FindLastNode();

            // Unplug this node from the tree, by setting parent's (left or
            // right) child to NULL
            if (last_node.Parent.LeftChild == last_node)
            {
                last_node.Parent.LeftChild = null;
            }
            else
            {
                last_node.Parent.RightChild = null;
            }

            // The parent of the nodes to be examined in each loop iteration
            // and its left child
            Node parent = Root;
            Node left_child = Root.LeftChild;

            // The following loop will trickle down the new node until a
            // location is found where this node is smaller (comes before)
            // both its children. After the loop exits, the parent points
            // to the tree node where new data should be placed to.
            while (left_child != null)
            {
                // Which of the two children is smaller, or in other words which
                // child 'comes before'. The ordering is defined by the comparator
                Node smaller_child = left_child;

                if (parent.RightChild != null &&
                    Comparator(parent.RightChild.Data, left_child.Data) < 0)
                {
                    // The right child exists and it is smaller than the left
                    // child
                    smaller_child = parent.RightChild;
                }

                if (Comparator(last_node.Data, smaller_child.Data) <= 0)
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

                // Otherwise, continue the search one level down. We now know that
                // the smaller child is smaller (comes before) than the new node
                // so copy its data to the parent node
                parent.Data = smaller_child.Data;
                parent = smaller_child;
                left_child = parent.LeftChild;
            }

            // Last node takes its place at the node referenced by 'parent',
            // so copy its data to that node and decrement the heap size.
            parent.Data = last_node.Data;
            --Size;
            return root_data;
        }

        /**
         * Clears the heap.
         *
         * The heap will be empty after this call.
         */
        public override void Clear()
        {
            Root = null;
            Size = 0;
        }
    }
}
