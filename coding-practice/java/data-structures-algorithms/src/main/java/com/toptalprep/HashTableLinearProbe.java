package com.toptalprep;


/**
 * Implements a classic HashTable that uses linear probing
 * to address collisions, where in case of collision the
 * algorithm checks the successive indices until a free
 * array element is found.
 *
 * The implementation uses a simple modulo function to
 * compute the array index for the given key hash:
 *
 * array_index = key_hash % array_size
 *
 * The implementation uses the Object.hashCode to calculate
 * the hash of the key value, and Object.hashCode to test
 * keys for equality. It is the responsibility of the user
 * of this class to make sure that the custom classes uses
 * as keys override these methods (otherwise, the Object
 * class methods will be used).
 *
 * The class allows null keys.
 */
public class HashTableLinearProbe<KeyT, ValueT> {
	/**
	 * This value is assigned to the key to mark the mapping as
	 * removed. Note that REMOVED_KEY.equals() will return true
	 * only if compared with itself. When compared to any other
	 * key it will return false. As user can't pass in the
	 * REMOVED_KEY, the equals() will return false for any user
	 * specified key compared with the REMOVED_KEY.
	 */
	private static final Object REMOVED_KEY = new Object();
	
	private class KeyValuePair {
		/**
		 * This is the hash of the key and not the key itself.
		 *
		 * @note The keys are stored as Object instead of KeyT to make it
		 * possible to assign REMOVED_KEY to m_key when key is unmapped.
		 * 
		 * @note It is important to store the actual key object and not its
		 * hash code. While Object.equals() and Object.hashCode() contract
		 * requires that hashCode() must return the same value for two equal
		 * objects (for which equals() returns true), it doesn't state that
		 * distinct objects might not have the same hash. Hence, keys must be
		 * compared via their equals() method and not their hash value.
		 */
		Object m_key;

		/**
		 * The value that given key maps to.
		 */
		ValueT m_value;
		
		public KeyValuePair(Object key, ValueT value) {
			m_key = key;
			m_value = value;
		}
		
		/**
		 * Returns true if m_key is equal to other_key. The method assumes that
		 * other_key is a key passed in the by the user of hash table, hence it
		 * must not be NULL. m_key can be NULL on the other hand if this mappings
		 * has been deleted. Therefore, the method will return false if m_key is
		 * NULL
		 *
		 * @param other_key  The key to compare with.
		 *
		 * @return True if m_key is equal to other_key, false otherwise.
		 */
		public boolean keyEquals(Object other_key) {
			if (m_key == null && other_key == null) {
				return true;
			}
			
			return m_key != null ? m_key.equals(other_key) : false;
		}
	}
	
	private int m_size;
	private final int m_initial_capacity;
	private final float m_load_factor;
	private Object[] m_array;
	
