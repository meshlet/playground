package com.toptalprep;

import static org.junit.Assert.*;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.OptionalInt;
import java.util.stream.IntStream;

/**
 * Unit tests for the various implementations of the HashTable interface.
 */
@RunWith(value = Parameterized.class)
public class HashTableTest {
	/**
	 * Lists all HashTable interface implementations.
	 */
	enum HashTableImplementation {
		HASH_TABLE_LINEAR_PROBE,
		HASH_TABLE_QUADRATIC_PROBE,
		HASH_TABLE_DOUBLE_HASHING,
		HASH_TABLE_SEPARATE_CHAINING
	}
	
	/**
	 * Returns a collection containing an enum  value for each HashTable
	 * implementation.
	 */
	@SuppressWarnings("rawtypes")
	@Parameters
	public static Collection getHashTableImplementationEnums() {
		Object[][] implementation_enums = new Object[HashTableImplementation.values().length][1];
		for (int i = 0; i < HashTableImplementation.values().length; ++i) {
			implementation_enums[i][0] = HashTableImplementation.values()[i];
		}
		return Arrays.asList(implementation_enums);
	}
	
	/**
	 * The HashTable implementation tested by current test fixture.
	 */
	private HashTableImplementation m_implementation;
	
	/**
	 * Initializes the test fixture.
	 *
	 * @param implementation  The HashTable implementation to be tested.
	 */
	public HashTableTest(HashTableImplementation implementation) {
		m_implementation = implementation;
	}
	
	/**
	 * Create a new HashTable instance whose type is determined by the value
	 * of m_implementation member.
	 */
	private <KeyT, ValueT> HashTable<KeyT, ValueT> newHashTableInstance() {
		switch (m_implementation) {
		case HASH_TABLE_LINEAR_PROBE:
			return new HashTableLinearProbe<KeyT, ValueT>();
			
		case HASH_TABLE_QUADRATIC_PROBE:
			return new HashTableQuadraticProbe<KeyT, ValueT>();
		
		case HASH_TABLE_DOUBLE_HASHING:
			return new HashTableDoubleHashing<KeyT, ValueT>();
		
		case HASH_TABLE_SEPARATE_CHAINING:
			return new HashTableSeparateChaining<KeyT, ValueT>();
			
		default:
			assertTrue("Unknown hash table implementation", false);
			return null;
		}
	}
	
	/**
	 * Create a new HashTable instance whose type is determined by the value
	 * of m_implementation member.
	 */
	private <KeyT, ValueT> HashTable<KeyT, ValueT> newHashTableInstance(int initial_capacity) {
		switch (m_implementation) {
		case HASH_TABLE_LINEAR_PROBE:
			return new HashTableLinearProbe<KeyT, ValueT>(initial_capacity);
			
		case HASH_TABLE_QUADRATIC_PROBE:
			return new HashTableQuadraticProbe<KeyT, ValueT>(initial_capacity);
		
		case HASH_TABLE_DOUBLE_HASHING:
			return new HashTableDoubleHashing<KeyT, ValueT>(initial_capacity);
			
		case HASH_TABLE_SEPARATE_CHAINING:
			return new HashTableSeparateChaining<KeyT, ValueT>(initial_capacity);
			
		default:
			assertTrue("Unknown hash table implementation", false);
			return null;
		}
	}
	
	/**
	 * Create a new HashTable instance whose type is determined by the value
	 * of m_implementation member.
	 */
	private <KeyT, ValueT> HashTable<KeyT, ValueT> newHashTableInstance(
			int initial_capacity, float load_factor) {
		switch (m_implementation) {
		case HASH_TABLE_LINEAR_PROBE:
			return new HashTableLinearProbe<KeyT, ValueT>(initial_capacity, load_factor);
			
		case HASH_TABLE_QUADRATIC_PROBE:
			return new HashTableQuadraticProbe<KeyT, ValueT>(initial_capacity, load_factor);
		
		case HASH_TABLE_DOUBLE_HASHING:
			return new HashTableDoubleHashing<KeyT, ValueT>(initial_capacity, load_factor);
			
		case HASH_TABLE_SEPARATE_CHAINING:
			return new HashTableSeparateChaining<KeyT, ValueT>(initial_capacity, load_factor);
			
		default:
			assertTrue("Unknown hash table implementation", false);
			return null;
		}
	}
	
	private class KeyValue<KeyT, ValueT> {
		KeyT m_key;
		ValueT m_value;
		
		public KeyValue(KeyT key, ValueT value) {
			m_key = key;
			m_value = value;
		}
	}
	
	/**
	 * Tests that exception is thrown when hash table is created with 0 initial capacity.
	 */
	@Test(expected = IllegalArgumentException.class)
	@SuppressWarnings("unused")
	public void createTableWithZeroInitialCapacity() {
		HashTable<Integer, String> table = newHashTableInstance(0);
	}
	
