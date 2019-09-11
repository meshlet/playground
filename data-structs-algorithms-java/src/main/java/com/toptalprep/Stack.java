package com.toptalprep;

public class Stack {
	long[] m_stack_array;
	int m_top;
	
	public Stack(int max_size) {
		m_stack_array = new long[max_size];
		m_top = -1;
	}
	
	public void push(long value) throws IndexOutOfBoundsException {
		// Throw an exception if stack is full
		if (m_top == m_stack_array.length - 1) {
			throw new IndexOutOfBoundsException();
		}
		
		// Otherwise push the value to the stack
		m_stack_array[++m_top] = value;
	}
	
	public long pop() throws IndexOutOfBoundsException {
		// Throw an exception if stack is empty
		if (m_top == -1) {
			throw new IndexOutOfBoundsException();
		}
		
		// Otherwise pop the top of the stack
		return m_stack_array[m_top--];
	}
	
	public long peak() throws IndexOutOfBoundsException {
		// Throw an exception if stack is empty
		if (m_top == -1) {
			throw new IndexOutOfBoundsException();
		}
		
		// Otherwise return the top of the stack
		return m_stack_array[m_top];
	}
	
	public boolean isEmpty() {
		return m_top == -1;
	}
	
	public boolean isFull() {
		return m_top == m_stack_array.length - 1;
	}
}
