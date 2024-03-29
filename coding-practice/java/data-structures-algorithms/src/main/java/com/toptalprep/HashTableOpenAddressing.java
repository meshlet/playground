package com.toptalprep;

/**
 * Abstract base class for all hash table implementations that use
 * open addressing to solve key collisions.
 *
 * @note The class supports NULL as a key.
 */
public abstract class HashTableOpenAddressing<KeyT, ValueT> extends HashTableBase<KeyT, ValueT> {
	/**
	 * @see HashTableBase#HashTableBase(int, float)
	 *
	 * Hash table implementations using open addressing don't allow load
	 * factor greater than 1.0, as the number of mappings these tables
	 * can store cannot be greater than the size of the table. Hence,
	 * load factor is capped to 1.0.
	 */
	protected HashTableOpenAddressing(int initial_capacity, float load_factor)
			throws IllegalArgumentException {
		// Cap the load factor to 1.0
		super(initial_capacity, load_factor > 1.0f ? 1.0f : load_factor);
	}
	
	/**
	 * This value is assigned to the key to mark the mapping as
	 * removed. Note that REMOVED_KEY.equals() will return true
	 * only if compared with itself. When compared to any other
	 * key it will return false. As user can't pass in the
	 * REMOVED_KEY, the equals() will return false for any user
	 * specified key compared with the REMOVED_KEY.
	 */
	protected static final Object REMOVED_KEY = new Object();
	
	/**
	 * Determines the offset to the next array index to probe.
	 *
	 * The offset is relative to the array index that was previously probed.
	 * Hence, if the last probed index was i, the next index to probe will
	 * be (i + offset) where offset is returned by this method.
	 *
	 * @note Implementation must make sure that when an offset returned by this
	 * method is added to the previously probed array index, the computed value
	 * must be an array index that hasn't been probed yet. In other words, given
	 * an initial array index that was probed f(0) and array length m (corresponds
	 * to {@link HashTableBase#m_array}.length), every array index f(k, i) generated
	 * by
	 *
	 * f(k, 1) = [f(k, 0) + nextProbeOffset(hash(k), 0)] % m
	 * f(k, 2) = [f(k, 1) + nextProbeOffset(hash(k), 1)] % m
	 *  .
	 *  .
	 *  .
	 * f(k, m-1) = [f(k, m-2) + nextProbeOffset(hash(k), m-2)] % m
	 *
	 * must be unique so that every array index is probed at most once. If
	 * nextProbeOffset is called m times, then every array index must be probed
	 * exactly once.
	 *
	 * @param key_hash              The hash code of the key. The key hash is passed
	 *                              instead of the key itself so that this method doesn't
	 *                              have to call {@link HashTableBase#computeHash(Object)}.
	 * @param probed_indices_count  The number of array indices already probed. This method is
	 *                              invoked the first time after the initial index is probed,
	 *                              so this argument will be 1. The counter will then increment
	 *                              by 1 each time an array index is probed. The caller is
	 *                              responsible for updating this counter.
	 *
	 * @return The array index that should be probed next.
	 */
	protected abstract int nextProbeOffset(long key_hash, int probed_indices_count);
	
	/**
	 * Given the requested size it computes the actual size of the underlying array.
	 *
	 * This method is called when resizing an array due to its occupancy reaching
	 * the load factor. When this happens the array size is usually doubled in
	 * size. However, hash table implementations may impose restrictions on the
	 * array size (e.g. the size might have to be power of 2 or a prime number).
	 * This method must return an integer that is greater or equal than the
	 * requested_size.
	 *
	 * @param requested_size  The requested array size.
	 *
	 * @return The actual size of the array. Must be greater or equal than the
	 *         requested size.
	 *
	 * @throws ArithmeticException in case of integer overflow when computing
	 * the array size.
	 */
	protected abstract int computeArraySize(int requested_size) throws ArithmeticException;
	