	/**
	 * Tests that exception is thrown when hash table is created with negative initial capacity.
	 */
	@Test(expected = IllegalArgumentException.class)
	@SuppressWarnings("unused")
	public void createTableWithNegativeInitialCapacity() {
		HashTable<Integer, String> table = newHashTableInstance(-10);
	}
	
	/**
	 * Tests that exception is thrown when hash table is created with 0 initial capacity and load
	 * factor set to 1.0f.
	 */
	@Test(expected = IllegalArgumentException.class)
	@SuppressWarnings("unused")
	public void createTableWithZeroInitialCapacityAndLoadFactorSetToOne() {
		HashTable<Integer, String> table = newHashTableInstance(0, 1.0f);
	}
	
	/**
	 * Tests that exception is thrown when hash table is created with negative initial capacity
	 * and load factor set to 1.0f.
	 */
	@Test(expected = IllegalArgumentException.class)
	@SuppressWarnings("unused")
	public void createTableWithNegativeInitialCapacityAndLoadFactorSetToOne() {
		HashTable<Integer, String> table = newHashTableInstance(-10, 1.0f);
	}
	
	/**
	 * Tests that exception is thrown when hash table is created with positive initial capacity and
	 * negative load factor.
	 */
	@Test(expected = IllegalArgumentException.class)
	@SuppressWarnings("unused")
	public void createTableWithPositiveInitialCapacityAndNegativeLoadFactor() {
		HashTable<Integer, String> table = newHashTableInstance(10, -0.5f);
	}
	
