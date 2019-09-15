package com.toptalprep;

import java.lang.reflect.Array;

/**
 * Implements queue using a circular (ring) buffer.
 *
 * @note Instead of tracking the number of items in the queue and use
 * that to decide whether the queue is full or empty, this implementation
 * allocates an additional entry in the underlying array buffer. When the
 * queue is full there will be one empty entry in the array (that is, HEAD
 * and TAIL won't be equal for the full queue). The size of the queue is
 * calculated differently if HEAD <= TAIL or HEAD > TAIL. If HEAD <= TAIL
 * the size is equal to TAIL - HEAD (note that for a full queue this will
 * be equal to the max size of the queue, and will be 0 for an empty queue).
 * If HEAD > TAIL the size is equal to HEAD + TAIL (which will be equal to
 * the max size for a full queue).
 */
public class ImprovedQueue<T> {
    private int m_head;
    private int m_tail;

    /**
     * The maximal number of items in the queue as specified by the user.
     */
    private int m_max_size;

    T[] m_queue_array;

    ImprovedQueue(int max_size, Class<T> cls) {
        m_head = m_tail = 0;
        m_max_size = max_size;
        m_queue_array = (T[]) Array.newInstance(cls, max_size + 1);
    }

    public void enqueue(T value) throws IndexOutOfBoundsException {
        if (isFull()) {
            throw new IndexOutOfBoundsException();
        }

        m_queue_array[m_tail] = value;
        m_tail = (m_tail + 1) % m_queue_array.length;
    }

    public T dequeue() throws IndexOutOfBoundsException {
        if (isEmpty()) {
            throw new IndexOutOfBoundsException();
        }

        T value = m_queue_array[m_head];
        m_head = (m_head + 1) % m_queue_array.length;
        return value;
    }

    public T peak() throws IndexOutOfBoundsException {
        if (isEmpty()) {
            throw new IndexOutOfBoundsException();
        }

        return m_queue_array[m_head];
    }

    public boolean isEmpty() { return m_head == m_tail; }

    public boolean isFull() { return (m_tail + 1 == m_head) || (m_head + m_max_size == m_tail); }

    public int size() {
        return (m_head <= m_tail) ? m_tail - m_head : m_queue_array.length - m_head + m_tail;
    }
}
