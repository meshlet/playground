package com.toptalprep;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * Unit tests for the HashTableLinearProbe class.
 */
public class HashTableLinearProbeTest {
	/**
	 * Asserts that the empty flag is true upon table creation.
	 */
	@Test
	public void emptyFlagIsTrueInNewTable() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is false in a non-empty table.
	 */
	@Test
	public void emptyFlagIsFalseInNonEmptyTable() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		assertFalse(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is true after last key is unmapped from the table.
	 */
	@Test
	public void emptyFlagIsTrueAfterTableBecomesEmpty() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.unmap(5);
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the size is 0 upon creation.
	 */
	@Test
	public void sizeIsZeroUponCreation() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the size is correct after mapping a key.
	 */
	@Test
	public void sizeIsOneAfterMappingKey() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		assertEquals(1, table.size());
	}
	
	/**
	 * Asserts that the size is zero after last key is unmapped from the table.
	 */
	@Test
	public void sizeIsZeroAfterTableBecomesEmpty() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.unmap(5);
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the empty flag and size are correctly reset when table is cleared.
	 */
	@Test
	public void emptyFlagFalseSizeZeroAfterTableIsCleared() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.clear();
		assertTrue(table.isEmpty());
		assertEquals(0, table.size());
	}
	
	/**
	 * Exercises the method that checks whether a specified key is present in the table.
	 */
	@Test
	public void testContainsKeyMethod() {
		class TestVector {
			int[] m_keys_to_insert;
			int[] m_keys_to_search_for;
			boolean[] m_expected_lookup_results;
			
			public TestVector(int[] keys_to_insert, int[] keys_to_search_for, boolean[] expected_lookup_results) {
				m_keys_to_insert = keys_to_insert;
				m_keys_to_search_for = keys_to_search_for;
				m_expected_lookup_results = expected_lookup_results;
			}
		}
		
		TestVector test_vectors[] = {
			new TestVector(
					new int[] { 1, 0, -5, -100, 5, 6, 34 },
					new int[] { -5, 2, -101, 100, 5, 5, 0, -34, -100 },
					new boolean[] { true, false, false, false, true, true, true, false, true }),
			
			new TestVector(
					new int[] { },
					new int[] { 5, -10, 5, 67, -94 },
					new boolean[] { false, false, false, false, false }),
			
			new TestVector(
					new int[] { -10 },
					new int[] { 0, 5, 50, -15, -10, 0, 765, -34, 35, -10 },
					new boolean[] { false, false, false, false, true, false, false, false, false, true }),
			
			new TestVector(
					new int[] { -3, -2, -1, 0, 1, 2, 3 },
					new int[] { 0, 4, -4, 1, -1, 10, -2, 3, 5, -5, -20 },
					new boolean[] { true, false, false, true, true, false, true, true, false, false, false })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
			
			// Map the keys
			for (int i = 0; i < test_vector.m_keys_to_insert.length; ++i) {
				table.map(test_vector.m_keys_to_insert[i], null);
			}
			
			// Sanity check
			assertEquals(test_vector.m_keys_to_search_for.length, test_vector.m_expected_lookup_results.length);
			
			// Search for the specified keys
			for (int i = 0; i < test_vector.m_keys_to_search_for.length; ++i) {
				assertEquals(
						test_vector.m_expected_lookup_results[i],
						table.containsKey(test_vector.m_keys_to_search_for[i]));
			}
		}
	}
}
