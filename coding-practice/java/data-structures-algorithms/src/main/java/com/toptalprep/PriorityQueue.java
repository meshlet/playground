package com.toptalprep;

import java.lang.reflect.Array;

/**
 * @TODO Re-implement this class. As elements are sorted in the
 * queue, there's no need to have HEAD and TAIL pointers. If
 * the smallest elements is always kept at SIZE-1, then dequeue
 * operation is simply --SIZE. The enqueue operation will find
 * the place for the new value by shifting all bigger values to
 * the right. The new HEAD (the smallest value) will again be at
 * SIZE-1.
 */

/**
 * Implements the priority queue via a circular (ring) buffer.
 *
 * The items are kept sorted in the queue in ascending order. The
 * user must make sure that type T implements the java.lang.Comparable
 * interface.
 */
public class PriorityQueue<T extends Comparable<T>> {
	int m_head;
	int m_tail;
	int m_size;
	T[] m_queue_array;
	
	public PriorityQueue(int capacity, Class<T> cls) {
		m_head = m_tail = m_size = 0;
		m_queue_array = (T[]) Array.newInstance(cls, capacity);
	}
	
	public void enqueue(T value) throws IndexOutOfBoundsException {
		if (m_size == m_queue_array.length) {
			throw new IndexOutOfBoundsException();
		}

		// Handle the special case of an empty queue
		if (m_size == 0) {
			m_queue_array[m_tail] = value;
			m_tail = (m_tail + 1) % m_queue_array.length;
			m_size = 1;
			return;
		}

		// index will point to the array entry right before the place where
		// insertion needs to happen
		int index = (m_tail == 0) ? m_queue_array.length - 1 : m_tail - 1;
		for (int i = 0; i < m_size; ++i) {
			if (value.compareTo(m_queue_array[index]) == 0) {
				// Value already in the queue
				index = -1;
				break;
			}
			else if (value.compareTo(m_queue_array[index]) < 0) {
				// Move current element one place to the right (and wrap if needed)
				m_queue_array[(index + 1) % m_queue_array.length] = m_queue_array[index];
				index = (index == 0) ? m_queue_array.length - 1 : index - 1;
			}
			else {
				// Found the entry after which the insertion needs to happen
				break;
			}
		}

		if (index != -1) {
			m_queue_array[(index + 1) % m_queue_array.length] = value;
			m_tail = (m_tail + 1) % m_queue_array.length;
			++m_size;
		}
	}

	public T dequeue() throws IndexOutOfBoundsException {
		if (m_size == 0) {
			throw new IndexOutOfBoundsException();
		}

		T value = m_queue_array[m_head];
		m_head = (m_head + 1) % m_queue_array.length;
		--m_size;
		return value;
	}

	public T peak() throws IndexOutOfBoundsException {
		if (m_size == 0) {
			throw new IndexOutOfBoundsException();
		}

		return m_queue_array[m_head];
	}

	public boolean isEmpty() { return m_size == 0; }

	public boolean isFull() { return m_size == m_queue_array.length; }

	public int size() { return m_size; }
}
