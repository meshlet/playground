package com.toptalprep;

/**
 * Implements a classic HashTable that uses linear probing
 * to address collisions, where in case of collision the
 * algorithm checks the successive indices until a free
 * array element is found.
 *
 * The implementation uses a simple modulo function to
 * compute the array index for the given key:
 *
 * array_index = key_hash % array_size
 *
 * The implementation uses the Object.hashCode to calculate
 * the hash of the key value, and Object.hashCode to test
 * keys for equality. It is the responsibility of the user
 * of this class to make sure that the custom classes uses
 * as keys override these methods (otherwise, the Object
 * class methods will be used).
 */
public class HashTableLinearProbe<KeyT, ValueT> {
	private class KeyValuePair {
		/**
		 * This is the hash of the key and not the key itself.
		 *
		 * Note that we don't need to store the actual key because if two
		 * key objects are equal then their hashes must be equal as well
		 * as specified by the Object.equals and Object.hashCode contracts.
		 */
		long m_key_hash;

		/**
		 * The value that given key maps to.
		 */
		ValueT m_value;
		
		public KeyValuePair(long key_hash, ValueT value) {
			m_key_hash = key_hash;
			m_value = value;
		}
	}
	
	private int m_size;
	private Object[] m_array;
	
	// TODO: The constructor should accept two parameters:
	// 1) initial_capacity - determines how big the array will be
	//    when an instance is created
	// 2) load_factor - determines how full the array can become
	//    before its size is increased. This is actually a percentage
	//    represented as a float between 0.0 and 1.0. The default
	//    is 0.75 which means that the array size will increase when
	//    75% of its capacity is filled. This is to mitigate the effects
	//    of clustering, where the sequence of elements that hash to
	//    the same index gets long and accessing elements at the end
	//    of those sequences becomes slow.
	//
	// The load_factor is only a suggestion as to when to resize the
	// underlying array. When will the resizing actually happen is
	// implementation defined. For instance, when placing a new mapping
	// in the table, if the end of the array is reached before the new
	// mapping is placed in it, the array is resized to make room for
	// the new mapping even though the current table load might not
	// have reached the load specified by the load_factor.
	public HashTableLinearProbe() {
		m_size = 0;
		m_array = new Object[50];
	}
	
	@SuppressWarnings("unchecked")
	private KeyValuePair getKeyValue(int index) {
		return (KeyValuePair) m_array[index];
	}
	
	/**
	 * Computes the hash for the given key.
	 *
	 * Note that hashCode method might return negative hash. However, these
	 * hash values need to be mapped to array indices, so negative hashes
	 * must be converted to positive indices. The simplest way would be to
	 * simply reverse the sign of the negative hash so that -1 becomes 1.
	 * But this can potentially double the number of collisions if hashes
	 * are evenly distributed in the negative and positive range. Instead,
	 * the hash returned by hashCode is added to the Integer.MAX_VALUE + 1
	 * to form the actual hash to be used. Note that this would cause integer
	 * overflow for the Java int type, hence the hash is converted to long
	 * before the conversion.
	 * 
	 * @param key  The key whose hash should be computed.
	 *
	 * @return The key's hash.
	 */
	private long computeHash(KeyT key) {
		// Note that hash is cast to long before added to Integer.MAX_VALUE
		// to prevent the integer overflow.
		return (long) key.hashCode() + Integer.MAX_VALUE + 1L;
	}
	
	/**
	 * Maps given hash to the array index.
	 * 
	 * @param hash  The hash.
	 *
	 * @return The array index where hash maps to.
	 */
	private int mapHashToIndex(long hash) {
		// It's safe to cast the result of hash % m_array.length to an
		// integer because the resulting value cannot be larger than
		// Integer.MAX_VALUE - 1
		return (int)(hash % m_array.length);
	}
	
