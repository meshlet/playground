package com.toptalprep;

import static org.junit.Assert.*;
import org.junit.Test;

import java.util.Arrays;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.Vector;

/**
 * Unit tests for the BinarySearchTreeViaArray class.
 */
public class BinarySearchTreeViaArrayTest {
	private class DefaultNodeVisitorImpl<KeyT extends Comparable<KeyT>, DataT> implements BinarySearchTreeViaArray.NodeVisitor<KeyT, DataT> {
		public Vector<KeyT> m_actual_keys_out = new Vector<KeyT>();
		
		public boolean visit(KeyT key, DataT node) {
			m_actual_keys_out.add(key);
			return true;
		}
	}

	/**
	 * Asserts that tree is empty upon creation.
	 */
	@Test
	public void treeIsEmptyUponCreation() {
		BinarySearchTreeViaArray<Long, Long> tree = new BinarySearchTreeViaArray<Long, Long>();
		assertTrue(tree.isEmpty());
	}

	/**
	 * Asserts that tree is not empty after node has been inserted.
	 */
	@Test
	public void treeNoEmptyAfterInsertion() {
		BinarySearchTreeViaArray<Long, Long> tree = new BinarySearchTreeViaArray<Long, Long>();
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
			BinarySearchTreeViaArray<Long, Long> tree = new BinarySearchTreeViaArray<Long, Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in-order
			DefaultNodeVisitorImpl<Long, Long> visitor = new DefaultNodeVisitorImpl<Long, Long>();
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
			BinarySearchTreeViaArray<Long, Long> tree = new BinarySearchTreeViaArray<Long, Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in pre-order fashion
			DefaultNodeVisitorImpl<Long, Long> visitor = new DefaultNodeVisitorImpl<Long, Long>();
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
			BinarySearchTreeViaArray<Long, Long> tree = new BinarySearchTreeViaArray<Long, Long>();
			
			// Insert the keys into the tree
			for (int i = 0; i < test_vector.m_keys_in.length; ++i) {
				tree.insert(test_vector.m_keys_in[i], null);
			}
			
			// Traverse the tree in post-order fashion
			DefaultNodeVisitorImpl<Long, Long> visitor = new DefaultNodeVisitorImpl<Long, Long>();
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
			BinarySearchTreeViaArray<Long, NodeData> tree = new BinarySearchTreeViaArray<Long, NodeData>();
			
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
}
