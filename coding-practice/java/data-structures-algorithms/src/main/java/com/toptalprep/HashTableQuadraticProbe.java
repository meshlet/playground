package com.toptalprep;

/**
 * Hash table implementation that uses quadratic probing to resolve
 * key collisions.
 *
 * The array index to probe is a quadratic function of the number of
 * array indices already probed:
 *
 * f(k, i) = [hash(k) + c1*i + c2*i^2] % m
 *
 * where i is the number of array indices already probed, m is the length
 * of the array, hash(k) is the hash value for the key k, c1 and c2 are the
 * coefficients. This implementation uses c1 = c2 = 1/2 and array length m
 * that is power of 2:
 *
 * f(k, i) = [hash(k) + i/2 + (i^2)/2] % m
 *
 * Having coefficients c1 = c2 = 1/2 and m that is power of 2 guarantees
 * that values f(k, i) for i in [0,m-1] are all distinct. In other words,
 * every array index [0,m-1] will be probed exactly once.
 *
 * Instead of computing f(k, i) from scratch for every i, we can compute
 * f(k, i) as a function of f(k, i-1):
 *
 * f(k, i) - f(k, i-1) = [hash(k) + i/2 + (i^2)/2] % m - [hash(k) + (i-1)/2 + ((i-1)^2)/2] % m
 *               = [hash(k) - hash(k) + i/2 - i/2 + 1/2 + (i^2)/2 - (i^2 -2*i + 1)/2] % m
 *               = [1/2 + (i^2)/2 - (i^2)/2 + i - 1/2] % m
 *               = i % m
 *               = i (as i < m)
 * 
 * and thus: f(k, i) = f(k, i-1) + i. Note that f(k, 0) = hash(k) % m.
 */
public class HashTableQuadraticProbe<KeyT, ValueT> extends HashTableOpenAddressing<KeyT, ValueT> {
	/**
	 * Constructs a HashTableLinearProbe instance with initial capacity
	 * of 16 elements and load factor of 0.75.
	 */
	public HashTableQuadraticProbe() {
		super(16, 0.75f);
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity
	 * rounded up to the power of 2 and load factor of 0.75.
	 *
	 * @param initial_capacity  The hash table's initial capacity that is rounded up
	 *                          to the power of 2.
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero.
	 */
	public HashTableQuadraticProbe(int initial_capacity) throws IllegalArgumentException {
		super(roundToPowOfTwo(initial_capacity), 0.75f);
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity rounded
	 * up to the power of two and load factor.
	 *
	 * @param initial_capacity  The hash table's initial capacity that is rounded up
	 *                          to the power of 2.
	 * @param load_factor       The load factor determines the maximal occupancy of
	 *                          the table before it is re-sized. This value represents
	 *                          a percentage and falls within a range [0.0, 1.0].
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero
	 *         or load_factor is negative or greater than 1.0.
	 */
	public HashTableQuadraticProbe(int initial_capacity, float load_factor)
			throws IllegalArgumentException {
		super(roundToPowOfTwo(initial_capacity), load_factor);
	}
	
	/**
	 * Round the 32-bit integer to the next power of two.
	 *
	 * The algorithm works by setting all bits to the right of the most-significant
	 * set bit and then adding 1 to the result. For example, integer 0001 0100 (20)
	 * is converted to 0001 1111. Adding 1 to this value produces 0010 0000 (32)
	 * which is the next power of 2.
	 *
	 * @note The method treats its argument as an unsigned integer.
	 * @note If zero is passed in the method will return zero.
	 *
	 * @param value  The value to round to the next power of 2.
	 *
	 * @return  Value rounded to the next power of 2. Note that the method returns
	 *          its argument if it itself is a power of 2.
	 */
	private static int roundToPowOfTwo(int value) {
		// Decrement value to handle the case when value itself is the power of 2
		--value;
		
		// Assume that the most-significant set bit is bit i
		// Set bit i-1
		value |= value >> 1;
		
		// Set bits i-2 and i-3
		value |= value >> 2;
		
		// Set bits [i-4, i-7]
		value |= value >> 4;
		
		// Set bits [i-8, i-15]
		value |= value >> 8;
		
		// Set bits [i-16, i-31]
		value |= value >> 16;
		
		// With bit i and all bits to the right of it set, adding one will give
		// the next power of 2. Note that if value itself is a power of 2, this
		// will give the original value.
		return value + 1;
	}
	
	/**
	 * @see HashTableOpenAddressing#nextProbeOffset(long, int)
	 *
	 * As showed in {@link HashTableQuadraticProbe}, the next array index to
	 * probe is entirely determined by the number of array indices already
	 * probed. I.e. if the last probed array index was x, the next array index
	 * to probe is computed as (x + probed_indices_count). Thus, this method
	 * simply returns probed_indices_count.
	 */
	protected int nextProbeOffset(long key_hash, int probed_indices_count) {
		return probed_indices_count;
	}
	
	/**
	 * @see HashTableOpenAddressing#computeArraySize(int)
	 *
	 * The array length is required to be the power of 2 by this hash table
	 * implementation. Thus, the requested size is rounded up to the power
	 * of 2 to form the actual size.
	 */
	protected int computeArraySize(int requested_size) throws ArithmeticException {
		int actual_size = roundToPowOfTwo(requested_size);
		if (actual_size < 0) {
			throw new ArithmeticException("Rounding the size to power of 2 causes overflow");
		}
		return actual_size;
	}
}
