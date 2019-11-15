package com.toptalprep;

/**
 * Implements a classic binary tree that supports insertion,
 * lookup, deletion and most common traversal methods (in-order,
 * pre-order and post-order).
 */
public class BinarySearchTree<KeyT extends Comparable<KeyT>, DataT> {
	/**
	 * Represents a single tree node.
	 */
	private class Node {
		public Node m_left_child;
		public Node m_right_child;
		public KeyT m_key;
		public DataT m_data;
		
		Node(KeyT key, DataT data) {
			m_left_child = m_right_child = null;
			m_data = data;
			m_key = key;
		}
		
		/**
		 * Resets m_left_child or m_right_child to 'new_node' if one of
		 * them matches the 'cmp_node'. Otherwise the method does nothing.
		 *
		 * @param cmp_node  Compared with m_left_child and m_right_child to
		 *                  decide which one to reset.
		 * @param new_node  m_left_child or m_right_child will be set to
		 *                  'new_node' if one of them matches the 'cmp_node'.
		 */
		public void resetChild(Node cmp_node, Node new_node) {
			if (m_left_child == cmp_node) {
				m_left_child = new_node;
			}
			else if (m_right_child == cmp_node) {
				m_right_child = new_node;
			}
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
	
	private Node m_root;
	
	public BinarySearchTree() {
		m_root = null;
	}
	
	/**
	 * Inserts the data to the tree.
	 *
	 * @param key   The key.
	 * @param data  The data to insert
	 */
	public void insert(KeyT key, DataT data)
	{
		if (m_root == null) {
			m_root = new Node(key, data);
			return;
		}
		
		insertInternal(key, data, m_root);
	}
	
	private void insertInternal(KeyT key, DataT data, Node subtree_root) {
		if (key.compareTo(subtree_root.m_key) < 0) {
			// Data placed in the left subtree of the current root
			if (subtree_root.m_left_child == null) {
				subtree_root.m_left_child = new Node(key, data);
			}
			else {
				insertInternal(key, data, subtree_root.m_left_child);
			}
		}
		else {
			// Data placed in the right subtree of the current root
			if (subtree_root.m_right_child == null) {
				subtree_root.m_right_child = new Node(key, data);
			}
			else {
				insertInternal(key, data, subtree_root.m_right_child);
			}
		}
	}
	
	/**
	 * Traverses the tree in in-order fashion (left child, root and the
	 * right child visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traverseInorder(NodeVisitor<KeyT, DataT> visitor) {
		traverseInorderInternal(visitor, m_root);
	}
	
	private boolean traverseInorderInternal(NodeVisitor<KeyT, DataT> visitor, Node subtree_root) {
		if (subtree_root == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Traverse the left subtree
		if (!traverseInorderInternal(visitor, subtree_root.m_left_child)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Visit the subtree root
		if (!visitor.visit(subtree_root.m_key, subtree_root.m_data)) {
			// Halt the traversal as visitor.visit() for the current root returned
			// false
			return false;
		}
		
		// Traverse the right subtree and return whatever value is returned
		// by the recursive traversal of that subtree
		return traverseInorderInternal(visitor, subtree_root.m_right_child);
	}
	
	/**
	 * Traverses the tree in pre-order fashion (root, left child and right
	 * child visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traversePreorder(NodeVisitor<KeyT, DataT> visitor) {
		traversePreorderInternal(visitor, m_root);
	}
	
	private boolean traversePreorderInternal(NodeVisitor<KeyT, DataT> visitor, Node subtree_root) {
		if (subtree_root == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Visit the subtree root
		if (!visitor.visit(subtree_root.m_key, subtree_root.m_data)) {
			// Halt the traversal as visitor.visit() for the current root returned
			// false
			return false;
		}
		
		// Traverse the left subtree
		if (!traversePreorderInternal(visitor, subtree_root.m_left_child)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Traverse the right subtree and return whatever value is returned
		// by the recursive traversal of that subtree
		return traversePreorderInternal(visitor, subtree_root.m_right_child);
	}
	
	/**
	 * Traverses the tree in post-order fashion (left child, right child and
	 * root visited in that order).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traversePostorder(NodeVisitor<KeyT, DataT> visitor) {
		traversePostorderInternal(visitor, m_root);
	}
	
	private boolean traversePostorderInternal(NodeVisitor<KeyT, DataT> visitor, Node subtree_root) {
		if (subtree_root == null) {
			// We don't want to halt traversal as this only means that the parent of
			// this node doesn't have left and/or right child
			return true;
		}
		
		// Traverse the left subtree
		if (!traversePostorderInternal(visitor, subtree_root.m_left_child)) {
			// Halt the traversal as visitor.visit() for one of the left subtree
			// children returned false
			return false;
		}
		
		// Traverse the right subtree
		if (!traversePostorderInternal(visitor, subtree_root.m_right_child)) {
			// Halt the traversal as visitor.visit() for one of the right subtree
			// children returned false
			return false;
		}
		
		// Visit the subtree root and return whatever value is returned by the
		// visitor.visit() method
		return visitor.visit(subtree_root.m_key, subtree_root.m_data);
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
		return findInternal(key, m_root);
	}
	
	private DataT findInternal(KeyT key, Node subtree_root) {
		if (subtree_root == null) {
			// We didn't find the node with the given key
			return null;
		}
		
		if (key.compareTo(subtree_root.m_key) == 0) {
			// Found the node with given key
			return subtree_root.m_data;
		}
		else if (key.compareTo(subtree_root.m_key) < 0) {
			// Proceed the search in the left subtree
			return findInternal(key, subtree_root.m_left_child);
		}
		else {
			// Proceed the search in the right subtree
			return findInternal(key, subtree_root.m_right_child);
		}
	}
	
	/**
	 * Deletes the node with the specified key. If there are multiple
	 * nodes with the given key the method will delete the first one
	 * it encounters.
	 *
	 * @param key  The key of the node to delete.
	 *
	 * @return The deleted node or null if node with the specified key
	 *         hasn't been found.
	 */
	public DataT delete(KeyT key) {
		if (m_root == null) {
			return null;
		}
		
		Node parent = null;
		Node delnode = m_root;
		
		while (delnode != null && delnode.m_key.compareTo(key) != 0) {
			parent = delnode;
			if (key.compareTo(delnode.m_key) < 0) {
				// Continue the search in the left subtree
				delnode = delnode.m_left_child;
			}
			else {
				// Otherwise continue the search in the right subtree
				delnode = delnode.m_right_child;
			}
		}
		
		if (delnode != null) {
			// Found the node with the matching key
			if (delnode.m_left_child == null && delnode.m_right_child == null) {
				// This is a leaf node
				if (delnode == m_root) {
					// As delnode is the root of the tree simply set m_root to null
					m_root = null;
				}
				else {
					// Otherwise, remove the delnode by setting parent's child reference
					// to null
					parent.resetChild(delnode, null);
				}
			}
			else if (delnode.m_left_child != null && delnode.m_right_child != null) {
				// We need to find the successor of the delnode. This is the node whose
				// key is the minimal key in the tree greater than delnode's key. This
				// node can be found by finding the node with minimal key in the right
				// subtree of the delnode. The successor will take delnode's place in
				// the tree.
				Node successor_parent = delnode;
				Node successor = delnode.m_right_child;
				
				while (successor.m_left_child != null) {
					successor_parent = successor;
					successor = successor.m_left_child;
				}
				
				// Make the delnode's left child the left child of the successor node,
				// which effectively means that successor inherits the left subtree
				// of the delnode
				successor.m_left_child = delnode.m_left_child;
				
				if (delnode == m_root) {
					// As delnode is the root of the tree, make successor the new
					// root
					m_root = successor;
				}
				else {
					// Otherwise, remove the delnode by setting parent's child reference
					// to the successor
					parent.resetChild(delnode, successor);
				}
				
				if (successor != delnode.m_right_child) {
					// The following needs to be done only if successor is not the
					// right child of the delnode
					if (successor.m_right_child == null) {
						// As successor has no right child simply set the successor
						// parent's left child to null
						successor_parent.m_left_child = null;
					}
					else {
						// Otherwise, successor parent inherits the successor's right
						// child as its left child
						successor_parent.m_left_child = successor.m_right_child;
					}
					
					// Successor inherits the right child of the delnode as its right
					// child (must happen only if successor isn't the right child of
					// delnode otherwise we're creating a circular dependency)
					successor.m_right_child = delnode.m_right_child;
				}
			}
			else {
				// Node's left child is null and right child is NOT null, or node's
				// left child is NOT null and right child is null
				Node child = delnode.m_left_child != null ? delnode.m_left_child : delnode.m_right_child;
				if (delnode == m_root) {
					// As delnode is the root of the tree simply set the m_root to
					// the only child of delnode
					m_root = child;
				}
				else {
					// Otherwise, remove the node by setting the parent's child
					// reference to the only child of delnode
					parent.resetChild(delnode, child);
				}
			}
		}
		
		return delnode != null ? delnode.m_data : null;
	}

	/**
	 * Whether the tree is empty.
	 *
	 * @return 'true' if tree is empty, 'false' otherwise.
	 */
	public boolean isEmpty() {
		return m_root == null;
	}
}
