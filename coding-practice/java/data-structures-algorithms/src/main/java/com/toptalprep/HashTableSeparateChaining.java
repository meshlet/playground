package com.toptalprep;

import com.toptalprep.HashTableBase.KeyValuePair;

/**
 * Hash table implementation that uses separate chaining to resolve
 * key collisions. Instead of storing mappings directly in the array
 * cells, every array stores a linked list of all mappings whose keys
 * hash to that array index.
 *
 * Note that load factor can be greater that 1.0 for this hash table
 * implementation, as the table can store more mappings than is the
 * size of the table.
 *
 * Implementation allows null keys.
 */
public class HashTableSeparateChaining<KeyT, ValueT> extends HashTableBase<KeyT, ValueT> {
	/**
	 * Constructs a HashTableLinearProbe instance with initial capacity
	 * of 11 elements and load factor of 0.75.
	 */
	public HashTableSeparateChaining() {
		super(11, 0.75f);
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity
	 * and load factor of 0.75.
	 *
	 * @param initial_capacity  The hash table's initial capacity.
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero.
	 */
	public HashTableSeparateChaining(int initial_capacity) throws IllegalArgumentException {
		super(initial_capacity, 0.75f);
	}
	
	/**
	 * @see HashTableBase#HashTableBase(int, float)
	 */
	protected HashTableSeparateChaining(int initial_capacity, float load_factor)
			throws IllegalArgumentException {
		super(initial_capacity, load_factor);
	}
	
	/**
	 * Gets the bucket at the given index.
	 *
	 * @param index  The index of the bucket to retrieve.
	 *
	 * @return The bucket.
	 */
	@SuppressWarnings("unchecked")
	private SinglyLinkedList<KeyValuePair> getBucket(int index) {
		assert(index < m_array.length);
		return (SinglyLinkedList<KeyValuePair>) m_array[index];
	}
	
	/**
	 * Gets the bucket by casting the given object to {@link SinglyLinkedList}.
	 */
	@SuppressWarnings("unchecked")
	private SinglyLinkedList<KeyValuePair> getBucket(Object obj) {
		return (SinglyLinkedList<KeyValuePair>) obj;
	}
	
	/**
	 * Checks whether given key is present in the map.
	 *
	 * Time complexity of this operation is O(1) in best-case scenario
	 * when the linked list at the array index where key hashes to has
	 * a single element only. Otherwise, in the average half of the list
	 * at the given index have to searched, so performance degrades to
	 * O(K) where K is the number of keys that has to that array index.
	 *
	 * @param key  The key to search for.
	 *
	 * @return True if key is found, false otherwise.
	 */
	public boolean containsKey(KeyT key) {
		// Handle the case of an empty hash table right away
		if (isEmpty()) {
			return false;
		}
		
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		// Check if the bucket contains a mapping with the requested key
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		if (bucket != null) {
			for (KeyValuePair mapping : bucket) {
				if (mapping.keyEquals(key)) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * Linearly scans the table searching for the specified value.
	 *
	 * Time complexity of this operation is O(max(K,N)) where K is the
	 * number of keys in the table and N is the length of the underlying
	 * array. If table occupancy is less than the array size (K < N), the
	 * operation is O(N) as method will anyways check every array cell.
	 * However, if the table occupancy is greater than the array size
	 * (K > N), every mapping has to be checked so operation is O(K)
	 * in that case. 
	 *
	 * @note Performance of this method could be considerably improved
	 * by having an array of values stored in the hash table. This method
	 * would then iterate of that array instead of a potentially much
	 * larger hash table array. The performance would still be O(N) but
	 * N would then be the number of keys in the hash table.
	 *
	 * @param ref_value  The value to search for.
	 *
	 * @return True if the hash table contains the given value, false
	 *         otherwise.
	 */
	public boolean containsValue(ValueT ref_value) {
		// For every bucket
		for (Object obj : m_array) {
			SinglyLinkedList<KeyValuePair> bucket = getBucket(obj);
			if (bucket != null) {
				// For every mapping in the bucket
				for (KeyValuePair mapping : bucket) {
					if ((ref_value != null && ref_value.equals(mapping.m_value)) || ref_value == mapping.m_value) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	/**
	 * Returns the value that given key maps to.
	 *
	 * The time complexity of this method is O(1) in best-case scenario
	 * where the bucket at the index where key hashes to has a single
	 * mapping only. Otherwise, the complexity is O(K) where K is the
	 * length of the bucket at the given index.
	 *
	 * @param key  The key whose mapping is to be found.
	 *
	 * @return The value that key maps to of keys is present in the hash
	 *         table, null otherwise. Note that null might also be returned
	 *         if the key is present in the table but maps to a null value.
	 */
	public ValueT find(KeyT key) {
		// Handle the case of an empty hash table right away
		if (isEmpty()) {
			return null;
		}

		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		// Search through the bucket
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		if (bucket != null) {
			for (KeyValuePair mapping : bucket) {
				if (mapping.keyEquals(key)) {
					return mapping.m_value;
				}
			}
		}
		return null;
	}
	
	/**
	 * Re-sizes the table if needed and moves all the existing mappings
	 * to the new location in the newly allocated array.
	 *
	 * @throws ArithmeticException if integer overflow happens when array
	 * size is increased.
	 */
	@SuppressWarnings("unchecked")
	private void resizeTable() throws ArithmeticException {
		// If current table occupancy is lower than the load factor we
		// don't need to resize the table
		float occupancy = (float) m_size / m_array.length;
		if (occupancy < m_load_factor) {
			return;
		}

		// Allocate the array that is at least twice as big as the current one
		Object[] old_array = m_array;
		int doubled_size = 2 * old_array.length;
		if (doubled_size < 0) {
			throw new ArithmeticException("Increased array size overflows the integer type");
		}
		m_array = new Object[doubled_size];
		
		// For every bucket in the old array
		for (Object obj : old_array) {
			SinglyLinkedList<KeyValuePair> bucket = getBucket(obj);
			if (bucket != null) {
				// For every mapping in the bucket
				for (KeyValuePair mapping : bucket) {
					// In which bucket should it be placed?
					long key_hash = computeHash((KeyT) mapping.m_key);
					int index = mapHashToIndex(key_hash);
					
					// Does the bucket already exist?
					SinglyLinkedList<KeyValuePair> tmp_bucket = getBucket(index);
					if (tmp_bucket == null) {
						m_array[index] = tmp_bucket = new SinglyLinkedList<KeyValuePair>();
					}
					
					// Insert the mapping to the bucket
					tmp_bucket.pushBack(mapping);
				}
			}
		}
	}
	
	/**
	 * Maps the key to value if the key is not already mapped in the table,
	 * or updates the value if the key is already mapped.
	 *
	 * The method will place the new mapping to the bucket at the array index
	 * where the key maps to. The algorithm needs to scan the list to make
	 * sure that mapping with the given key doesn't already exist in the
	 * bucket before it is inserted.
	 * 
	 * The time complexity of this method is O(1) if the bucket in which the
	 * mapping should be placed is empty. Otherwise, the complexity is O(C)
	 * where C is the number of mappings in the given bucket. The complexity
	 * in case that array has to be resized is O(max(N,K)) where N is the
	 * size of the table before it was resized and K is the number of keys
	 * in the table. If number of keys is less than the array size (K < N)
	 * the performance is O(N) as method needs to check every array cell. If
	 * number of keys is greater than the array size (K > N) the performance
	 * is then O(K) as each key needs to be moved.
	 *
	 * @param key    The key to be placed in the hash table.
	 * @param value  The value to which key is mapped to.
	 *
	 * @return Returns the previous value that given key was mapped to, or
	 *         null if key didn't have mapping. The null might also be
	 *         returned if the key was previously mapped to a null value.
	 *
	 * @throws ArithmeticException {@link HashTableOpenAddressing#resizeTable()}
	 */
	public ValueT map(KeyT key, ValueT value) throws ArithmeticException {
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		
		if (bucket != null) {
			// Scan the bucket and check if it contains the given key
			for (KeyValuePair mapping : bucket) {
				if (mapping.keyEquals(key)) {
					// The key is already mapped. Update the value
					ValueT previous_value = mapping.m_value;
					mapping.m_value = value;
					return previous_value;
				}
			}
			
			// Insert the new mapping as the key is not mapped
			bucket.pushBack(new KeyValuePair(key, value));
		}
		else {
			// Allocate the bucket and map the key
			SinglyLinkedList<KeyValuePair> new_bucket = new SinglyLinkedList<KeyValuePair>();
			new_bucket.pushBack(new KeyValuePair(key, value));
			m_array[index] = new_bucket;
		}
		
		// Increase the table size
		++m_size;
		
		// Resize the table if needed
		resizeTable();
		
		return null;
	}
	
	/**
	 * Removes the mapping with the given key.
	 *
	 * Removing mappings is trivial as the buckets are linked lists. Note that
	 * given array cell is not set to NULL if its bucket becomes empty. This
	 * wastes a bit of memory but improves performance because we don't need
	 * to allocate the bucket at later point.
	 *
	 * @param key  The key to unmap.
	 *
	 * @return Returns the value that key was mapped to, or NULL if key didn't
	 *         have a mapping. NULL might also be returned if key was mapped
	 *         to a NULL value.
	 */
	@SuppressWarnings("unchecked")
	public ValueT unmap(KeyT key)  {
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		// Attempt to remove the mapping with given key.
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		Object removed_value[] = { null };
		if (bucket != null && bucket.removeIf(
				mapping -> {
					if (mapping.keyEquals(key)) {
						removed_value[0] = mapping.m_value;
					}
					return mapping.keyEquals(key);
				}))
		{
			--m_size;
		}
		
		return (ValueT) removed_value[0];
	}
	
	/**
	 * Removes the mapping with the key if it maps to the specified value.
	 *
	 * Removing mappings is trivial as the buckets are linked lists. Note that
	 * given array cell is not set to NULL if its bucket becomes empty. This
	 * wastes a bit of memory but improves performance because we don't need
	 * to allocate the bucket at later point.
	 *
	 * @param key    The key to unmap.
	 * @param value  The value to compare against.
	 *
	 * @return Returns true if the mapping is removed from the table, false
	 *         otherwise.
	 */
	public boolean unmap(KeyT key, ValueT value) {
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		// Attempt to remove the mapping with given key and value.
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		if (bucket != null && bucket.remove(new KeyValuePair(key, value))) {
			--m_size;
			return true;
		}
		return false;
	}
	
	/**
	 * Remaps the key to the specified value.
	 *
	 * If the key isn't found in the hash table the method has no effect.
	 * This is the difference between map and remap methods.
	 *
	 * @param key    The key to remap.
	 * @param value  The value that key is remapped to.
	 *
	 * @return The value that key was mapped to or null if the key had
	 *         no mapping. Null return value may also indicate that key
	 *         was previously mapped to the null value.
	 */
	public ValueT remap(KeyT key, ValueT value) {
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		SinglyLinkedList<KeyValuePair> bucket = getBucket(index);
		
		if (bucket != null) {
			// Scan the bucket and check if it contains the given key
			for (KeyValuePair mapping : bucket) {
				if (mapping.keyEquals(key)) {
					// Remap the key to the new value
					ValueT previous_value = mapping.m_value;
					mapping.m_value = value;
					return previous_value;
				}
			}
		}
		return null;
	}
}
