package com.toptalprep;
import java.lang.Comparable;

/**
 * Implements a classic binary tree. Implementation doesn't make
 * a difference between the key and data. It assumes that key is
 * embedded in data and hence the data type must implement the
 * Comparable interface to be able to compare the objects.
 */
public class BinarySearchTree<T extends Comparable<T>> {
	private class Node {
		public Node m_left_child;
		public Node m_right_child;
		public T m_data;
		
		Node(T data) {
			m_left_child = m_right_child = null;
			m_data = data;
		}
	}
	
	/**
	 * An interface that allows uses of BinaryTree class to perform
	 * arbitrary actions at each node of the tree.
	 */
	public interface NodeVisitor<E extends Comparable<E>> {
		/**
		 * Called for each visited node by the tree's traversal methods.
		 * @param data  The node's data.
		 *
		 * @return Return 'true' to continue traversing the tree, 'false' to
		 *         halt the traversal.
		 */
		boolean visit(E data);
	}
	
	private Node m_root;
	
	public BinarySearchTree() {
		m_root = null;
	}
	
	/**
	 * Inserts the data to the tree.
	 *
	 * @param data  The data to insert
	 */
	public void insert(T data)
	{
		if (m_root == null) {
			m_root = new Node(data);
			return;
		}
		
		insertInternal(data, m_root);
	}
	
	private void insertInternal(T data, Node subtree_root) {
		if (data.compareTo(subtree_root.m_data) < 0) {
			// Data placed in the left subtree of the current root
			if (subtree_root.m_left_child == null) {
				subtree_root.m_left_child = new Node(data);
			}
			else {
				insertInternal(data, subtree_root.m_left_child);
			}
		}
		else {
			// Data placed in the right subtree of the current root
			if (subtree_root.m_right_child == null) {
				subtree_root.m_right_child = new Node(data);
			}
			else {
				insertInternal(data, subtree_root.m_right_child);
			}
		}
	}
	
	/**
	 * Traverses the tree in in-order fashion (left child visited first
	 * then root and finally the right child).
	 *
	 * @param visitor  visitor.visit() method is called for each visited
	 *        node. If method returns 'false' the traversal is stopped.
	 */
	public void traverseInorder(NodeVisitor<T> visitor) {
		if (m_root == null) {
			return;
		}
		
		
	}
	
	public boolean isEmpty() {
		return m_root == null;
	}
}
