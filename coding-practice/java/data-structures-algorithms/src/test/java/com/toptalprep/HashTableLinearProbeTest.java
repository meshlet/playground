package com.toptalprep;

import static org.junit.Assert.*;

import org.junit.Test;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.OptionalInt;
import java.util.stream.IntStream;

/**
 * Unit tests for the HashTableLinearProbe class.
 */
public class HashTableLinearProbeTest {
	private class KeyValue<KeyT, ValueT> {
		KeyT m_key;
		ValueT m_value;
		
		public KeyValue(KeyT key, ValueT value) {
			m_key = key;
			m_value = value;
		}
	}
	
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
	 * Exercises the method that checks whether the table contains a specified key.
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
			assertEquals(test_vector.m_keys_to_insert.length, table.size());
			assertEquals(test_vector.m_keys_to_search_for.length, test_vector.m_expected_lookup_results.length);
			
			// Search for the specified keys
			for (int i = 0; i < test_vector.m_keys_to_search_for.length; ++i) {
				assertEquals(
						test_vector.m_expected_lookup_results[i],
						table.containsKey(test_vector.m_keys_to_search_for[i]));
			}
		}
	}
	
	/**
	 * Exercises the method that checks whether the table contains a specified value.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testContainsValueMethod() {
		class TestVector {
			Object[] m_mappings_to_insert;
			String[] m_values_to_search_for;
			boolean[] m_expected_lookup_results;
			
			public TestVector(
					Object[] mappings_to_insert,
					String[] values_to_search_for,
					boolean[] expected_lookup_results) {
				
				m_mappings_to_insert = mappings_to_insert;
				m_values_to_search_for = values_to_search_for;
				m_expected_lookup_results = expected_lookup_results;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new Object[] { },
						new String[] { "", "ab", "c", "auudfd", "tttafb" },
						new boolean[] { false, false, false, false, false }),
				
				new TestVector(
						new Object[] { new KeyValue<Integer, String>(0, "abc") },
						new String[] { "", "ab", "c", "abc", "7red", "abc", "abcd" },
						new boolean[] { false, false, false, true, false, true, false }),
				
				new TestVector(
						new Object[] {
								new KeyValue<Integer, String>(0, ""),
								new KeyValue<Integer, String>(4, "a"),
								new KeyValue<Integer, String>(-45, "abc"),
								new KeyValue<Integer, String>(5, ""),
								new KeyValue<Integer, String>(-1, "uiyed"),
								new KeyValue<Integer, String>(99, "78342")
						},
						new String[] { "1", "abcd", "", "uiyed", "78341", "ab", "abc", "cba" },
						new boolean[] { false, false, true, true, false, false, true, false }),
				
				new TestVector(
						new Object[] { new KeyValue<Integer, String>(0, null), },
						new String[] { null },
						new boolean[] { true })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
			
			// Insert the mappings into the table
			for (Object mapping : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> key_value = (KeyValue<Integer, String>) mapping;
				table.map(key_value.m_key, key_value.m_value);
			}
			
			// Sanity check
			assertEquals(test_vector.m_mappings_to_insert.length, table.size());
			assertEquals(test_vector.m_values_to_search_for.length, test_vector.m_expected_lookup_results.length);
			
			for (int i = 0; i < test_vector.m_values_to_search_for.length; ++i) {
				assertEquals(
						test_vector.m_expected_lookup_results[i],
						table.containsValue(test_vector.m_values_to_search_for[i]));
			}
		}
	}
	
	/**
	 * Exercises the find method used to locate the mapping with given key and
	 * return the value it's mapped to.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testFindMethod() {
		class TestVector {
			Object[] m_mappings_to_insert;
			int[] m_keys_to_search_for;
			String[] m_expected_values;
			
			public TestVector(Object[] mappings_to_insert, int[] keys_to_search_for, String[] expected_values) {
				m_mappings_to_insert = mappings_to_insert;
				m_keys_to_search_for = keys_to_search_for;
				m_expected_values = expected_values;
			}
		}

		TestVector[] test_vectors = {
				new TestVector(
						new Object[] { },
						new int[] { 0, -5, 12, -1, 50 },
						new String[] { null, null, null, null, null }),
				
				new TestVector(
						new Object[] {
								new KeyValue<Integer, String>(0, null),
								new KeyValue<Integer, String>(-4, "ABc"),
								new KeyValue<Integer, String>(1, "123"),
								new KeyValue<Integer, String>(-23, ""),
								new KeyValue<Integer, String>(10, "adfsDFcd"),
								new KeyValue<Integer, String>(8, null),
								new KeyValue<Integer, String>(75, "23afbdA"),
								new KeyValue<Integer, String>(999, "74AABCad")
						},
						new int[] { 999, 76, 0, 11, -4, 1, -22, 919, 8, -23, 0, 999, 1000, -23, 75 },
						new String[] {
								"74AABCad",
								null,
								null,
								null,
								"ABc",
								"123",
								null,
								null,
								null,
								"",
								null,
								"74AABCad",
								null,
								"",
								"23afbdA" })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
			
			// Insert the mappings into the table
			for (Object mapping : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> key_value = (KeyValue<Integer, String>) mapping;
				table.map(key_value.m_key, key_value.m_value);
			}
			
			// Sanity check
			assertEquals(test_vector.m_mappings_to_insert.length, table.size());
			assertEquals(test_vector.m_keys_to_search_for.length, test_vector.m_expected_values.length);
			
			for (int i = 0; i < test_vector.m_keys_to_search_for.length; ++i) {
				assertEquals(
						test_vector.m_expected_values[i],
						table.find(test_vector.m_keys_to_search_for[i]));
			}
		}
	}
	
	/**
	 * Exer the unmap method used to remove the mapping from the hash table.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testUnmapMethod() {
		class TestVector {
			List<Object> m_mappings_to_insert;
			int[] m_keys_to_unmap;
			
			public TestVector(List<Object> mappings_to_insert, int[] keys_to_unmap) {
				m_mappings_to_insert = mappings_to_insert;
				m_keys_to_unmap = keys_to_unmap;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { })),
						new int[] { 0, -1, 34, 345, -2, 4, 42, -2 }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { new KeyValue<Integer, String>(-10, "456") })),
						new int[] { 0, 34, 0, -9, -10, 8, 8, -10, 1 }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(456, "56MNB"),
								new KeyValue<Integer, String>(1, ",._J"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(12345, "BVN09"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(-7, "f;jklfsd"),
								new KeyValue<Integer, String>(100, "1v0fd")
						})),
						new int[] { 0, -1000, 90, 854, -2, 1, 0, 456, -5, 7, -7, 854, 12345, 90, 99 })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
			
			// Insert the mappings into the table
			for (Object mapping : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> key_value = (KeyValue<Integer, String>) mapping;
				table.map(key_value.m_key, key_value.m_value);
			}
			
			// Sanity check
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());
			
			// Unmap the specified keys from the hash table. Also remove these keys
			// from the reference list.
			for (int i = 0; i < test_vector.m_keys_to_unmap.length; ++i) {
				// Unmap the key from the hash table
				String removed_value = table.unmap(test_vector.m_keys_to_unmap[i]);
				
				// Get the index of the mapping with given key from the list
				int final_i = i;
				OptionalInt mapping_index = IntStream.range(0, test_vector.m_mappings_to_insert.size())
						.filter(
								index -> {
									return ((KeyValue<Integer, String>)
											test_vector.m_mappings_to_insert.get(index)).m_key.equals(
													test_vector.m_keys_to_unmap[final_i]);
								})
						.findFirst();
				
				if (mapping_index.isPresent()) {
					// Mapping with the given key is present in the list. Make sure its
					// value matches the value returned by hash table unmap method.
					KeyValue<Integer, String> ref_mapping =
							(KeyValue<Integer, String>) test_vector.m_mappings_to_insert.remove(mapping_index.getAsInt());
					
					assertEquals(ref_mapping.m_value, removed_value);
				}
				else {
					assertNull(removed_value);
				}
				
				// Assert that removed key is no longer present in the hash table
				assertFalse(table.containsKey(test_vector.m_keys_to_unmap[i]));
			}
			
			// Assert that list and table have the same size
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());
			
			// Verify that mappings present in the list are also present in the hash table
			for (Object obj : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> ref_mapping = (KeyValue<Integer, String>) obj;
				assertTrue(table.containsKey(ref_mapping.m_key));
				
				// Assert that values match
				assertEquals(ref_mapping.m_value, table.find(ref_mapping.m_key));
			}
		}
	}
	
	/**
	 * Exercises the unmap method that removes the mapping with the given key only
	 * if its value matches the specified value.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testUnmapWithValueComparisonMethod() {
		class TestVector {
			List<Object> m_mappings_to_insert;
			List<Object> m_mappings_to_remove;
			
			public TestVector(List<Object> mappings_to_insert, List<Object> mappings_to_remove) {
				m_mappings_to_insert = mappings_to_insert;
				m_mappings_to_remove = mappings_to_remove;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { })),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "abc"),
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(34, "DA"),
								new KeyValue<Integer, String>(345, null),
								new KeyValue<Integer, String>(-2, "asdfsd"),
								new KeyValue<Integer, String>(4, "abc"),
								new KeyValue<Integer, String>(42, "uyt"),
								new KeyValue<Integer, String>(-2, "uier")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { new KeyValue<Integer, String>(-10, "456") })),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "abc"),
								new KeyValue<Integer, String>(34, "876"),
								new KeyValue<Integer, String>(0, "adcd"),
								new KeyValue<Integer, String>(-9, ""),
								new KeyValue<Integer, String>(-10, null),
								new KeyValue<Integer, String>(8, "tyu"),
								new KeyValue<Integer, String>(8, "iew"),
								new KeyValue<Integer, String>(-10, "456"),
								new KeyValue<Integer, String>(1, "askfjsd")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(456, "56MNB"),
								new KeyValue<Integer, String>(1, ",._J"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(12345, "BVN09"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(-7, "f;jklfsd"),
								new KeyValue<Integer, String>(100, null)
						})),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "Abcd"),
								new KeyValue<Integer, String>(-1000, ""),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(-2, "adfds"),
								new KeyValue<Integer, String>(1, ",._J"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(456, "dfa"),
								new KeyValue<Integer, String>(-5, "AB"),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(-7, "sdfds"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(12345, "kjdfa32"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(99, "23L")
						}))
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
			
			// Insert the mappings into the table
			for (Object mapping : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> key_value = (KeyValue<Integer, String>) mapping;
				table.map(key_value.m_key, key_value.m_value);
			}
			
			// Sanity check
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());
			
			// Unmap the specified keys from the hash table. Also remove these keys
			// from the reference list.
			for (int i = 0; i < test_vector.m_mappings_to_remove.size(); ++i) {
				// Unmap the key from the hash table
				KeyValue<Integer, String> mapping_to_remove =
						(KeyValue<Integer, String>) test_vector.m_mappings_to_remove.get(i);
				
				boolean mapping_removed = table.unmap(mapping_to_remove.m_key, mapping_to_remove.m_value);
				
				// Get the index of the mapping with given key and value from the list
				OptionalInt mapping_index = IntStream.range(0, test_vector.m_mappings_to_insert.size())
						.filter(
								index -> {
									KeyValue<Integer, String> key_value =
											(KeyValue<Integer, String>) test_vector.m_mappings_to_insert.get(index);
									
									return
											key_value.m_key.equals(mapping_to_remove.m_key) &&
											key_value.m_value.equals(mapping_to_remove.m_value);
								})
						.findFirst();
				
				// If the given mapping is present in the list the hash table
				// unmap method must've returned true, otherwise it must've
				// returned false.
				assertEquals(mapping_index.isPresent(), mapping_removed);
				
				if (mapping_index.isPresent()) {
					// Remove the mapping from the list
					test_vector.m_mappings_to_insert.remove(mapping_index.getAsInt());
				}
				
				if (mapping_removed) {
					// Assert that removed key is no longer present in the hash table
					assertFalse(table.containsKey(mapping_to_remove.m_key));
				}
			}
			
			// Assert that list and table have the same size
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());
			
			// Verify that mappings present in the list are also present in the hash table
			for (Object obj : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> ref_mapping = (KeyValue<Integer, String>) obj;
				assertTrue(table.containsKey(ref_mapping.m_key));
				
				// Assert that values match
				assertEquals(ref_mapping.m_value, table.find(ref_mapping.m_key));
			}
		}
	}
	
	/**
	 * Exercises the method that remaps the given key to a new value, if the
	 * key is already mapped in the table.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testRemapMethod() {
		class TestVector {
			List<Object> m_mappings_to_insert;
			List<Object> m_mappings_to_update;
			
			public TestVector(List<Object> mappings_to_insert, List<Object> mappings_to_update) {
				m_mappings_to_insert = mappings_to_insert;
				m_mappings_to_update = mappings_to_update;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { })),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "abc"),
								new KeyValue<Integer, String>(-10, "45A"),
								new KeyValue<Integer, String>(9, "12TU"),
								new KeyValue<Integer, String>(100, "fdsf")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-90, "ABC123")
						})),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "ABC"),
								new KeyValue<Integer, String>(74, "UA"),
								new KeyValue<Integer, String>(-90, "87AFB"),
								new KeyValue<Integer, String>(100, ",.d"),
								new KeyValue<Integer, String>(-90, "OIU")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, "ABC"),
								new KeyValue<Integer, String>(4, "8nm"),
								new KeyValue<Integer, String>(-34, "TYU"),
								new KeyValue<Integer, String>(-12, "987"),
								new KeyValue<Integer, String>(198, "hgjf"),
								new KeyValue<Integer, String>(9, "sdfa"),
								new KeyValue<Integer, String>(3, "vm"),
								new KeyValue<Integer, String>(71, "ASDF"),
								new KeyValue<Integer, String>(0, "p"),
								new KeyValue<Integer, String>(-100, "afbcdsfsdfd")
						})),
						Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(0, "soc"),
								new KeyValue<Integer, String>(74, "UA"),
								new KeyValue<Integer, String>(3, "87AFB"),
								new KeyValue<Integer, String>(-100, ",.d"),
								new KeyValue<Integer, String>(-90, "OIU"),
								new KeyValue<Integer, String>(4, "usha"),
								new KeyValue<Integer, String>(198, "bla"),
								new KeyValue<Integer, String>(4, "9nm"),
								new KeyValue<Integer, String>(-12, "hgjf"),
								new KeyValue<Integer, String>(-1, "push")
						})),
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();

			// Insert the mappings into the table
			for (Object mapping : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> key_value = (KeyValue<Integer, String>) mapping;
				table.map(key_value.m_key, key_value.m_value);
			}

			// Sanity check
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());
			
			// Remap the keys
			for (Object obj : test_vector.m_mappings_to_update) {
				KeyValue<Integer, String> mapping_to_update = (KeyValue<Integer, String>) obj;
				
				// Remap the key to the new value
				String previous_value = table.remap(mapping_to_update.m_key, mapping_to_update.m_value);
				
				OptionalInt mapping_index = IntStream.range(0, test_vector.m_mappings_to_insert.size())
						.filter(
								index -> {
									return ((KeyValue<Integer, String>)
											test_vector.m_mappings_to_insert.get(index)).m_key.equals(
													mapping_to_update.m_key);
								})
						.findFirst();
				
				if (mapping_index.isPresent()) {
					// Mapping with the given key is present in the list. Make sure its
					// value matches the value returned by hash table remap method.
					KeyValue<Integer, String> ref_mapping =
							(KeyValue<Integer, String>) test_vector.m_mappings_to_insert.get(mapping_index.getAsInt());
					
					assertEquals(ref_mapping.m_value, previous_value);
					
					// Update the value of the mapping in the list
					ref_mapping.m_value = mapping_to_update.m_value;
				}
				else {
					assertNull(previous_value);
				}
			}
			
			// Assert that list and table have the same size
			assertEquals(test_vector.m_mappings_to_insert.size(), table.size());

			// Verify that mappings present in the list are also present in the hash table
			for (Object obj : test_vector.m_mappings_to_insert) {
				KeyValue<Integer, String> ref_mapping = (KeyValue<Integer, String>) obj;
				assertTrue(table.containsKey(ref_mapping.m_key));

				// Assert that values match
				assertEquals(ref_mapping.m_value, table.find(ref_mapping.m_key));
			}
		}
	}
	
	// TODO: Add following tests:
	// - test that maps the same key multiple times
	// - test that causes map to resize
	// - test where new mappings are placed in array cells containing deleted mappings
	// - test that maps a null key (possibly multiple times)
}
