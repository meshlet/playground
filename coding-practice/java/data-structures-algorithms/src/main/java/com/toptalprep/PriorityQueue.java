package com.toptalprep;

import java.lang.reflect.Array;

/**
 * Implements the priority queue using an array.
 *
 * The items are kept sorted in the queue in the descending order, and
 * the HEAD is always assumed to be at index SIZE-1 (if queue is not empty),
 * while the TAIL is always at index 0. The enqueue operation will search
 * through the array and insert the value at an appropriate place, shifting
 * all smaller values to the right. The dequeue operation will simply return
 * the value at SIZE-1 and decrement SIZE. The user must make sure that type
 * T implements the java.lang.Comparable interface.
 */
public class PriorityQueue<T extends Comparable<T>> {
	int m_size;
	T[] m_queue_array;
	
	public PriorityQueue(int capacity, Class<T> cls) {
		m_size = 0;
		m_queue_array = (T[]) Array.newInstance(cls, capacity);
	}
	
	public void enqueue(T value) throws IndexOutOfBoundsException {
		if (m_size == m_queue_array.length) {
			throw new IndexOutOfBoundsException();
		}

		if (m_size == 0) {
			// If queue is empty insert the value at index 0
			m_queue_array[m_size++] = value;
		}
		else {
			// Otherwise, shift all values smaller than the new value one
			// place to the right
			int index = m_size - 1;
			for (; index >= 0; --index) {
				if (value.compareTo(m_queue_array[index]) > 0) {
					m_queue_array[index + 1] = m_queue_array[index];
				}
				else {
					// Found entry after which the new value should be inserted
					break;
				}
			}

			// Insert the new value into the queue and increment the size
			m_queue_array[index + 1] = value;
			++m_size;
		}
	}

	public T dequeue() throws IndexOutOfBoundsException {
		if (m_size == 0) {
			throw new IndexOutOfBoundsException();
		}

		T value = m_queue_array[m_size - 1];
		--m_size;
		return value;
	}

	public T peak() throws IndexOutOfBoundsException {
		if (m_size == 0) {
			throw new IndexOutOfBoundsException();
		}

		return m_queue_array[m_size - 1];
	}

	public boolean isEmpty() { return m_size == 0; }

	public boolean isFull() { return m_size == m_queue_array.length; }

	public int size() { return m_size; }
}
