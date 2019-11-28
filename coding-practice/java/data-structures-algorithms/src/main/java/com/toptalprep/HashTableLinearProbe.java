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
 *
 * The class supports removing elements from the hash table.
 * The elements are 'removed' by setting their key hash to
 * Long.MAX_VALUE. Note that the maximum key hash value is
 * 2 * Integer.MAX_VALUE + 1 < Long.MAX_VALUE, hence
 * Long.MAX_VALUE is not a valid hash. The removed elements
 * cannot be set to NULL because methods that search
 * through the list must skip this element and proceed the
 * search instead of halting the search there. If removed
 * elements were to be set to NULL, the search would
 * terminate there even though more mapping to that particular
 * array index may follow after.
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
		long m_key;

		ValueT m_value;
	}
	
	int m_size;
	Object[] m_array;
	
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

		// It's safe to cast the result of hash % m_array.length to an
		// integer because the array length cannot be larger than the
		// Integer.MAX_VALUE - 1
		int index = (int)(hash % m_array.length);
		
		// Starting at the array index where the given key should map to,
		// iterate until either: 1) the end of the array is reached, 2) an
		// empty array cell is found which means that key is not in the map
		// (otherwise it would've been placed in one of the previous cells),
		// or 3) we find the key.
		while (index < m_array.length && m_array[index] != null) {
			if (getKeyValue(index++).m_key == hash) {
				// Found the key
				return true;
			}
		}
		return false;
	}
	
	public boolean containsValue(ValueT value) {
		
	}
	
	public ValueT get(KeyT key) {
		
	}
	
	// returns the previous value of key if there was one, null otherwise
	public ValueT put(KeyT key, ValueT value) {
		
	}
	
	// Returns the value that 'key' was mapped to, or null if key didn't
	// have a mapping
	public ValueT remove(KeyT key) {
		
	}
	
	// Removes 'key' from the table if it maps to 'value'. Returns true
	// if key is removed from the table
	public boolean remove(KeyT key, ValueT value) {
		
	}
	
	// Replaces the value 'key' maps to to 'value'. Returns the previous
	// value the key was mapped to or null if it had no mapping. Null
	// might also indicate that key was previously mapped to null. If
	// the table doesn't contain 'key', the method has no effect.
	public ValueT replace(KeyT key, ValueT value) {
		
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
