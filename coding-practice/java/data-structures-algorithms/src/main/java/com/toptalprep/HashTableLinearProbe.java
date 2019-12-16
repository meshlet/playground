package com.toptalprep;


/**
 * Hash table implementation that uses linear probing to resolve
 * collisions, where in case of collision the algorithm checks
 * the successive indices until a free array element is found.
 */
public class HashTableLinearProbe<KeyT, ValueT> extends HashTableOpenAddressing<KeyT, ValueT> {
	/**
	 * Constructs a HashTableLinearProbe instance with initial capacity
	 * of 11 elements and load factor of 0.75.
	 */
	public HashTableLinearProbe() {
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
	public HashTableLinearProbe(int initial_capacity) throws IllegalArgumentException {
		super(initial_capacity, 0.75f);
	}
	
	/**
	 * Constructs a HashTableLinearProbe instance with given initial capacity
	 * and load factor.
	 *
	 * @param initial_capacity  The hash table's initial capacity.
	 * @param load_factor       The load factor determines the maximal occupancy of
	 *                          the table before it is re-sized. This value represents
	 *                          a percentage and falls within a range [0.0, 1.0].
	 *
	 * @throws IllegalArgumentException if initial_capacity is less or equal to zero
	 *         or load_factor is negative or greater than 1.0.
	 */
	public HashTableLinearProbe(int initial_capacity, float load_factor)
			throws IllegalArgumentException {
		super(initial_capacity, load_factor);
	}
	
	/**
	 * @see HashTableOpenAddressing#nextProbeOffset(long, int)
	 *
	 * The next array index to probe is simply current index plus 1 as
	 * this hash table implementation scans the array linearly. Thus the
	 * offset from the current array index to the next is always 1.
	 */
	protected int nextProbeOffset(long key_hash, int current_index) {
		return 1;
	}
	
	/**
	 * @see HashTableOpenAddressing#computeArraySize(int)
	 *
	 * This hash table implementation imposes no restrictions on the array
	 * size, hence we simply return the request_size.
	 */
	protected int computeArraySize(int requested_size) throws ArithmeticException {
		return requested_size;
	}
}
