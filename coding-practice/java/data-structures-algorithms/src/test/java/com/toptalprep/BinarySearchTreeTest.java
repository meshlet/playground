package com.toptalprep;

import static org.junit.Assert.*;
import org.junit.Test;

import java.util.Arrays;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.Vector;

/**
 * Unit tests for the BinarySearchTree class.
 */
public class BinarySearchTreeTest {

	private class DefaultNodeVisitorImpl<T> implements BinarySearchTree.NodeVisitor<T> {
		public Vector<Long> m_actual_keys_out = new Vector<Long>();
		
		public boolean visit(long key, T node) {
			m_actual_keys_out.add(key);
			return true;
		}
	}

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
			DefaultNodeVisitorImpl<Long> visitor = new DefaultNodeVisitorImpl<Long>();
			tree.traverseInorder(visitor);
			
			// In-order traversal should produce the sequence of keys sorted in
			// ascending order, hence sort test_vector.m_keys_in first
			Arrays.sort(test_vector.m_keys_in);
			
			// Compare the expected and the generated array of keys
			Iterator<Long> it = visitor.m_actual_keys_out.iterator();
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				assertEquals(test_vector.m_keys_in[i], it.next().longValue());
			}
		}
	}
	
	/**
	 * Tests insertion operation together with pre-order traversal.
	 */
	@Test
	public void testInsertionAndPreorderTraversal() {
		class TestVector {
			public long[] m_keys_in;
			public long[] m_expected_preorder_keys_out;
			
			public TestVector(long[] keys_in, long[] expected_preorder_keys_out) {
				m_keys_in = keys_in;
				m_expected_preorder_keys_out = expected_preorder_keys_out;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new long[] { },
						new long[] { }),
				
				new TestVector(
						new long[] { 5 },
						new long[] { 5 }),
				
				new TestVector(
						new long[] { 10, -50, -80, 50, -100, 100, 60, -60, 102, -25, -35, 101, 0, -40, -30 },
						new long[] { 10, -50, -80, -100, -60, -25, -35, -40, -30, 0, 50, 100, 60, 102, 101 }),
				
				new TestVector(
						new long[] { 0, -50, -100, 50, 25, -150, -25, 100, 75, 120, -70, 65, 70, 72, 67, 90 },
						new long[] { 0, -50, -100, -150, -70, -25, 50, 25, 100, 75, 65, 70, 67, 72, 90, 120 }),
				
				new TestVector(
						new long[] { 0, 50, 30, 70, -10, -20, 80, -20, 90, 75 },
						new long[] { 0, -10, -20, -20, 50, 30, 70, 80, 75, 90 }),
				
				new TestVector(
						new long[] { 0, 100, -50, 50, -100, 150, -25, 120, 105, 200 },
						new long[] { 0, -50, -100, -25, 100, 50, 150, 120, 105, 200 }),
				
				new TestVector(
						new long[] { 5, 5, 5, 5, 5, 5, 5, 5, 5 },
						new long[] { 5, 5, 5, 5, 5, 5, 5, 5, 5 }),
				
				new TestVector(
						new long[] { 6, -45, 111, 456, -4243, 0, 563, 7, -900, 319, 452, -2, 2222, -758, 0, 6 },
						new long[] { 6, -45, -4243, -900, -758, 0, -2, 0, 111, 7, 6, 456, 319, 452, 563, 2222 })
		};
		
		for (TestVector test_vector: test_vectors) {
			BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in pre-order fashion
			DefaultNodeVisitorImpl<Long> visitor = new DefaultNodeVisitorImpl<Long>();
			tree.traversePreorder(visitor);
			
			// Compare the expected and the generated array of keys
			Iterator<Long> it = visitor.m_actual_keys_out.iterator();
			for (int i = 0; i < test_vector.m_expected_preorder_keys_out.length; ++i) {
				assertEquals(test_vector.m_expected_preorder_keys_out[i], it.next().longValue());
			}
		}
	}
	
	/**
	 * Tests insertion operation together with post-order traversal.
	 */
	@Test
	public void testInsertionAndPostorderTraversal() {
		class TestVector {
			public long[] m_keys_in;
			public long[] m_expected_postorder_keys_out;
			
			public TestVector(long[] keys_in, long[] expected_preorder_keys_out) {
				m_keys_in = keys_in;
				m_expected_postorder_keys_out = expected_preorder_keys_out;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new long[] { },
						new long[] { }),
				
				new TestVector(
						new long[] { 5 },
						new long[] { 5 }),
				
				new TestVector(
						new long[] { 10, -50, -80, 50, -100, 100, 60, -60, 102, -25, -35, 101, 0, -40, -30 },
						new long[] { -100, -60, -80, -40, -30, -35, 0, -25, -50, 60, 101, 102, 100, 50, 10 }),
				
				new TestVector(
						new long[] { 0, -50, -100, 50, 25, -150, -25, 100, 75, 120, -70, 65, 70, 72, 67, 90 },
						new long[] { -150, -70, -100, -25, -50, 25, 67, 72, 70, 65, 90, 75, 120, 100, 50, 0 }),
				
				new TestVector(
						new long[] { 0, 50, 30, 70, -10, -20, 80, -20, 90, 75 },
						new long[] { -20, -20, -10, 30, 75, 90, 80, 70, 50, 0 }),
				
				new TestVector(
						new long[] { 0, 100, -50, 50, -100, 150, -25, 120, 105, 200 },
						new long[] { -100, -25, -50, 50, 105, 120, 200, 150, 100, 0 }),
				
				new TestVector(
						new long[] { 5, 5, 5, 5, 5, 5, 5, 5, 5 },
						new long[] { 5, 5, 5, 5, 5, 5, 5, 5, 5 }),
				
				new TestVector(
						new long[] { 6, -45, 111, 456, -4243, 0, 563, 7, -900, 319, 452, -2, 2222, -758, 0, 6 },
						new long[] { -758, -900, -4243, -2, 0, 0, -45, 6, 7, 452, 319, 2222, 563, 456, 111, 6 })
		};
		
		for (TestVector test_vector: test_vectors) {
			BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in post-order fashion
			DefaultNodeVisitorImpl<Long> visitor = new DefaultNodeVisitorImpl<Long>();
			tree.traversePostorder(visitor);
			
			// Compare the expected and the generated array of keys
			Iterator<Long> it = visitor.m_actual_keys_out.iterator();
			for (int i = 0; i < test_vector.m_expected_postorder_keys_out.length; ++i) {
				assertEquals(test_vector.m_expected_postorder_keys_out[i], it.next().longValue());
			}
		}
	}
	
	/**
	 * Tests the find method.
	 */
	@Test
	public void testFind() {
		class NodeData {
			public long m_key;
			public Long m_data;
			
			public NodeData(long key, Long data) {
				m_key = key;
				m_data = data;
			}
			
			@Override
			public boolean equals(Object obj) {
				if (this == obj) {
					return true;
				}
				
				if (obj == null) {
					return false;
				}
				
				if (getClass() != obj.getClass()) {
					return false;
				}
				
				NodeData data = (NodeData) obj;
				return m_key == data.m_key && m_data.equals(data.m_data);
			}
		}
		
		class TestVector {
			public NodeData[] m_data_to_insert;
			public long[] m_keys_to_find;
			public NodeData[] m_expected_data_returned;
			
			public TestVector(NodeData[] data_to_insert, long[] keys_to_find, NodeData[] expected_data_returned) {
				m_data_to_insert = data_to_insert;
				m_keys_to_find = keys_to_find;
				m_expected_data_returned = expected_data_returned;
			}
		}
		
		TestVector[] test_vectors = {
			new TestVector(
					new NodeData[] { },
					new long[] { 3, 0, -1 },
					new NodeData[] { null, null, null } ),
			
			new TestVector(
					new NodeData[] { new NodeData(0L, 10L) },
					new long[] { 1, 3, 5, 6, 1, 0, 3, -45, 0 },
					new NodeData[] { null, null, null, null, null, new NodeData(0L, 10L), null, null, new NodeData(0L, 10L) }),
			
			new TestVector(
					new NodeData[] {
							new NodeData(10L, 1L),
							new NodeData(-50L, 2L),
							new NodeData(-80L, 3L),
							new NodeData(50L, 4L),
							new NodeData(-100L, 5L),
							new NodeData(100L, 6L),
							new NodeData(60L, 7L),
							new NodeData(-60L, 8L),
							new NodeData(102L, 9L),
							new NodeData(-25L, 10L),
							new NodeData(-35L, 11L),
							new NodeData(101L, 12L),
							new NodeData(0L, 13L),
							new NodeData(-40L, 14L),
							new NodeData(-30L, 15L)
					},
					new long[] { 10, -99, -80, -1, -100, 5, 60, -6, 102, -25, 0, 101, 7, 103, -30 },
					new NodeData[] {
							new NodeData(10L, 1L),
							null,
							new NodeData(-80L, 3L),
							null,
							new NodeData(-100L, 5L),
							null,
							new NodeData(60L, 7L),
							null,
							new NodeData(102L, 9L),
							new NodeData(-25L, 10L),
							new NodeData(0L, 13L),
							new NodeData(101L, 12L),
							null,
							null,
							new NodeData(-30L, 15L)
					}),
			
			new TestVector(
					new NodeData[] {
							new NodeData(5L, 0L),
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L),
							new NodeData(5L, 0L),
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L),
							new NodeData(5L, 0L),
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L),
							new NodeData(5L, 0L),
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L),
					},
					new long[] { -5, 10, 6, 7, 11, 6, -5, 5, 45, -3, 5, 6, -5 },
					new NodeData[] {
							new NodeData(-5L, 2L),
							null,
							new NodeData(6L, 1L),
							null,
							null,
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L),
							new NodeData(5L, 0L),
							null,
							null,
							new NodeData(5L, 0L),
							new NodeData(6L, 1L),
							new NodeData(-5L, 2L)
					})
		};
		
		for (TestVector test_vector : test_vectors) {
			BinarySearchTree<NodeData> tree = new BinarySearchTree<NodeData>();
			
			// Insert data into the tree
			for (int i = 0; i < test_vector.m_data_to_insert.length; ++i) {
				tree.insert(test_vector.m_data_to_insert[i].m_key, test_vector.m_data_to_insert[i]);
			}
			
			// Sanity check
			assertEquals(test_vector.m_keys_to_find.length, test_vector.m_expected_data_returned.length);
			
			for (int i = 0; i < test_vector.m_keys_to_find.length; ++i) {
				NodeData actual_data_found = tree.find(test_vector.m_keys_to_find[i]);
				assertEquals(test_vector.m_expected_data_returned[i], actual_data_found);
			}
		}
	}
	
	/**
	 * Tests the node deletion functionality.
	 */
	@Test
	public void testDeletion() {
		class TestVector {
			public ArrayList<Long> m_keys_in;
			public long[] m_keys_to_delete;
			
			public TestVector(ArrayList<Long> keys_in, long[] keys_to_delete) {
				m_keys_in = keys_in;
				m_keys_to_delete = keys_to_delete;
			}
		}
		
		TestVector[] test_vectors = {
			new TestVector(
					new ArrayList<Long>(Arrays.asList()),
					new long[] { 5, -1, 4, 3, -10, 11, 12 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(5L)),
					new long[] { 5, 5, -4, 10 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, -100L, -25L, -100L, 150L, 50L, 200L, 120L, 105L)),
					new long[] { 105, 120, 200, -300, 50, -100 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, -100L, -25L, -100L, 150L, 50L, 200L, 120L, 105L, -15L, -130L)),
					new long[] { 100, -25, -100 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -10L, 50L, 70L, 30L, -5L, -20L, 80L, 75L, 90L)),
					new long[] { 50, 80, -150 }),
			
			new TestVector(
					new ArrayList<Long>(
							Arrays.asList(0L, -50L, 50L, -100L, -25L, 25L, 100L, -150L, -70L, 75L, 65L, 90L, 12L, 70L, 72L, 67L)),
					new long[] { 50, 65, -300, -50, 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, 50L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, 50L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, -100L, -25L, -150L -70L, 50L, 100L, 75L, 120L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, -25L, -100L, -150L, -70L, 50L, 100L, 25L, 15L, 35L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(Arrays.asList(0L, -50L, -100L, -25L, 100L, 50L, 150L, 25L, 70L, 31L)),
					new long[] { 0 }),
			
			new TestVector(
					new ArrayList<Long>(
							Arrays.asList(0L, -50L, 50L, -100L, -25L, 25L, 100L, -150L, -70L, 75L, 65L, 90L, 12L, 70L, 72L, 67L)),
					new long[] { -150, 70, -25, -100, 100, 75, 0, 67, 12, 90, -70, -50, 65, 25, 72, 50, 100 })
		};
		
		for (TestVector test_vector : test_vectors) {
			BinarySearchTree<Long> tree = new BinarySearchTree<Long>();
			
			// Insert data into the tree
			for (Long key : test_vector.m_keys_in) {
				// Doesn't matter what data is inserted as long as its not null
				tree.insert(key, key);
			}
			
			// Sort the inserted keys in ascending order as they will be used
			// to compare against the keys produced by tree.traverseInorder
			// after each deletion
			test_vector.m_keys_in.sort(null);

			// Iterate over test_vector.m_keys_to_delete and delete each key
			// from the tree
			for (int i = 0; i < test_vector.m_keys_to_delete.length; ++i) {
				// Delete the key from the tree
				Long data = tree.delete(test_vector.m_keys_to_delete[i]);
				
				// Delete the key from the reference key array as well
				if (!test_vector.m_keys_in.remove(test_vector.m_keys_to_delete[i])) {
					// As the key wasn't found in the reference array, the deletion
					// method must have returned a null
					assertNull(data);
				}
				
				// If reference array is empty so must be the tree
				assertEquals(test_vector.m_keys_in.isEmpty(), tree.isEmpty());
				
				// Traverse the tree in-order and compare the generated array of keys
				// against the reference array
				DefaultNodeVisitorImpl<Long> visitor = new DefaultNodeVisitorImpl<Long>();
				tree.traverseInorder(visitor);
			
				// Sanity check
				assertEquals(test_vector.m_keys_in.size(), visitor.m_actual_keys_out.size());
				
				Iterator<Long> actual_key_iter = visitor.m_actual_keys_out.iterator();
				for (Long expected_key : test_vector.m_keys_in) {
					assertEquals(expected_key, actual_key_iter.next());
				}
			}
		}
	}
}