	/**
	 * Checks whether given key is present in the map.
	 *
	 * Time complexity of this operation is O(1) in best-case scenario
	 * when key is found at the array index where its hash maps to. If
	 * the key is not there, the method will use nextProbeOffset() to
	 * determine the next array index to probe. In this case the time
	 * complexity degrades to O(K) where K is the number of array
	 * elements that the method needs to iterate over (the length of the
	 * cluster).
	 *
	 * For a mostly unoccupied hash table this K will be small, and for
	 * mostly occupied hash table this K might grow as the clusters (the
	 * sequence of keys that map to the same array index) become larger.
	 * The formation of clusters greatly depend on the sequence of probe
	 * indices generated on key collision. In other words, implementation
	 * of the nextProbeOffset() method has significant impact on the
	 * efficiency of the hash table.
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
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) an empty array cell is found which means
		// that key is not mapped (otherwise it would've been placed in one
		// of the previous cells), 2) we iterate over every element of the
		// array without finding the key, or 3) we find the key.
		int counter = 0;
		while (counter++ < m_array.length && m_array[index] != null) {
			if (getKeyValue(index).keyEquals(key)) {
				// Found the key
				return true;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
		}
		return false;
	}
	
	/**
	 * Linearly scans the table searching for the specified value.
	 *
	 * Time complexity of this operation is O(N) where N is the current
	 * size of the underlying array (and not the number of keys present
	 * in the array as returned by the size() method).
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
		for (int i = 0; i < m_array.length; ++i) {
			KeyValuePair key_value = getKeyValue(i);
			if (key_value != null && key_value.m_key != REMOVED_KEY) {
				if ((ref_value != null && ref_value.equals(key_value.m_value)) || ref_value == key_value.m_value) {
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * Returns the value that given key maps to.
	 *
	 * The time complexity of this method is O(1) in best-case scenario
	 * where given key is found at the exact array index where the hash
	 * maps to. Otherwise, the complexity is O(K) where K is the length
	 * of the cluster that key is part of.
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
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) an empty array cell is found which means
		// that key is not mapped (otherwise it would've been placed in one
		// of the previous cells), 2) we iterate over every element of the
		// array without finding the key, or 3) we find the key.
		int counter = 0;
		while (counter++ < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index);
			if (key_value.keyEquals(key)) {
				// Found the key
				return key_value.m_value;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
		}
		return null;
	}
	
	/**
	 * Re-sizes the table if needed and moves all the existing mappings
	 * (those whose keys are not NULL and not set to REMOVED_KEY) to the
	 * new location in the newly allocated array.
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
		// Implementation might place restriction on the array size
		m_array = new Object[computeArraySize(doubled_size)];
		
		// Move each mapping to a new location
		for (int i = 0; i < old_array.length; ++i) {
			KeyValuePair key_value = (KeyValuePair) old_array[i];
			if (key_value != null && key_value.m_key != REMOVED_KEY) {
				// Starting at the array index where the given key should map to,
				// iterate until we find an empty array cell (an empty cell must
				// exist as we doubled the capacity of the underlying array)
				long key_hash = computeHash((KeyT) key_value.m_key);
				int index = mapHashToIndex(key_hash);
				int counter = 0;
				while (m_array[index] != null) {
					// Increment the counter for every probed array index
					++counter;
					
					// Determine the next array index to probe
					index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
				}
				
				// Place the mapping at its new location
				m_array[index] = key_value;
			}
		}
	}
	
	/**
	 * Maps the key to value if the key is not already mapped in the table,
	 * or updates the value if the key is already mapped.
	 *
	 * The method will attempt to place the new mapping at array index where
	 * the key maps to. If this entry is occupied, the method will probe the
	 * array indices computed using the offsets returned by nextProbeOffset()
	 * until:
	 * 
	 * 1) an array cell containing deleted mapping is found, at which point
	 * the method continues probing he array until:
	 *     a) null-cell is found - this means that the key is not already
	 *        present in the table, and new mapping is inserted in the cell
	 *        containing the deleted mapping,
	 *     b) all array elements are checked - meaning that key is not present
	 *        in the table, and new mapping is inserted in the cell containing
	 *        the deleted mapping,
	 *     c) the key is found - the key is then re-mapped to the new value
	 *        and method terminates.
	 *        
	 * 2) a null-cell is found - the new mapping is placed there
	 * 3) the key is found - the key is then re-mapped to the new value and
	 *    method terminates.
	 * 
	 * If the new mapping has been created, the method will check the table
	 * load against the user-provided load factor and if it reached the given
	 * threshold the underlying array is doubled in size. This is done to
	 * prevent the formation of larger clusters that can seriously hurt the
	 * performance of the hash table.
	 * 
	 * The time complexity of this method is O(1) if array entry where the
	 * key maps to is empty. Otherwise, the complexity is O(C) where C is
	 * the length of the cluster that key is part of. The time complexity
	 * in case that array has to be resized is O(N * C), where N is the
	 * current capacity of the underlying array and C is the length of the
	 * cluster in the new array where key needs to be place into. Note that
	 * C is expected to much smaller than N, so the time complexity in this
	 * case should approach O(N). To resize the table we need to iterate
	 * over the entire array and find the new location for every mapping
	 * (whose key is not NULL and not set to REMOVED_KEY).
	 *
	 * @note The worst-case performance of this method (in case the table
	 * needs to be resized) could be improved by storing a separate list
	 * of keys. However, this list needs to be updated each time a key
	 * is mapped/unmapped. Updating the list would be O(1) on mapping a
	 * new key, as we can simply append it to the end of the list (we
	 * already know that key is not present in the table at this point,
	 * so it is also not present in the list). But, on unmapping we must
	 * iterate through the list to find the key and then remove it which
	 * is O(K) operation where K is the number of keys in the table.
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
		
		// Starting at the array index where key maps to, find a cell where
		// the new mapping should be placed.
		int new_mapping_index = -1;
		int counter = 0;
		while (counter++ < m_array.length) {
			KeyValuePair key_value = getKeyValue(index);
			if (key_value == null) {
				// Found an empty array cell
				if (new_mapping_index == -1) {
					// As we didn't previously encounter a cell containing a deleted
					// mapping (the one whose key is null), the new mapping is placed
					// in this empty cell.
					new_mapping_index = index;
				}
				
				// Otherwise, the new mapping replaces the very first deleted mapping
				// encountered (new_mapping_index holds the index of that array cell).
				break;
			}
			else if (key_value.keyEquals(key)) {
				// The key already has a mapping in the table. Update the value
				// it's mapped to and return the previous value.
				ValueT previous_value = key_value.m_value;
				key_value.m_value = value;
				return previous_value;
			}
			else if (key_value.m_key == REMOVED_KEY && new_mapping_index == -1) {
				// This array cell contains a deleted mapping. If we didn't encounter a
				// deleted mapping before, remember this array index as the new mapping
				// will be placed in this cell (unless we find the key in the hash table
				// in which case the new mapping isn't inserted to the table). We must
				// continue the loop as the key might already be present in the table at
				// a later index.
				new_mapping_index = index;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
		}
		
		// The table must always be able to accommodate a new mapping. Even with
		// load factor of 1.0, the table should resize after it becomes completely
		// filled, so the next call to map() will find a free cell.
		assert(new_mapping_index != -1);
		
		// Place new mapping to the table and increment the table size
		m_array[new_mapping_index] = new KeyValuePair(key, value);
		++m_size;
		
		// Resize the table if needed
		resizeTable();
		
		return null;
	}
	
	/**
	 * Removes the mapping with the given key.
	 *
	 * The mappings are removed by setting their key to {@link HashTableBase#REMOVED_KEY},
	 * which is not equal to any other key. We cannot set the key to NULL because
	 * this is a valid key value. We also cannot simply set the removed mapping to
	 * NULL because methods that search through the list must skip this array index
	 * and proceed with the search instead of halting the search there. If removed
	 * elements were to be set to NULL, the search would terminate there even though
	 * more items that map to that particular array index may follow after.
	 *
	 * @param key  The key to unmap.
	 *
	 * @return Returns the value that key was mapped to, or NULL if key didn't
	 *         have a mapping. NULL might also be returned if key was mapped
	 *         to a NULL value.
	 */
	public ValueT unmap(KeyT key)  {
		long key_hash = computeHash(key);
		int index = mapHashToIndex(key_hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) an empty array cell is found which means
		// that key is not mapped (otherwise it would've been placed in one
		// of the previous cells), 2) we iterate over every element of the
		// array without finding the key, or 3) we find the key.
		int counter = 0;
		while (counter++ < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index);
			if (key_value.keyEquals(key)) {
				// Remove the mapping by setting its key to REMOVED_KEY
				key_value.m_key = REMOVED_KEY;
				--m_size;
				return key_value.m_value;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
		}
		return null;
	}
	
