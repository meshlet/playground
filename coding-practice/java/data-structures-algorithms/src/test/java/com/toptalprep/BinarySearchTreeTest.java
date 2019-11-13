package com.toptalprep;

import static org.junit.Assert.*;
import org.junit.Test;

import java.util.Arrays;
import java.util.Iterator;
import java.util.Vector;

/**
 * Unit tests for the BinarySearchTree class.
 */
public class BinarySearchTreeTest {

	/**
	 * Asserts that tree is empty upon creation.
	 */
	@Test
	public void treeIsEmptyUponCreation() {
		BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
		assertTrue(tree.isEmpty());
	}

	/**
	 * Asserts that tree is not empty after node has been inserted.
	 */
	@Test
	public void treeNoEmptyAfterInsertion() {
		BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
		tree.insert(5L, 5L);
		assertFalse(tree.isEmpty());
	}
	
	/**
	 * Tests insertion operation together with in-order traversal.
	 */
	@Test
	public void testInsertionAndInorderTraversal() {
		class NodeVisitorImpl implements BinarySearchTree.NodeVisitor<Long> {
			public Vector<Long> m_actual_inorder_keys_out = new Vector<Long>();
			
			public boolean visit(long key, Long node) {
				m_actual_inorder_keys_out.add(key);
				return true;
			}
		}
		
		class TestVector {
			public long[] m_keys_in;
			
			public TestVector(long[] keys_in) {
				m_keys_in = keys_in;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new long[] { }),
				
				new TestVector(
						new long[] { 5 }),
				
				new TestVector(
						new long[] { 10, -50, -80, 50, -100, 100, 60, -60, 102, -25, -35, 101, 0, -40, -30 }),
				
				new TestVector(
						new long[] { 0, -50, -100, 50, 25, -150, -25, 100, 75, 120, -70, 65, 70, 72, 67, 90 }),
				
				new TestVector(
						new long[] { 0, 50, 30, 70, -10, -20, 80, -20, 90, 75 }),
				
				new TestVector(
						new long[] { 0, 100, -50, 50, -100, 150, -25, 120, 105, 200 }),
				
				new TestVector(
						new long[] { 5, 5, 5, 5, 5, 5, 5, 5, 5 }),
				
				new TestVector(
						new long[] { 6, -45, 111, 456, -4243, 0, 563, 7, -900, 319, 452, -2, 2222, -758, 0, 6 })
		};
		
		for (TestVector test_vector: test_vectors) {
			BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in-order
			NodeVisitorImpl visitor = new NodeVisitorImpl();
			tree.traverseInorder(visitor);
			
			// In-order traversal should produce the sequence of keys sorted in
			// ascending order, hence sort test_vector.m_keys_in first
			Arrays.sort(test_vector.m_keys_in);
			
			// Compare the expected and the generated array of keys
			Iterator<Long> it = visitor.m_actual_inorder_keys_out.iterator();
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				assertEquals(test_vector.m_keys_in[i], it.next().longValue());
			}
		}
	}
}
