package com.toptalprep;

import java.lang.reflect.Array;

/**
 * Queue implemented as a circular (ring) buffer.
 *
 * @note The class has the m_size field used to decide whether queue
 * is full and empty. This fields needs to be updated on each enqueue
 * and dequeue operation which introduces a slight overhead. For queue
 * implementation that doesn't track the number of items in the queue
 * check ImprovedQueue.
 */
public class Queue<T> {
    int m_head;
    int m_tail;
    int m_size;
    int m_capacity;
    T[] m_queue_array;

    Queue(int capacity, Class<T> cls) {
        m_head = m_tail = m_size = 0;
        m_capacity = capacity;
        m_queue_array = (T[]) Array.newInstance(cls, capacity);
    }

    public void enqueue(T value) throws IndexOutOfBoundsException {
        if (m_size == m_capacity) {
            // Queue is full
            throw new IndexOutOfBoundsException();
        }

        m_queue_array[m_tail] = value;
        m_tail = (m_tail + 1) % m_capacity;
        ++m_size;
    }

    public T dequeue() throws IndexOutOfBoundsException {
        if (m_size == 0) {
            // Queue is empty
            throw new IndexOutOfBoundsException();
        }

        T value = m_queue_array[m_head];
        m_head = (m_head + 1) % m_capacity;
        --m_size;
        return value;
    }

    public T peak() throws IndexOutOfBoundsException {
        if (m_size == 0) {
            // Queue is empty
            throw new IndexOutOfBoundsException();
        }

        return m_queue_array[m_head];
    }

    public boolean isEmpty() { return m_size == 0; }

    public boolean isFull() { return m_size == m_capacity; }

    public int size() { return m_size; }
}