	/**
	 * Removes the mapping with the key if it maps to the specified value.
	 *
	 * The mappings are removed by setting their key to {@link HashTableBase#REMOVED_KEY},
	 * which is not equal to any other key. We cannot set the key to NULL because
	 * this is a valid key value. We also cannot simply set the removed mapping to
	 * NULL because methods that search through the list must skip this array index
	 * and proceed with the search instead of halting the search there. If removed
	 * elements were to be set to NULL, the search would terminate there even though
	 * more items that map to that particular array index may follow after.
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
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) an empty array cell is found which means
		// that key is not mapped (otherwise it would've been placed in one
		// of the previous cells), 2) we iterate over every element of the
		// array without finding the key, or 3) we find the key.
		int counter = 0;
		while (counter++ < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index);
			if (key_value.keyEquals(key)) {
				if ((value != null && value.equals(key_value.m_value)) || value == key_value.m_value) {
					// Remove the mapping by setting its key to REMOVED
					key_value.m_key = REMOVED_KEY;
					--m_size;
					return true;
				}
				break;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
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
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) an empty array cell is found which means
		// that key is not mapped (otherwise it would've been placed in one
		// of the previous cells), 2) we iterate over every element of the
		// array without finding the key, or 3) we find the key.
		int counter = 0;
		while (counter++ < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index);
			if (key_value.keyEquals(key)) {
				// Update value that key is mapped to and returned the previous
				// value
				ValueT previous_value = key_value.m_value;
				key_value.m_value = value;
				return previous_value;
			}
			
			// Determine the next array index to probe
			index = (index + nextProbeOffset(key_hash, counter)) % m_array.length;
		}
		return null;
	}
}
