package com.toptalprep;

import java.lang.reflect.Array;

/**
 * Implements the priority queue using an array.
 *
 * The items are kept sorted in the queue in the descending order, and
 * the HEAD is always assumed to be at index SIZE-1 (if queue is not empty),
 * while the TAIL is always at index 0. The enqueue operation will search
 * through the array and insert the value at an appropriate place, shifting
 * all smaller values to the right. If value is already present in the queue
 * it won't be inserted. The dequeue operation will simply return the value
 * at SIZE-1 and decrement SIZE. The user must make sure that type T implements
 * the java.lang.Comparable interface.
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


		// Variable 'index' will store index of an array entry after which the
		// new value should be inserted, or Integer.MAX_VALUE if value is already
		// in the queue
		int index = m_size - 1;
		for (; index >= 0; --index) {
			if (value.compareTo(m_queue_array[index]) == 0) {
				// Value already in the queue
				index = Integer.MAX_VALUE;
				break;
			}
			else if (value.compareTo(m_queue_array[index]) < 0) {
				// Found the entry after which the insertion needs to happen
				break;
			}
		}

		if (index != Integer.MAX_VALUE) {
			// Shift all values smaller than the new value one place to the right
			for (int i = m_size - 1; i >= index + 1; --i) {
				m_queue_array[i + 1] = m_queue_array[i];
			}

			// Assign the new value to its entry and increment queue size
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
