package com.toptalprep;

import java.lang.reflect.Array;

public class PriorityQueue<T> {
	int m_head;
	int m_tail;
	int m_size;
	int m_capacity;
	T[] m_queue_array;
	
	public PriorityQueue(int capacity, Class<T> cls) {
		m_head = m_tail = m_size = 0;
		m_capacity = capacity;
		m_queue_array = (T[]) Array.newInstance(cls, capacity);
	}
	
	
}