	/**
	 * Constructs a HashTableLinearProbe instance with initial capacity
	 * of 11 elements and load factor of 0.75.
	 */
	public HashTableLinearProbe() {
		m_size = 0;
		m_initial_capacity = 11;
		m_load_factor = 0.75f;
		m_array = new Object[50];
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity
	 * and load factor of 0.75.
	 *
	 * @param initial_capacity  The hash table's initial capacity.
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero.
	 */
	public HashTableLinearProbe(int initial_capacity) throws IllegalArgumentException {
		if (initial_capacity <= 0) {
			throw new IllegalArgumentException("initial_capacity not positive");
		}
		
		m_size = 0;
		m_initial_capacity = initial_capacity;
		m_load_factor = 0.75f;
		m_array = new Object[m_initial_capacity];
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity
	 * and initial capacity.
	 *
	 * @param initial_capacity  The hash table's initial capacity.
	 * @param load_factor       The load factor determines the maximal occupancy of
	 *                          the table before it is re-sized. This value represents
	 *                          a percentage and falls within a range [0.0, 1.0]. The
	 *                          value is capped to 1.0 if greater than 1.0, and an
	 *                          exception is thrown if it is negative.
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero
	 *         or load_factor is negative or greater than 1.0.
	 */
	public HashTableLinearProbe(int initial_capacity, float load_factor)
			throws IllegalArgumentException {
		if (initial_capacity <= 0) {
			throw new IllegalArgumentException("initial_capacity not positive");
		}
		
		if (load_factor < 0.0f || load_factor > 1.0f) {
			throw new IllegalArgumentException("load_factor not in range [0.0, 1.0]");
		}
		
		m_size = 0;
		m_initial_capacity = initial_capacity;
		m_load_factor = load_factor;
		m_array = new Object[m_initial_capacity];
	}
	
	/**
	 * Cast the object at given array index to KeyValuePair.
	 *
	 * @param index  The array index of the key/value pair.
	 *
	 * @return The KeyValuePair instance.
	 */
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
	 * to form the actual hash to be used. Note that this could cause integer
	 * overflow for the Java int type, hence the hash is converted to long
	 * before the conversion. This way, the smallest hash value Integer.MIN_VALUE
	 * maps to 0 and biggest hash value Integer.MAX_VALUE maps to
	 * 2 * Integer.MAX_VALUE + 1 which is less than Long.MAX_VALUE hence there's
	 * no danger of overflowing the long type.
	 *
	 * NULL is a valid key value and is hashed to 2 * Integer.MAX_VALUE + 2
	 * by this method. This is so that no key will hash to the same value as
	 * NULL (the largest hash value a key can hash to is 2 * Integer.MAX_VALUE + 1).
	 * 
	 * @param key  The key whose hash should be computed.
	 *
	 * @return The key's hash.
	 */
	private long computeHash(KeyT key) {
		// Note that hash is cast to long before added to Integer.MAX_VALUE
		// to prevent the integer overflow.
		return key != null ? (long) key.hashCode() + Integer.MAX_VALUE + 1L : 2L * Integer.MAX_VALUE + 2L;
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
	 * until either an empty cell is found or every element in the array
	 * is checked. In this case the time complexity degrades to O(K) where
	 * K is the number of array elements that the method needs to
	 * iterate over. For a mostly unoccupied hash table this K will
	 * be small, and for mostly occupied hash table this K will grow
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
		
		int index = mapHashToIndex(computeHash(key));
		
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
		}
		return false;
	}
	
	/**
	 * Linearly scans the map searching for specified value.
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

		int index = mapHashToIndex(computeHash(key));
		
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
		}
		return null;
	}
	
	/**
	 * Re-sizes the table if needed and moves all the existing mappings
	 * (those with non-null keys) to the new location in the newly
	 * allocated array.
	 */
	@SuppressWarnings("unchecked")
	private void resizeTable() {
		// If current table occupancy is lower than the load factor we
		// don't need to resize the table
		float occupancy = (float) m_size / m_array.length;
		if (occupancy < m_load_factor) {
			return;
		}

		// Allocate the array that is twice as big as the current one
		Object[] old_array = m_array;
		m_array = new Object[2 * old_array.length];
		
		// Move each mapping to a new location
		for (int i = 0; i < old_array.length; ++i) {
			KeyValuePair key_value = (KeyValuePair) old_array[i];
			if (key_value != null && key_value.m_key != REMOVED_KEY) {
				// Starting at the array index where the given key should map to,
				// iterate until we find an empty array cell (an empty cell must
				// exist as we doubled the capacity of the underlying array)
				int index = mapHashToIndex(computeHash((KeyT) key_value.m_key));
				while (m_array[index] != null) {
					// Index will wrap around if array's end is reached
					index = (index + 1) % m_array.length;
				}
				
				// Place the mapping at its new location
				m_array[index] = key_value;
			}
		}
	}
	
	/**
	 * Maps the key to value if the key is not already mapped in the table.
	 *
	 * The method will attempt to place the new mapping at array index where
	 * the key maps to. If this entry is occupied, the method will linearly
	 * scan the array until:
	 * 
	 * 1) an array cell containing deleted mapping is found, at which point
	 * the method continues iterating over the array until either: 
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
	 * (with non-null key).
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
	 */
	public ValueT map(KeyT key, ValueT value) {
		int index = mapHashToIndex(computeHash(key));
		
		// Starting at the array index where key maps to, find a cell where
		// the new mapping should be placed. Note that index might wrap around
		// if it reaches the end of the array before the suitable array cell
		// is found.
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
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
	 * The mappings are removed by setting their key to NULL. This is fine as
	 * NULL isn't a valid key value. Note that we cannot simply set the removed
	 * element to NULL because methods that search through the list must skip
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
	public ValueT unmap(KeyT key)  {
		int index = mapHashToIndex(computeHash(key));
		
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
		}
		return null;
	}
	
	/**
	 * Removes the mapping with the key if it maps to the specified value.
	 *
	 * The mappings are removed by setting their key to NULL. This is fine as
	 * NULL isn't a valid key value. Note that we cannot simply set the removed
	 * element to NULL because methods that search through the list must skip
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
	public boolean unmap(KeyT key, ValueT value) {
		int index = mapHashToIndex(computeHash(key));
		
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
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
		int index = mapHashToIndex(computeHash(key));
		
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
			
			// Index will wrap around if array's end is reached
			index = (index + 1) % m_array.length;
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
	 * The underlying array is shrank to its initial capacity.
	 */
	public void clear() {
		m_size = 0;
		m_array = new Object[m_initial_capacity];
	}
	
	public boolean isEmpty() {
		return m_size == 0;
	}
}
