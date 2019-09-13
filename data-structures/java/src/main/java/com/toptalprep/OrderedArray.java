package com.toptalprep;

import java.util.Iterator;

public class OrderedArray implements Iterable<Long> {
    private int m_length;
    private long[] m_data;

    public OrderedArray(int capacity){
        m_length = 0;
        m_data = new long[capacity];
    }

    /**
     * @brief Insert new value into the array
     *
     * Uses binary search to find the index where the insert should happen.
     * If value is already present in the array, the value is not inserted.
     * @param value
     */
    public void insert(long value) {
        int lower_bound = 0;
        int upper_bound = m_length - 1;
        int index = 0;

        while (true) {
            if (lower_bound > upper_bound) {
                // Element not in the array, lower_bound points to the index
                // where it should be inserted
                index = lower_bound;
                break;
            }

            int guess = (lower_bound + upper_bound) / 2;
            if (m_data[guess] == value) {
                // Element already in the array
                index = -1;
                break;
            }
            else if (m_data[guess] < value) {
                lower_bound = guess + 1;
            }
            else {
                upper_bound = guess - 1;
            }
        }

        if (index != -1) {
            assert m_length < m_data.length;

            // Move all elements starting from 'index' one place to the right
            for (int i = m_length - 1; i >= index; --i) {
                m_data[i + 1] = m_data[i];
            }

            // Place the new element at 'index' and increment array length
            m_data[index] = value;
            ++m_length;
        }
    }

    /**
     * Uses binary search to find an element and returns its index
     * or -1 if not found
     */
    public int find(long value) {
        int lower_bound = 0;
        int upper_bound = m_length - 1;
        int index = -1;

        while (lower_bound <= upper_bound) {
            int guess = (lower_bound + upper_bound) / 2;
            if (m_data[guess] == value) {
                index = guess;
                break;
            }
            else if (m_data[guess] < value) {
                lower_bound = guess + 1;
            }
            else {
                upper_bound = guess - 1;
            }
        }
        return index;
    }

    /**
     * @brief Deletes the value from the array.
     *
     * Uses @ref find() to locate the value and deletes it by moving all
     * elements to the right of value by one place left.
     *
     * @param value
     */
    public void delete(long value) {
        int index = find(value);
        if (index != -1) {
            for (int i = index + 1; i < m_length; ++i) {
                m_data[i - 1] = m_data[i];
            }

            --m_length;
        }
    }

    public int getLength() {
        return m_length;
    }

    public Iterator<Long> iterator() {
        return new OrderedArrayIterator(this);
    }

    private class OrderedArrayIterator implements Iterator<Long> {
        int m_index;
        OrderedArray m_array;

        public OrderedArrayIterator(OrderedArray array)
        {
            m_index = 0;
            m_array = array;
        }

        @Override
        public boolean hasNext() {
            return m_index < m_array.m_length;
        }

        @Override
        public Long next() {
            return m_array.m_data[m_index++];
        }
    }
}
