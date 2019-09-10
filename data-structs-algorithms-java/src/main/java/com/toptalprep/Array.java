package com.toptalprep;

import java.util.Iterator;

public class Array implements Iterable<Long> {
    private int m_length;
    private long[] m_data;

    public Array(int capacity)
    {
        m_length = 0;
        m_data = new long[capacity];
    }

    public boolean find(long value)
    {
        boolean found = false;
        for (int i = 0; i < m_length; ++i)
        {
            if (m_data[i] == value)
            {
                found = true;
                break;
            }
        }
        return found;
    }

    public void insert(long value)
    {
        m_data[m_length++] = value;
    }

    public void delete(long value)
    {
        int shift_amount = 0;
        for (int i = 0; i < m_length; ++i)
        {
            if (m_data[i] == value)
            {
                // Increment the number of places elements need to be
                // shifted to the left
                ++shift_amount;
            }
            else if (shift_amount > 0)
            {
                // Move the element by shift_amount places to the left
                m_data[i - shift_amount] = m_data[i];
            }
        }
        m_length -= shift_amount;
    }

    public int length()
    {
        return m_length;
    }

    public Iterator<Long> iterator() {
        return new ArrayIterator(this);
    }

    private class ArrayIterator implements Iterator<Long> {
        int m_index;
        Array m_array;

        public ArrayIterator(Array array)
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
