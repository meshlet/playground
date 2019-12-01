package com.toptalprep;

import static org.junit.Assert.*;

import org.junit.Test;

/**
 * Unit tests for the HashTableLinearProbe class.
 */
public class HashTableLinearProbeTest {
	/**
	 * Asserts that the empty flag is true upon table creation.
	 */
	@Test
	public void emptyFlagIsTrueInNewTable() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is false in a non-empty table.
	 */
	@Test
	public void emptyFlagIsFalseInNonEmptyTable() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		assertFalse(table.isEmpty());
	}
	
	/**
	 * Asserts that the empty flag is true after last key is unmapped from the table.
	 */
	@Test
	public void emptyFlagIsTrueAfterTableBecomesEmpty() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.unmap(5);
		assertTrue(table.isEmpty());
	}
	
	/**
	 * Asserts that the size is 0 upon creation.
	 */
	@Test
	public void sizeIsZeroUponCreation() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the size is correct after mapping a key.
	 */
	@Test
	public void sizeIsOneAfterMappingKey() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		assertEquals(1, table.size());
	}
	
	/**
	 * Asserts that the size is zero after last key is unmapped from the table.
	 */
	@Test
	public void sizeIsZeroAfterTableBecomesEmpty() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.unmap(5);
		assertEquals(0, table.size());
	}
	
	/**
	 * Asserts that the empty flag and size are correctly reset when table is cleared.
	 */
	@Test
	public void emptyFlagFalseSizeZeroAfterTableIsCleared() {
		HashTableLinearProbe<Integer, String> table = new HashTableLinearProbe<Integer, String>();
		table.map(5, "A");
		table.clear();
		assertTrue(table.isEmpty());
		assertEquals(0, table.size());
	}
	
	
}
