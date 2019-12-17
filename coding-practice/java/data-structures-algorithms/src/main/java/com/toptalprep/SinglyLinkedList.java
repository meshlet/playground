package com.toptalprep;

import java.util.Collection;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.function.Predicate;

/**
 * A singly linked list implementation.
 */
public class SinglyLinkedList<T> implements Iterable<T> {
	private class Link
    {
        public Link(T value)
        {
            m_next = null;
            m_data = value;
        }

        Link m_next;
        T m_data;
    }
	
	private Link m_head;
	private int m_size;
	
	public SinglyLinkedList()
    {
        m_head = null;
        m_size = 0;
    }
	
	/**
	 * Whether list contains the specified value.
	 */
	public boolean contains(T value) {
		Link current = m_head;
		
		while (current != null) {
			if (current.m_data.equals(value)) {
				return true;
			}
			current = current.m_next;
		}
		return false;
	}
	
	/**
     * Inserts value to the beginning of the list.
     */
    public void pushFront(T value)
    {
        ++m_size;
        if (m_head == null)
        {
            m_head = new Link(value);
            return;
        }

        Link new_head = new Link(value);
        new_head.m_next = m_head;
        m_head = new_head;
    }
    
    /**
     * Appends value to the end of the list.
     */
    public void pushBack(T value)
    {
        ++m_size;
        if (m_head == null)
        {
            m_head = new Link(value);
            return;
        }

        Link link = m_head;
        while (link.m_next != null)
        {
            link = link.m_next;
        }

        link.m_next = new Link(value);
    }
    
    /**
     * Pops the link from the front of the list.
     */
    public T popFront() throws IndexOutOfBoundsException
    {
        if (m_head == null)
        {
            throw new IndexOutOfBoundsException("List is empty");
        }

        --m_size;
        T retval = m_head.m_data;
        m_head = m_head.m_next;
        return retval;
    }

    /**
     * Pops the link from the back of the list.
     */
    public T popBack() throws IndexOutOfBoundsException
    {
        if (m_head == null)
        {
            throw new IndexOutOfBoundsException("List is empty");
        }

        Link previous = null;
        Link current = m_head;

        while (current.m_next != null)
        {
            previous = current;
            current = current.m_next;
        }

        // Save the data from the link to be removed
        T retval = current.m_data;

        if (previous == null)
        {
            // The head is the only link in the list
            m_head = null;
        }
        else
        {
            previous.m_next = current.m_next;
        }

        --m_size;
        return retval;
    }
    
    /**
     * Removes the first occurrence of the value from the list.
     *
     * @param value  The value to remove.
     *
     * @return True if value has been removed, false otherwise.
     */
    public boolean remove(T value) {
    	Link previous = null;
    	Link current = m_head;
    	
    	while (current != null) {
    		if (current.m_data.equals(value)) {
    			if (previous == null) {
    				// Removing the head
    				m_head = m_head.m_next;
    			}
    			else {
    				previous.m_next = current.m_next;
    			}
    			--m_size;
    			return true;
    		}
    		previous = current;
    		current = current.m_next;
    	}
    	return false;
    }
    
    /**
     * Removes all of this list's elements that are also contained
     * in the specified collection.
     */
    public boolean removeAll(Collection<T> c)
    {
    	boolean any_elements_removed = false;
        for (T value : c) {
        	any_elements_removed |= remove(value);
        }
        return any_elements_removed;
    }
    
    /**
     * Remove all of the elements of this list that satisfy the given
     * predicate.
     */
    public boolean removeIf(Predicate<T> filter) {
    	Link previous = null;
        Link current = m_head;
        boolean any_elements_removed = false;

        while (current != null)
        {
            if (filter.test(current.m_data))
            {
                --m_size;
                any_elements_removed = true;
                if (current == m_head)
                {
                    // Move the head to the next link
                    current = m_head = current.m_next;
                }
                else
                {
                    previous.m_next = current = current.m_next;
                }
            }
            else
            {
                previous = current;
                current = current.m_next;
            }
        }
        return any_elements_removed;
    }

    /**
     * Returns the value stored in the head of the list without removing it.
     */
    public T peakFront() throws IndexOutOfBoundsException
    {
        if (m_head == null)
        {
            throw new IndexOutOfBoundsException("List is empty");
        }

        return m_head.m_data;
    }

    /**
     * Returns the size of the list.
     */
    public int size() {
    	return m_size;
    }
    
    /**
     * Clears the list.
     */
    public void clear()
    {
        m_head = null;
        m_size = 0;
    }

    /**
     * Whether list is empty or not.
     */
    public boolean isEmpty()
    {
        return m_head == null;
    }
    
    /**
     * Implementation of the Iterable interface.
     */
    public Iterator<T> iterator() {
    	return new SinglyLinkedListIterator(this);
    }
    
    /**
     * The iterator for the {@link SinglyLinkedList}.
     */
    private class SinglyLinkedListIterator implements Iterator<T> {
    	Link current_link;
    	
    	public SinglyLinkedListIterator(SinglyLinkedList<T> list) {
    		current_link = list.m_head;
    	}
    	
    	@Override
        public boolean hasNext() {
            return current_link != null;
        }

        @Override
        public T next() {
            if (current_link == null) {
            	throw new NoSuchElementException("Reached the end of the list");
            }
            
            T data = current_link.m_data;
            current_link = current_link.m_next;
            return data;
        }
    }
}