	/**
	 * Checks whether given key is present in the map.
	 *
	 * Time complexity of this operation is O(1) in best-case scenario
	 * when key is found at the array index where its hash maps to. If
	 * the key is not there, the method will linearly scan the array
	 * until either an empty cell is found or the end of the array is
	 * reached. In this case the time complexity degrades to O(k) where
	 * k is the number of array elements that the method needs to
	 * iterate over. For a mostly unoccupied hash table this k will
	 * be small, and for mostly occupied hash table this k will grow
	 * as the clusters (the sequence of keys that map to the same
	 * array index) become larger.
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
		
		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not mapped
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			if (getKeyValue(index++).m_key_hash == hash) {
				// Found the key
				return true;
			}
		}
		return false;
	}
	
	/**
	 * Linearly scans the map searching for specified value.
	 *
	 * Time complexity of this operation is O(N) where N is the current
	 * size of the underlying array (and not the number of keys present
	 * in the array is returned by the size() method).
	 *
	 * @note Performance of this method could be considerably improved
	 * by having an array of values stored in the hash table. This method
	 * would then iterate of that array instead of a potentially much
	 * larger hash table array. The performance would still be O(N) but
	 * N would then be the number of keys in the hash table.
	 *
	 * @param value  The value to search for.
	 *
	 * @return True if the hash table contains the given value, false
	 *         otherwise.
	 */
	public boolean containsValue(ValueT value) {
		for (int i = 0; i < m_array.length; ++i) {
			if (m_array[i] != null && value.equals(getKeyValue(i))) {
				return true;
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
	 * of the cluster (the sequence of keys that map to the same array
	 * index) that key is part of.
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

		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not mapped
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index++);
			if (hash == key_value.m_key_hash) {
				// Found the key
				return key_value.m_value;
			}
		}
		return null;
	}
	
	/**
	 * Maps the key to value if the key is not already mapped in the table.
	 *
	 * The method will attempt to place the new mapping at array index where
	 * the key maps to. If this entry is occupied, the method will linearly
	 * scan the array until: 1) an empty array cell is found where the new
	 * mapping is placed, or 2) the end of the array is reached. If 2) happens,
	 * the underlying array capacity is doubled to make room for the new mapping.
	 * The current table load is checked against the user-specified load factor,
	 * and if greater the underlying array capacity is increased to prevent
	 * the formation of large clusters.
	 *
	 * @note The scenario 2) above might lead to poor memory utilization if most
	 * of the keys are placed at the end of the array, while the rest of the array
	 * is unoccupied. One way to solve this is to treat the underlying array as a
	 * ring buffer. Hence, the method wouldn't terminate when the end of the array
	 * is reached but would instead wrap around and start at the beginning of the
	 * array.
	 * 
	 * The time complexity of this method is O(1) if array entry where the
	 * key maps to is empty. Otherwise, the complexity is O(K) where K is
	 * the length of the cluster that key is part of.
	 *
	 * @param key    The key to be placed in the hash table.
	 * @param value  The value to which key is mapped to.
	 *
	 * @return Returns the previous value that given key was mapped to, or
	 *         null if key didn't have mapping. The null might also be
	 *         returned if the key was previously mapped to a null value.
	 */
	public ValueT map(KeyT key, ValueT value) throws UnsupportedOperationException {
		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where key maps to, find a cell where
		// the new mapping should be placed.
		int new_mapping_index = -1;
		while (index < m_array.length) {
			KeyValuePair key_value = getKeyValue(index);
			if (hash == key_value.m_key_hash) {
				// The key already has a mapping in the table. Update the value
				// it's mapped to and return the previous value.
				ValueT previous_value = key_value.m_value;
				key_value.m_value = value;
				return previous_value;
			}
			else if (m_array[index] == null) {
				// Found an empty array cell
				if (new_mapping_index == -1) {
					// As we didn't previously encounter a cell containing a deleted
					// mapping (the one with key set to Long.MAX_VALUE), the new mapping
					// is placed in this empty cell.
					new_mapping_index = index;
				}
				
				// Otherwise, the new mapping replaces the very first deleted mapping
				// encountered (new_mapping_index holds the index of that array cell).
				break;
			}
			else if (getKeyValue(index).m_key_hash == Long.MAX_VALUE && new_mapping_index == -1) {
				// This array cell contains a deleted mapping. If we didn't encounter a
				// deleted mapping before, remember this array index as the new mapping
				// will be placed in this cell (unless we find the key in the hash table
				// in which case the new mapping isn't inserted to the table).
				new_mapping_index = index;
			}
			
			++index;
		}
		
		if (new_mapping_index == -1) {
			// Couldn't find an empty cell or cell containing a deleted mapping.
			// Resize the array to make room for the new mapping. The size of
			// the array is doubled.
			throw new UnsupportedOperationException("Array resize not implemented");
		}
		
		// Place new mapping to the table and increment the table size
		m_array[new_mapping_index] = new KeyValuePair(hash, value);
		++m_size;
		
		// TODO: check the current table load and if it reached the user-specified
		// load threshold, double the underlying array size to prevent formation of
		// long clusters.
		
		return null;
	}
	