	/**
	 * Asserts that the empty flag is true upon table creation.
	 */
	@Test
	public void emptyFlagIsTrueInNewTable() {
		HashTable<Integer, String> table = newHashTableInstance();
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is false in a non-empty table.
	 */
	@Test
	public void emptyFlagIsFalseInNonEmptyTable() {
		HashTable<Integer, String> table = newHashTableInstance();
		table.map(5, "A");
		assertFalse(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is true after last key is unmapped from the table.
	 */
	@Test
	public void emptyFlagIsTrueAfterTableBecomesEmpty() {
		HashTable<Integer, String> table = newHashTableInstance();
		table.map(5, "A");
		table.unmap(5);
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the size is 0 upon creation.
	 */
	@Test
	public void sizeIsZeroUponCreation() {
		HashTable<Integer, String> table = newHashTableInstance();
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the size is correct after mapping a key.
	 */
	@Test
	public void sizeIsOneAfterMappingKey() {
		HashTable<Integer, String> table = newHashTableInstance();
		table.map(5, "A");
		assertEquals(1, table.size());
	}
	
	/**
	 * Asserts that the size is zero after last key is unmapped from the table.
	 */
	@Test
	public void sizeIsZeroAfterTableBecomesEmpty() {
		HashTable<Integer, String> table = newHashTableInstance();
		table.map(5, "A");
		table.unmap(5);
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the empty flag and size are correctly reset when table is cleared.
	 */
	@Test
	public void emptyFlagFalseSizeZeroAfterTableIsCleared() {
		HashTable<Integer, String> table = newHashTableInstance();
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
			Integer[] m_keys_to_insert;
			Integer[] m_keys_to_search_for;
			boolean[] m_expected_lookup_results;
			
			public TestVector(Integer[] keys_to_insert, Integer[] keys_to_search_for, boolean[] expected_lookup_results) {
				m_keys_to_insert = keys_to_insert;
				m_keys_to_search_for = keys_to_search_for;
				m_expected_lookup_results = expected_lookup_results;
			}
		}
		
		TestVector test_vectors[] = {
			new TestVector(
					new Integer[] { 1, 0, -5, -100, 5, null, 6, 34 },
					new Integer[] { -5, 2, -101, 100, 5, 5, 0, null, -34, -100 },
					new boolean[] { true, false, false, false, true, true, true, true, false, true }),
			
			new TestVector(
					new Integer[] { },
					new Integer[] { 5, -10, 5, 67, null, -94 },
					new boolean[] { false, false, false, false, false, false }),
			
			new TestVector(
					new Integer[] { -10 },
					new Integer[] { 0, 5, 50, -15, -10, null, 0, 765, -34, 35, -10 },
					new boolean[] { false, false, false, false, true, false, false, false, false, false, true }),
			
			new TestVector(
					new Integer[] { -3, -2, -1, 0, null, 1, 2, 3 },
					new Integer[] { 0, 4, -4, 1, -1, 10, -2, null, 3, 5, -5, -20 },
					new boolean[] { true, false, false, true, true, false, true, true, true, false, false, false }),
			
			new TestVector(
					new Integer[] { null, -3, 50, 12, 100, -100 },
					new Integer[] { 1, 12, -13, -100, null, 50, -3, 897, -32 },
					new boolean[] { false, true, false, true, true, true, true, false, false })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table = newHashTableInstance();
			
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
						new String[] { "", "ab", "c", "auudfd", null, "tttafb" },
						new boolean[] { false, false, false, false, false, false }),
				
				new TestVector(
						new Object[] { new KeyValue<Integer, String>(0, "abc") },
						new String[] { "", "ab", "c", "abc", "7red", "abc", "abcd", null },
						new boolean[] { false, false, false, true, false, true, false, false }),
				
				new TestVector(
						new Object[] {
								new KeyValue<Integer, String>(null, "habla"),
								new KeyValue<Integer, String>(0, ""),
								new KeyValue<Integer, String>(4, "a"),
								new KeyValue<Integer, String>(-45, "abc"),
								new KeyValue<Integer, String>(5, ""),
								new KeyValue<Integer, String>(-1, "uiyed"),
								new KeyValue<Integer, String>(99, "78342")
						},
						new String[] { "1", "abcd", "", "uiyed", "78341", "ab", "abc", "cba", "habla" },
						new boolean[] { false, false, true, true, false, false, true, false, true }),
				
				new TestVector(
						new Object[] { new KeyValue<Integer, String>(null, null), },
						new String[] { null },
						new boolean[] { true })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table = newHashTableInstance();
			
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
			Integer[] m_keys_to_search_for;
			String[] m_expected_values;
			
			public TestVector(Object[] mappings_to_insert, Integer[] keys_to_search_for, String[] expected_values) {
				m_mappings_to_insert = mappings_to_insert;
				m_keys_to_search_for = keys_to_search_for;
				m_expected_values = expected_values;
			}
		}

		TestVector[] test_vectors = {
				new TestVector(
						new Object[] { },
						new Integer[] { 0, -5, null, 12, -1, 50 },
						new String[] { null, null, null, null, null, null }),
				
				new TestVector(
						new Object[] {
								new KeyValue<Integer, String>(0, null),
								new KeyValue<Integer, String>(-4, "ABc"),
								new KeyValue<Integer, String>(1, "123"),
								new KeyValue<Integer, String>(null, "wbo"),
								new KeyValue<Integer, String>(-23, ""),
								new KeyValue<Integer, String>(10, "adfsDFcd"),
								new KeyValue<Integer, String>(8, null),
								new KeyValue<Integer, String>(75, "23afbdA"),
								new KeyValue<Integer, String>(999, "74AABCad")
						},
						new Integer[] { 999, 76, 0, 11, null, -4, 1, -22, 919, 8, -23, 0, 999, 1000, -23, 75 },
						new String[] {
								"74AABCad",
								null,
								null,
								null,
								"wbo",
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
			HashTable<Integer, String> table = newHashTableInstance();
			
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
			Integer[] m_keys_to_unmap;
			
			public TestVector(List<Object> mappings_to_insert, Integer[] keys_to_unmap) {
				m_mappings_to_insert = mappings_to_insert;
				m_keys_to_unmap = keys_to_unmap;
			}
		}
		
		TestVector[] test_vectors = {
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { })),
						new Integer[] { 0, -1, 34, 345, null, -2, 4, null, 42, -2 }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { new KeyValue<Integer, String>(-10, "456") })),
						new Integer[] { 0, 34, 0, -9, -10, 8, 8, -10, 1 }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] { new KeyValue<Integer, String>(null, "a") })),
						new Integer[] { 0, 34, 49, null, -10, 1, null }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(456, "56MNB"),
								new KeyValue<Integer, String>(1, ",._J"),
								new KeyValue<Integer, String>(null, "uyt"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(12345, "BVN09"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(-7, "f;jklfsd"),
								new KeyValue<Integer, String>(100, "1v0fd")
						})),
						new Integer[] { 0, -1000, 90, null, 854, -2, 1, 0, 456, -5, null, 7, -7, 854, 12345, 90, 99 }),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-3, "A"),
								new KeyValue<Integer, String>(null, null),
								new KeyValue<Integer, String>(10, "B"),
								new KeyValue<Integer, String>(-5, "C"),
								new KeyValue<Integer, String>(11, "D"),
								new KeyValue<Integer, String>(75, "E"),
								new KeyValue<Integer, String>(-7, "F")
						})),
						new Integer[] { -7, 75, 11, -5, 10, null, -3 })
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table = newHashTableInstance();
			
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
									KeyValue<Integer, String> mapping =
											(KeyValue<Integer, String>) test_vector.m_mappings_to_insert.get(index);
									
									return mapping.m_key != null ?
											mapping.m_key.equals(test_vector.m_keys_to_unmap[final_i]) :
											test_vector.m_keys_to_unmap[final_i] == null;
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
								new KeyValue<Integer, String>(null, "uma"),
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
								new KeyValue<Integer, String>(null, "uma"),
								new KeyValue<Integer, String>(1, "askfjsd")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(null, "uma"),
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
								new KeyValue<Integer, String>(null, "hupa"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(456, "dfa"),
								new KeyValue<Integer, String>(-5, "AB"),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(-7, "sdfds"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(12345, "kjdfa32"),
								new KeyValue<Integer, String>(null, "uma"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(99, "23L"),
								new KeyValue<Integer, String>(100, null)
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, ""),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(null, "uma"),
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
								new KeyValue<Integer, String>(100, null),
								new KeyValue<Integer, String>(-7, "f;jklfsd"),
								new KeyValue<Integer, String>(854, "32cvb"),
								new KeyValue<Integer, String>(12345, "BVN09"),
								new KeyValue<Integer, String>(90, "TRY"),
								new KeyValue<Integer, String>(1, ",._J"),
								new KeyValue<Integer, String>(456, "56MNB"),
								new KeyValue<Integer, String>(0, "abcD"),
								new KeyValue<Integer, String>(null, "uma"),
								new KeyValue<Integer, String>(7, "AB"),
								new KeyValue<Integer, String>(-1, "")
						}))
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table = newHashTableInstance();
			
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
									
									boolean keys_equal = key_value.m_key != null ?
											key_value.m_key.equals(mapping_to_remove.m_key) :
											mapping_to_remove.m_key == null;
									
									if (keys_equal) {
										return key_value.m_value != null ?
												key_value.m_value.equals(mapping_to_remove.m_value) :
												mapping_to_remove.m_value == null;
									}
									return false;
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
								new KeyValue<Integer, String>(null, "uma"),
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
								new KeyValue<Integer, String>(null, "uma"),
								new KeyValue<Integer, String>(-90, "OIU")
						})),
				
				new TestVector(
						new ArrayList<Object>(Arrays.asList(new Object[] {
								new KeyValue<Integer, String>(-1, "ABC"),
								new KeyValue<Integer, String>(4, "8nm"),
								new KeyValue<Integer, String>(-34, "TYU"),
								new KeyValue<Integer, String>(-12, "987"),
								new KeyValue<Integer, String>(null, "uma"),
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
								new KeyValue<Integer, String>(null, "hablo"),
								new KeyValue<Integer, String>(4, "usha"),
								new KeyValue<Integer, String>(198, "bla"),
								new KeyValue<Integer, String>(4, "9nm"),
								new KeyValue<Integer, String>(-12, "hgjf"),
								new KeyValue<Integer, String>(-1, "push"),
								new KeyValue<Integer, String>(null, "pop")
						})),
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table = newHashTableInstance();

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
									KeyValue<Integer, String> mapping =
											(KeyValue<Integer, String>) test_vector.m_mappings_to_insert.get(index);
									
									return mapping.m_key != null ?
											mapping.m_key.equals(mapping_to_update.m_key) :
											mapping_to_update.m_key == null;
											
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
	
	/**
	 * Asserts that mapping a key that already exists in the table doesn't
	 * create a new entry in the hash table. Also asserts that the existing
	 * table mapping is updated with the new value.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void mapDuplicateKeys() {
		HashTable<Integer, String> table = newHashTableInstance();
		
		// Mappings to insert into the table
		List<Object> mappings_to_insert =
				Arrays.asList(new Object[] {
						new KeyValue<Integer, String>(-2, "ABC"),
						new KeyValue<Integer, String>(0, "dfg09"),
						new KeyValue<Integer, String>(-10, "MNN"),
						new KeyValue<Integer, String>(8, "yut"),
						new KeyValue<Integer, String>(90, "cvb913"),
						new KeyValue<Integer, String>(null, "uma")
				});
		
		// Populate the table
		for (Object obj : mappings_to_insert) {
			KeyValue<Integer, String> mapping = (KeyValue<Integer, String>) obj;
			table.map(mapping.m_key, mapping.m_value);
		}
		
		// Assert that table size is as expected
		assertEquals(mappings_to_insert.size(), table.size());
		
		// List of values that that keys in 'mappings_to_insert' list
		// should be re-mapped to.
		String[] new_values = new String[] {
				"987", "ghj10", "1fh", "poi", "rui", "pop"
		};
		
		// Sanity check
		assertEquals(mappings_to_insert.size(), new_values.length);
		
		// Map the existing keys to new values
		for (int i = 0; i < new_values.length; ++i) {
			Integer key = ((KeyValue<Integer, String>) mappings_to_insert.get(i)).m_key;
			table.map(key, new_values[i]);
			
			// Assert that key is now mapped to the new value
			String remapped_value = table.find(key);
			assertEquals(new_values[i], remapped_value);
		}
		
		// Assert that the hash table size didn't change (no new keys
		// were mapped)
		assertEquals(mappings_to_insert.size(), table.size());
	}
	
	/**
	 * Maps distinct keys (for which equals() returns false) that have the same hash
	 * value (hashCode() returns the same value for both keys). The hash table must
	 * differentiate between such keys, as equals()/hashCode() contract doesn't
	 * require for distinct objects to have different hashes (it only requires that
	 * equal objects have the same hash).
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void mapDistinctKeysWithIdenticalHash() {
		/**
		 * A helper class where user can provide the hash code to be
		 * returned by its hashCode() method as well as the data that
		 * represents the instance.
		 */
		class KeyClass {
			int m_hashcode;
			String m_data;
			
			public KeyClass(int hashcode, String data) {
				m_hashcode = hashcode;
				m_data = data;
			}
			
			@Override
			public boolean equals(Object obj) {
				if (this == obj) {
					return true;
				}
				
				if (obj instanceof KeyClass) {
					KeyClass instance = (KeyClass) obj;
					return m_data.equals(instance.m_data);
				}
				
				return false;
			}
			
			@Override
			public  int hashCode() {
				return m_hashcode;
			}
		}
		
		class TestVector {
			Object[] m_mappings_to_insert;
			KeyClass[] m_keys_to_find;
			Integer[] m_reference_values;
			
			public TestVector(Object[] mappings_to_insert, KeyClass[] keys_to_find, Integer[] reference_values) {
				m_mappings_to_insert = mappings_to_insert;
				m_keys_to_find = keys_to_find;
				m_reference_values = reference_values;
			}
		}
		
		TestVector test_vector = new TestVector(
				new Object[] {
						new KeyValue<KeyClass, Integer>(new KeyClass(0, "ABC"), 5),
						new KeyValue<KeyClass, Integer>(new KeyClass(10, "8679"), 10),
						new KeyValue<KeyClass, Integer>(new KeyClass(-30, "anmh"), 91),
						new KeyValue<KeyClass, Integer>(new KeyClass(10, "9999"), 1276),
						new KeyValue<KeyClass, Integer>(new KeyClass(-30, "anmh"), 1987),
						new KeyValue<KeyClass, Integer>(new KeyClass(-100, "blabla"), 9000),
						new KeyValue<KeyClass, Integer>(new KeyClass(0, "tutu"), 1276),
						new KeyValue<KeyClass, Integer>(new KeyClass(63, "op56"), 7),
						new KeyValue<KeyClass, Integer>(new KeyClass(10, "9999"), 710),
						new KeyValue<KeyClass, Integer>(new KeyClass(76, "gfx"), 887),
						new KeyValue<KeyClass, Integer>(new KeyClass(63, "0ui"), 70),
						new KeyValue<KeyClass, Integer>(new KeyClass(76, "gfx"), 900)
				},
				
				new KeyClass[] {
						new KeyClass(-30, "anmh"),
						new KeyClass(10, "9999"),
						new KeyClass(64, "9afb"),
						new KeyClass(0, "ABC"),
						new KeyClass(10, "8679"),
						new KeyClass(76, "jgh"),
						new KeyClass(63, "0ui"),
						new KeyClass(63, "op56"),
						new KeyClass(-30, "xcvb"),
						new KeyClass(0, "tutu"),
						new KeyClass(76, "gfx")
				},
				
				new Integer[] { 1987, 710, null, 5, 10, null, 70, 7, null, 1276, 900 });
		
		// Insert the mappings into the table. The following loop will also create
		// a list of all distinct keys inserted in the table.
		HashTable<KeyClass, Integer> table = newHashTableInstance();
		ArrayList<KeyClass> distinct_keys = new ArrayList<KeyClass>();
		for (Object obj : test_vector.m_mappings_to_insert) {
			KeyValue<KeyClass, Integer> mapping = (KeyValue<KeyClass, Integer>) obj;
			table.map(mapping.m_key, mapping.m_value);
			
			if (!distinct_keys.contains(mapping.m_key)) {
				distinct_keys.add(mapping.m_key);
			}
		}
		
		// Assert that all distinct keys have been inserted to the table
		assertEquals(distinct_keys.size(), table.size());
		
		// Sanity check
		assertEquals(test_vector.m_keys_to_find.length, test_vector.m_reference_values.length);
		
		for (int i = 0; i < test_vector.m_keys_to_find.length; ++i) {
			Integer value = table.find(test_vector.m_keys_to_find[i]);
			assertEquals(test_vector.m_reference_values[i], value);
		}
	}
	
	/**
	 * Exercises the hash table resize functionality by mapping enough keys so
	 * that table occupancy will reach the given load factor, at which point
	 * the table should resize.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void testHashTableResize() {
		class TestVector {
			int m_initial_capacity;
			float m_load_factor;
			Object[] m_mappings;
			
			public TestVector(int initial_capacity, float load_factor, Object[] mappings) {
				m_initial_capacity = initial_capacity;
				m_load_factor = load_factor;
				m_mappings = mappings;
			}
		}
		
		TestVector[] test_vectors = {
				// Hash table should resize when occupancy reaches 50%
				new TestVector(
						3,
						0.5f,
						new Object[] {
								new KeyValue<Integer, String>(-9, "ABC"),
								new KeyValue<Integer, String>(0, "-_+="),
								new KeyValue<Integer, String>(-100, "bla"),
								new KeyValue<Integer, String>(2, "klafls"),
								new KeyValue<Integer, String>(7, "cm,x"),
								new KeyValue<Integer, String>(5, "uit"),
								new KeyValue<Integer, String>(75, "n,b"),
								new KeyValue<Integer, String>(4, "567"),
								new KeyValue<Integer, String>(11, "ghj"),
								new KeyValue<Integer, String>(12, "qop"),
								new KeyValue<Integer, String>(21, "rop"),
								new KeyValue<Integer, String>(33, "wop"),
								new KeyValue<Integer, String>(56, "xp_"),
								new KeyValue<Integer, String>(-11, "jojo"),
								new KeyValue<Integer, String>(-20, "toto"),
								new KeyValue<Integer, String>(-50, "21314"),
								new KeyValue<Integer, String>(45, "gsdf"),
								new KeyValue<Integer, String>(-4, "pry"),
								new KeyValue<Integer, String>(1000, "zxc"),
								new KeyValue<Integer, String>(2000, "{}")
						}),
				
				// Hash table should resize each time a new key is inserted
				new TestVector(
						5,
						0.0f,
						new Object[] {
								new KeyValue<Integer, String>(-9, "ABC"),
								new KeyValue<Integer, String>(0, "-_+="),
								new KeyValue<Integer, String>(-100, "bla"),
								new KeyValue<Integer, String>(2, "klafls"),
								new KeyValue<Integer, String>(7, "cm,x"),
								new KeyValue<Integer, String>(5, "uit"),
								new KeyValue<Integer, String>(75, "n,b"),
								new KeyValue<Integer, String>(4, "567"),
								new KeyValue<Integer, String>(11, "ghj"),
								new KeyValue<Integer, String>(12, "qop"),
								new KeyValue<Integer, String>(21, "rop"),
								new KeyValue<Integer, String>(33, "wop"),
								new KeyValue<Integer, String>(56, "xp_"),
								new KeyValue<Integer, String>(-11, "jojo"),
								new KeyValue<Integer, String>(-20, "toto"),
								new KeyValue<Integer, String>(-50, "21314"),
								new KeyValue<Integer, String>(45, "gsdf"),
								new KeyValue<Integer, String>(-4, "pry"),
								new KeyValue<Integer, String>(1000, "zxc"),
								new KeyValue<Integer, String>(2000, "{}")
						}),
				
				// Hash table should resize only once it gets completely full
				new TestVector(
						5,
						1.0f,
						new Object[] {
								new KeyValue<Integer, String>(-9, "ABC"),
								new KeyValue<Integer, String>(0, "-_+="),
								new KeyValue<Integer, String>(-100, "bla"),
								new KeyValue<Integer, String>(2, "klafls"),
								new KeyValue<Integer, String>(7, "cm,x"),
								new KeyValue<Integer, String>(5, "uit"),
								new KeyValue<Integer, String>(75, "n,b"),
								new KeyValue<Integer, String>(4, "567"),
								new KeyValue<Integer, String>(11, "ghj"),
								new KeyValue<Integer, String>(12, "qop"),
								new KeyValue<Integer, String>(21, "rop"),
								new KeyValue<Integer, String>(33, "wop"),
								new KeyValue<Integer, String>(56, "xp_"),
								new KeyValue<Integer, String>(-11, "jojo"),
								new KeyValue<Integer, String>(-20, "toto"),
								new KeyValue<Integer, String>(-50, "21314"),
								new KeyValue<Integer, String>(45, "gsdf"),
								new KeyValue<Integer, String>(-4, "pry"),
								new KeyValue<Integer, String>(1000, "zxc"),
								new KeyValue<Integer, String>(2000, "{}")
						})
		};
		
		for (TestVector test_vector : test_vectors) {
			HashTable<Integer, String> table =
					newHashTableInstance(
							test_vector.m_initial_capacity,
							test_vector.m_load_factor);
			
			// Populate the hash table
			for (Object obj : test_vector.m_mappings) {
				KeyValue<Integer, String> mapping = (KeyValue<Integer, String>) obj;
				table.map(mapping.m_key, mapping.m_value);
			}
			
			// Check the table size
			assertEquals(test_vector.m_mappings.length, table.size());
			
			for (Object obj : test_vector.m_mappings) {
				KeyValue<Integer, String> mapping = (KeyValue<Integer, String>) obj;
				String value = table.find(mapping.m_key);
				
				assertEquals(mapping.m_value, value);
			}
		}
	}
	
	/**
	 * Exercises the behavior of the hash table when mapping keys that have
	 * the same hash as the previously unmapped keys.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void mapKeysWithSameHashAsPreviouslyUnmappedKeys() {
		/**
		 * A helper class where user can provide the hash code to be
		 * returned by its hashCode() method as well as the data that
		 * represents the instance.
		 */
		class KeyClass {
			int m_hashcode;
			String m_data;
			
			public KeyClass(int hashcode, String data) {
				m_hashcode = hashcode;
				m_data = data;
			}
			
			@Override
			public boolean equals(Object obj) {
				if (this == obj) {
					return true;
				}
				
				if (obj instanceof KeyClass) {
					KeyClass instance = (KeyClass) obj;
					return m_data.equals(instance.m_data);
				}
				
				return false;
			}
			
			@Override
			public  int hashCode() {
				return m_hashcode;
			}
		}
		
		ArrayList<Object> reference_mappings = new ArrayList<Object>(Arrays.asList(new Object[] {
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "A"), 100),
				new KeyValue<KeyClass, Integer>(new KeyClass(-1, "b"), -99),
				new KeyValue<KeyClass, Integer>(new KeyClass(3, "c"), 83),
				new KeyValue<KeyClass, Integer>(new KeyClass(-3, "d"), 77),
				new KeyValue<KeyClass, Integer>(new KeyClass(4, "ee"), 54),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "ff"), 101),
				new KeyValue<KeyClass, Integer>(new KeyClass(5, "gggg"), 95),
				new KeyValue<KeyClass, Integer>(new KeyClass(1, "hhh"), 73),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "iiii"), 69),
				new KeyValue<KeyClass, Integer>(new KeyClass(-1, "jjjj"), 91),
				new KeyValue<KeyClass, Integer>(new KeyClass(4, "kkkk"), 150),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "ll"), 324),
				new KeyValue<KeyClass, Integer>(new KeyClass(3, "mm"), 103),
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "n"), 95),
				new KeyValue<KeyClass, Integer>(new KeyClass(5, "o"), 96),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "ppp"), 91),
				new KeyValue<KeyClass, Integer>(new KeyClass(-3, "qqqq"), -95)
		}));
		
		// Populate the table
		HashTable<KeyClass, Integer> table = newHashTableInstance(3, 0.75f);
		for (Object obj : reference_mappings) {
			KeyValue<KeyClass, Integer> mapping = (KeyValue<KeyClass, Integer>) obj;
			table.map(mapping.m_key, mapping.m_value);
		}
		
		KeyClass[] keys_to_unmap = {
				new KeyClass(0, "A"),
				new KeyClass(3, "c"),
				new KeyClass(-4, "ll"),
				new KeyClass(6, "iiii"),
				new KeyClass(6, "afksdjfklsdjf"),
				new KeyClass(4, "ee"),
				new KeyClass(3, "mm"),
				new KeyClass(-4, "kjjkdfs"),
				new KeyClass(6, "iiii"),
				new KeyClass(-3, "qqqq"),
				new KeyClass(0, "jkjkjkk"),
				new KeyClass(-4, "ff"),
				new KeyClass(0, "A"),
				new KeyClass(-4, "ff"),
				new KeyClass(5, "o")
		};
		
		// Unmap the specified keys
		for (int i = 0; i < keys_to_unmap.length; ++i) {
			Integer unmapped_value = table.unmap(keys_to_unmap[i]);
			
			// Get the index of the mapping with given key from the reference list
			int final_i = i;
			OptionalInt mapping_index = IntStream.range(0, reference_mappings.size())
					.filter(
							index -> {
								return ((KeyValue<KeyClass, Integer>)
										reference_mappings.get(index)).m_key.equals(
												keys_to_unmap[final_i]);
							})
					.findFirst();
			
			if (mapping_index.isPresent()) {
				// Mapping with the given key is present in the list. Make sure its
				// value matches the value returned by hash table unmap method.
				KeyValue<KeyClass, Integer> ref_mapping =
						(KeyValue<KeyClass, Integer>) reference_mappings.remove(mapping_index.getAsInt());
				
				assertEquals(ref_mapping.m_value, unmapped_value);
			}
			else {
				assertNull(unmapped_value);
			}
			
			// Assert that removed key is no longer present in the hash table
			assertFalse(table.containsKey(keys_to_unmap[i]));
		}
		
		// Insert new mappings. Some of these have keys that match the keys of previously removed mappings
		Object[] additional_mappings_to_insert = {
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "AAAA"), 0),
				new KeyValue<KeyClass, Integer>(new KeyClass(-3, "cccc"), 99),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "llllll"), 100),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "iiiiiiiii"), 10),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "afksdjfklsdjf"), 831),
				new KeyValue<KeyClass, Integer>(new KeyClass(4, "eeeeee"), 123),
				new KeyValue<KeyClass, Integer>(new KeyClass(3, "mm"), 77),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "kjjkdfs"), 34),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "iiiiiiii"), 0),
				new KeyValue<KeyClass, Integer>(new KeyClass(-3, "qqqqqqqq"), 56),
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "jkjkjkk"), 2334),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "ffffff"), 22),
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "A"), 12),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "ffffff"), 78),
				new KeyValue<KeyClass, Integer>(new KeyClass(5, "ooooo"), 11),
				new KeyValue<KeyClass, Integer>(new KeyClass(5, "gggg"), 95),
				new KeyValue<KeyClass, Integer>(new KeyClass(1, "hhh"), 73),
				new KeyValue<KeyClass, Integer>(new KeyClass(-1, "jjjj"), 91),
				new KeyValue<KeyClass, Integer>(new KeyClass(4, "kkkk"), 150),
				new KeyValue<KeyClass, Integer>(new KeyClass(-4, "ll"), 324),
				new KeyValue<KeyClass, Integer>(new KeyClass(0, "n"), 95),
				new KeyValue<KeyClass, Integer>(new KeyClass(5, "o"), 96),
				new KeyValue<KeyClass, Integer>(new KeyClass(6, "ppp"), 91)
		};
		
		for (int i = 0; i < additional_mappings_to_insert.length; ++i) {
			KeyValue<KeyClass, Integer> mapping = (KeyValue<KeyClass, Integer>) additional_mappings_to_insert[i];
			table.map(mapping.m_key, mapping.m_value);
			
			// Check if this mapping is already present in the reference list
			OptionalInt mapping_index = IntStream.range(0, reference_mappings.size())
					.filter(
							index -> {
								return ((KeyValue<KeyClass, Integer>)
										reference_mappings.get(index)).m_key.equals(
												mapping.m_key);
							})
					.findFirst();
			
			if (!mapping_index.isPresent()) {
				reference_mappings.add(mapping);
			}
			else {
				// Otherwise, its value in the list must be updated
				((KeyValue<KeyClass, Integer>) reference_mappings.get(mapping_index.getAsInt())).m_value = mapping.m_value;
			}
		}
		
		// Finally, iterate over the reference list and make sure all the mappings
		// are found in the hash table
		for (Object obj : reference_mappings) {
			KeyValue<KeyClass, Integer> mapping = (KeyValue<KeyClass, Integer>) obj;
			
			Integer value = table.find(mapping.m_key);
			assertEquals(mapping.m_value, value);
		}
	}
	
	/**
	 * Populates the hash table in such a way that each key is map to a unique
	 * value. It then unmaps a single key and asserts that the value it used to
	 * be mapped to is no longer present in the table.
	 */
	@Test
	@SuppressWarnings("unchecked")
	public void unmapKeyThenCheckWhetherValueIsPresent() {
		// All keys must be mapped to unique values
		Object[] mappings_to_insert = {
				new KeyValue<Integer, String>(0, "A"),
				new KeyValue<Integer, String>(-23, "B"),
				new KeyValue<Integer, String>(5, "C"),
				new KeyValue<Integer, String>(34, "D"),
				new KeyValue<Integer, String>(100, "E"),
				new KeyValue<Integer, String>(null, "F")
		};
		
		// We'll remove the middle mapping
		KeyValue<Integer, String> mapping_to_remove =
				(KeyValue<Integer, String>) mappings_to_insert[mappings_to_insert.length / 2];
		
		HashTable<Integer, String> table = newHashTableInstance();
		
		// Populate the table
		for (Object obj : mappings_to_insert) {
			KeyValue<Integer, String> mapping = (KeyValue<Integer, String>) obj;
			table.map(mapping.m_key, mapping.m_value);
		}
		
		// Remove the mapping
		String removed_value = table.unmap(mapping_to_remove.m_key);
		if (mapping_to_remove.m_value != null) {
			assertEquals(mapping_to_remove.m_value, removed_value);
		}
		else {
			assertNull(removed_value);
		}
		
		// Assert that the table doesn't contain the value of the mapping
		// we just removed (that must've been the only mapping with this
		// value in the table
		assertFalse(table.containsValue(mapping_to_remove.m_value));
	}
}
