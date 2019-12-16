package com.toptalprep;

/**
 * Defines the common hash table interface.
 */
public interface HashTable<KeyT, ValueT> {
	/**
	 * Checks whether given key is present in the map.
	 *
	 * @param key  The key to search for.
	 *
	 * @return True if key is found, false otherwise.
	 */
	public boolean containsKey(KeyT key);
	
	/**
	 * Linearly scans the map searching for specified value.
	 *
	 * @param ref_value  The value to search for.
	 *
	 * @return True if the hash table contains the given value, false
	 *         otherwise.
	 */
	public boolean containsValue(ValueT ref_value);
	
	/**
	 * Returns the value that given key maps to.
	 *
	 * @param key  The key whose mapping is to be found.
	 *
	 * @return The value that key maps to of keys is present in the hash
	 *         table, null otherwise. Note that null might also be returned
	 *         if the key is present in the table but maps to a null value.
	 */
	public ValueT find(KeyT key);
	
	/**
	 * Maps the key to value if the key is not already mapped in the table,
	 * or updates the value if the key is already mapped.
	 *
	 * @param key    The key to be placed in the hash table.
	 * @param value  The value to which key is mapped to.
	 *
	 * @return Returns the previous value that given key was mapped to, or
	 *         null if key didn't have mapping. The null might also be
	 *         returned if the key was previously mapped to a null value.
	 */
	public ValueT map(KeyT key, ValueT value);
	
	/**
	 * Removes the mapping with the given key.
	 *
	 * @param key  The key to unmap.
	 *
	 * @return Returns the value that key was mapped to, or null if key didn't
	 *         have a mapping. Null might also be returned if key was mapped
	 *         to a null value.
	 */
	public ValueT unmap(KeyT key);
	
	/**
	 * Removes the mapping with the key if it maps to the specified value.
	 * 
	 * @param key    The key to unmap.
	 * @param value  The value to compare against.
	 *
	 * @return Returns true if the mapping is removed from the table, false
	 *         otherwise.
	 */
	public boolean unmap(KeyT key, ValueT value);
	
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
	public ValueT remap(KeyT key, ValueT value);
	
	/**
	 * The number of keys in the hash table.
	 *
	 * @return The number of keys.
	 */
	public int size();
	
	/**
	 * Clears the table so that it contains no keys.
	 *
	 * The underlying array is shrank to its initial capacity.
	 */
	public void clear();
	
	/**
	 * Whether table is empty.
	 *
	 * @return True if table is empty, false otherwise.
	 */
	public boolean isEmpty();
}
