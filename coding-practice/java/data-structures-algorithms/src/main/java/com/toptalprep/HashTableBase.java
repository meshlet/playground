package com.toptalprep;

/**
 * Abstract base hash table class.
 *
 * Implements the common hash table functionality shared by all the
 * hash table implementations.
 *
 * A simple modulo function is used to compute the array index for
 * the given key hash:
 *
 * array_index = hash(k) % array_size
 *
 * The Object.hashCode method is used to obtain the hash of the key
 * value, and Object.equals to test keys for equality. It is the
 * responsibility of the user to make sure that the custom classes used
 * as keys override these methods (otherwise, the Object class methods
 * will be used).
 */
public abstract class HashTableBase<KeyT, ValueT> implements HashTable<KeyT, ValueT> {
	// TODO: this won't be used in hash table implementations that
	// use separate chaining to resolve key collisions.
	/**
	 * This value is assigned to the key to mark the mapping as
	 * removed. Note that REMOVED_KEY.equals() will return true
	 * only if compared with itself. When compared to any other
	 * key it will return false. As user can't pass in the
	 * REMOVED_KEY, the equals() will return false for any user
	 * specified key compared with the REMOVED_KEY.
	 */
	protected static final Object REMOVED_KEY = new Object();
	
	protected class KeyValuePair {
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
		 * Returns true if m_key is equal to other_key. Note that true is
		 * returned if both m_key and other_key are null.
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
	
	protected int m_size;
	protected final int m_initial_capacity;
	protected final float m_load_factor;
	protected Object[] m_array;
	
	/**
	 * Initializes the HashTableBase instance.
	 *
	 * @param initial_capacity  The hash table's initial capacity.
	 * @param load_factor       The load factor determines the maximal occupancy of
	 *                          the table before it is re-sized. This value represents
	 *                          a percentage and falls within a range [0.0, 1.0].
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero
	 *         or load_factor is negative or greater than 1.0.
	 */
	protected HashTableBase(int initial_capacity, float load_factor) throws IllegalArgumentException {
		if (initial_capacity <= 0) {
			throw new IllegalArgumentException("initial_capacity not positive");
		}
		
		// TODO: load_factor can be > 1.0 for hash table implementations that use
		// separate chaining, so HashTableBase shouldn't throw in that case.
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
	protected KeyValuePair getKeyValue(int index) {
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
	protected long computeHash(KeyT key) {
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
	protected int mapHashToIndex(long hash) {
		// It's safe to cast the result of hash % m_array.length to an
		// integer because the resulting value cannot be larger than
		// Integer.MAX_VALUE - 1
		return (int)(hash % m_array.length);
	}
	
	// TODO: this method implementation should be moved to the HashTableOpenAddressing
	// class, as different implementation is needed for the hash table implementations
	// using separate chaining.
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
	 * The number of keys in the hash table.
	 *
	 * @return The number of keys.
	 */
	@Override
	public int size() {
		return m_size;
	}
	
	/**
	 * Clears the table so that it contains no keys.
	 *
	 * The underlying array is shrank to its initial capacity.
	 */
	@Override
	public void clear() {
		m_size = 0;
		m_array = new Object[m_initial_capacity];
	}
	
	/**
	 * Whether table is empty.
	 *
	 * @return True if table is empty, false otherwise.
	 */
	@Override
	public boolean isEmpty() {
		return m_size == 0;
	}
}
