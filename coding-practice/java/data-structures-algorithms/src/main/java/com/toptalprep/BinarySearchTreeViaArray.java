package com.toptalprep;

import java.util.Vector;

/**
 * Implements the binary search tree where nodes are placed in
 * an array. If current root is placed at array index i then its
 * left child is located at index (2*i + 1) and its right child
 * at index (2*i + 2). For (left or right) child index i, the
 * parent node is located at index floor((i - 1) / 2).
 *
 * The tree supports insertion, lookup, deletion as well as the
 * most common traversal methods (in-order, pre-order and post-
 * order).
 */
public class BinarySearchTreeViaArray<KeyT extends Comparable<KeyT>, DataT> {
	private class Node {
		public KeyT m_key;
		public DataT m_data;
		
		Node(KeyT key, DataT data) {
			m_key = key;
			m_data = data;
		}
	}
	
	/**
	 * An interface that allows users of BinaryTree class to perform
	 * arbitrary actions at each node of the tree.
	 */
	public interface NodeVisitor<KeyT extends Comparable<KeyT>, DataT> {
		/**
		 * Called for each visited node by the tree's traversal methods.
		 * @param data  The node's data.
		 *
		 * @return Return 'true' to continue traversing the tree, 'false' to
		 *         halt the traversal.
		 */
		boolean visit(KeyT key, DataT data);
	}
	
	Vector<Node> m_nodes;
	static final int DEFAULT_INITIAL_CAPACITY = 20;
	
	BinarySearchTreeViaArray() {
		m_nodes = new Vector<Node>(DEFAULT_INITIAL_CAPACITY);
	}
	
	BinarySearchTreeViaArray(int initial_capacity) {
		m_nodes = new Vector<Node>(initial_capacity);
	}
	
	/**
	 * Inserts the data to the tree.
	 *
	 * @param key   The key.
	 * @param data  The data to insert
	 */
	public void insert(KeyT key, DataT data) {
		int new_node_index = 0;
		while (new_node_index < m_nodes.size() && m_nodes.get(new_node_index) != null) {
			if (key.compareTo(m_nodes.get(new_node_index).m_key) < 0) {
				// Continue the search in the left subtree
				new_node_index = 2 * new_node_index + 1;
			}
			else {
				// Continue the search in the right subtree
				new_node_index = 2 * new_node_index + 2;
			}
		}
		
		// If index of the new node has surpassed the end of the array of nodes,
		// we must allocate all the nodes in the array between m_nodes.length and
		// new_node_index and set them to null. This makes sure that the new node
		// is placed at the correct index and setting the other elements to null
		// makes sure that those empty nodes are valid (e.g. traversal might
		// terminate in those nodes).
		// Moreover, many tree operations will be simplified if we can always assume
		// that both left and right children of a non-empty node are accessible (in
		// other words, array has entries for them but they might be null). Hence,
		// the following loop will create new elements for each index in the range
		// [m_nodes.length, 2 * new_node_index + 2], where (2 * new_node_index + 2)
		// is the right child of the new node.
		int new_node_right_child_index = 2 * new_node_index + 2;
		for (int i = m_nodes.size(); i <= new_node_right_child_index; ++i) {
			m_nodes.add(null);
		}
		
		// Finally assign new node to its index
		m_nodes.set(new_node_index, new Node(key, data));
	}
	
	/**
	 * Traverses the tree in in-order fashion (left child, root and the
	 * right child visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traverseInorder(NodeVisitor<KeyT, DataT> visitor) {
		if (m_nodes.isEmpty()) {
			return;
		}
		
		traverseInorderInternal(visitor, 0);
	}
	
	private boolean traverseInorderInternal(NodeVisitor<KeyT, DataT> visitor, int subtree_root_index) {
		if (m_nodes.get(subtree_root_index) == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Traverse the left subtree
		if (!traverseInorderInternal(visitor, 2 * subtree_root_index + 1)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Visit the current node
		if (!visitor.visit(m_nodes.get(subtree_root_index).m_key, m_nodes.get(subtree_root_index).m_data)) {
			// Halt the traversal as visitor.visit() for the current root returned
			// false
			return false;
		}
		
		// Traverse the right subtree and return whatever value is returned
		// by the recursive traversal of that subtree
		return traverseInorderInternal(visitor, 2 * subtree_root_index + 2);
	}
	
	/**
	 * Traverses the tree in pre-order fashion (root, left child and right
	 * child visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traversePreorder(NodeVisitor<KeyT, DataT> visitor) {
		if (m_nodes.isEmpty()) {
			return;
		}
		
		traversePreorderInternal(visitor, 0);
	}
	
	private boolean traversePreorderInternal(NodeVisitor<KeyT, DataT> visitor, int subtree_root_index) {
		if (m_nodes.get(subtree_root_index) == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Visit the current node
		if (!visitor.visit(m_nodes.get(subtree_root_index).m_key, m_nodes.get(subtree_root_index).m_data)) {
			// Halt the traversal as visitor.visit() for the current root returned
			// false
			return false;
		}
		
		// Traverse the left subtree
		if (!traversePreorderInternal(visitor, 2 * subtree_root_index + 1)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Traverse the right subtree and return whatever value is returned
		// by the recursive traversal of that subtree
		return traversePreorderInternal(visitor, 2 * subtree_root_index + 2);
	}
	
	/**
	 * Traverses the tree in post-order fashion (left child, right child and
	 * root visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traversePostorder(NodeVisitor<KeyT, DataT> visitor) {
		if (m_nodes.isEmpty()) {
			return;
		}
		
		traversePostorderInternal(visitor, 0);
	}
	
	private boolean traversePostorderInternal(NodeVisitor<KeyT, DataT> visitor, int subtree_root_index) {
		if (m_nodes.get(subtree_root_index) == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Traverse the left subtree
		if (!traversePostorderInternal(visitor, 2 * subtree_root_index + 1)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Traverse the right subtree
		if (!traversePostorderInternal(visitor, 2 * subtree_root_index + 2)) {
			// Halt the traversal as visitor.visit() for one of the right subtree
			// children returned false
			return false;
		}
		
		// Visit the subtree root and return whatever value is returned by the
		// visitor.visit() method
		return visitor.visit(m_nodes.get(subtree_root_index).m_key, m_nodes.get(subtree_root_index).m_data);
	}
	
	/**
	 * Attempts to find the node with the specified key.
	 *
	 * @param key  The key to search for.
	 *
	 * @return The node's data if node with the specified key is found,
	 *         null otherwise.
	 */
	public DataT find(KeyT key) {
		// Handle the empty tree here so that we don't need an extra
		// condition in the while loop below
		if (m_nodes.isEmpty()) {
			return null;
		}
		
		int node_index = 0;
		
		// The following loop will terminate when it finds the requested key
		// OR if it encounters the null node which means the key is not present
		// in the tree
		while (m_nodes.get(node_index) != null &&
				m_nodes.get(node_index).m_key.compareTo(key) != 0) {
			if (key.compareTo(m_nodes.get(node_index).m_key) < 0) {
				// Continue the search in the left subtree
				node_index = 2 * node_index + 1;
			}
			else {
				// Continue the search in the right subtree
				node_index = 2 * node_index + 2;
			}
		}
		
		return m_nodes.get(node_index) != null ? m_nodes.get(node_index).m_data : null;
	}
	
	/**
	 * Whether the tree is empty.
	 *
	 * @return 'true' if tree is empty, 'false' otherwise.
	 */
	public boolean isEmpty() {
		return m_nodes.isEmpty();
	}
}