	/**
	 * Removes the mapping with the given key.
	 *
	 * The mappings are removed by setting their key hash to Long.MAX_VALUE
	 * Note that the maximum key hash value is 2 * Integer.MAX_VALUE + 1 < Long.MAX_VALUE,
	 * hence Long.MAX_VALUE is not a valid hash. The removed elements cannot
	 * be set to NULL because methods that search through the list must skip
	 * this element and proceed with the search instead of halting the search
	 * there. If removed elements were to be set to NULL, the search would
	 * terminate there even though more items that map to that particular array
	 * index may follow after.
	 *
	 * @param key  The key to unmap.
	 *
	 * @return Returns the value that key was mapped to, or null if key didn't
	 *         have a mapping. Null might also be returned if key was mapped
	 *         to a null value.
	 */
	public ValueT unmap(KeyT key) {
		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not mapped
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index++);
			if (hash == key_value.m_key_hash) {
				// Remove the mapping by setting its key hash to Long.MAX_VALUE
				key_value.m_key_hash = Long.MAX_VALUE;
				return key_value.m_value;
			}
		}
		return null;
	}
	
	/**
	 * Removes the mapping with the key if it maps to the specified value.
	 *
	 * The mappings are removed by setting their key hash to Long.MAX_VALUE
	 * Note that the maximum key hash value is 2 * Integer.MAX_VALUE + 1 < Long.MAX_VALUE,
	 * hence Long.MAX_VALUE is not a valid hash. The removed elements cannot
	 * be set to NULL because methods that search through the list must skip
	 * this element and proceed with the search instead of halting the search
	 * there. If removed elements were to be set to NULL, the search would
	 * terminate there even though more items that map to that particular array
	 * index may follow after.
	 *
	 * @param key    The key to unmap.
	 * @param value  The value to compare against.
	 *
	 * @return Returns true if the mapping is removed from the table, false
	 *         otherwise.
	 */
	// Removes 'key' from the table if it maps to 'value'. Returns true
	// if key is removed from the table
	public boolean unmap(KeyT key, ValueT value) {
		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not mapped
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index++);
			if (hash == key_value.m_key_hash) {
				if (value.equals(key_value.m_value)) {
					// Remove the mapping by setting its key hash to Long.MAX_VALUE
					key_value.m_key_hash = Long.MAX_VALUE;
					return true;
				}
				break;
			}
		}
		return false;
	}
	
	/**
	 * Remaps the key to the specified value.
	 *
	 * If the key isn't found in the hash table the method has no effect.
	 *
	 * @param key    The key to remap.
	 * @param value  The value that key is remapped to.
	 *
	 * @return The value that key was mapped to or null if the key had
	 *         no mapping. Null return value may also indicate that key
	 *         was previously mapped to the null value.
	 */
	public ValueT remap(KeyT key, ValueT value) {
		long hash = computeHash(key);
		int index = mapHashToIndex(hash);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not mapped
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			KeyValuePair key_value = getKeyValue(index++);
			if (hash == key_value.m_key_hash) {
				// Update value that key is mapped to and returned the previous
				// value
				ValueT previous_value = key_value.m_value;
				key_value.m_value = value;
				return previous_value;
			}
		}
		return null;
	}
	
	/**
	 * The number of keys in the hash table.
	 *
	 * @return The number of keys.
	 */
	public int size() {
		return m_size;
	}
	
	/**
	 * Clears the table so that it contains no keys.
	 *
	 * TODO: perhaps the new array should be of 'initialCapacity' length
	 * as specified at construction time. Using the current array length
	 * might be wasteful because the array might have grown over time
	 * and user might expect it to shrink in memory after clearing the
	 * table.
	 */
	public void clear() {
		m_size = 0;
		m_array = new Object[m_array.length];
	}
	
	public boolean isEmpty() {
		return m_size == 0;
	}
}
