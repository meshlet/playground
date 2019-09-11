package com.toptalprep;

import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for the Stack class.
 */
public class StackTest {
	/**
	 * Asserts that empty and full flags are correct for a newly created stack.
	 */
	@Test
	public void newStackHasCorrectEmptyAndFullFlags() {
		Stack s = new Stack(10);
		assertTrue(s.isEmpty());
		assertFalse(s.isFull());
	}
	
	/**
	 * Asserts that empty and full flags are correct for a stack that is neither
	 * empty nor full.
	 */
	@Test
	public void nonEmptyNonFullStackHasCorrectEmptyAndFullFlags() {
		Stack s = new Stack(10);
		s.push(34);
		assertFalse(s.isEmpty());
		assertFalse(s.isFull());
	}
	
	/**
	 * Asserts that empty and full flags are correct for a full stack.
	 */
	@Test
	public void fullStackHasCorrectEmptyAndFullFlags() {
		Stack s = new Stack(5);
		s.push(5);
		s.push(-12);
		s.push(0);
		s.push(100);
		s.push(-1);
		assertFalse(s.isEmpty());
		assertTrue(s.isFull());
	}
	
	/**
	 * Asserts that the stack has correct empty and full flags after it
	 * becomes empty.
	 */
	@Test
	public void emptyAndFullFlagsAreCorectAfterStackBecomesEmpty() {
		Stack s = new Stack(5);
		s.push(7);
		s.pop();
		assertTrue(s.isEmpty());
		assertFalse(s.isFull());
	}
}
