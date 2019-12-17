package com.toptalprep;

import static org.junit.Assert.*;

import java.util.Arrays;

import org.junit.Test;

/**
 * Unit tests for the SinglyLinkedList class.
 */
public class SinglyLinkedListTest {
	/**
     * Asserts that an empty list has correctly set empty flag.
     */
    @Test
    public void emptyFlagTrueInEmptyLinkedList()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        assertTrue(list.isEmpty());
    }

    /**
     * Asserts that a non-empty list has correctly set empty flag.
     */        
    @Test
    public void emptyFlagFalseInNonEmptyLinkedList()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        list.pushBack(4);
        assertFalse(list.isEmpty());
    }

    /**
     * Exercises the pushFront method.
     */
    @Test
    public void testPushFront()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        Integer[] values = { -5, 3, 1, 4, 4, 18, -20, 7, 12 };

        // Push all items from 'values' to the list with PushFront
        for (Integer i : values)
        {
            list.pushFront(i);
        }

        // Iterate through the list and verify that elements are
        // exactly in reversed order compared to 'values' array
        assertEquals(values.length, list.size());
        int index = values.length - 1;

        for (Integer i : list)
        {
            assertEquals(values[index--], i);
        }
    }

    /**
     * Exercises the pushBack method.
     */
    @Test
    public void testPushBack()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        Integer[] values = { -5, 3, 1, 4, 4, 18, -20, 7, 12 };

        // Push all items from 'values' to the list with PushBack
        for (Integer i : values)
        {
            list.pushBack(i);
        }

        // Iterate through the list and verify that elements are
        // in the same order as in 'values' array
        assertEquals(values.length, list.size());
        int index = 0;

        for (Integer i : list)
        {
            assertEquals(values[index++], i);
        }
    }
    
    /**
     * Exercises the contains method.
     */
    @Test
    public void testContains() {
    	class TestVector {
    		Integer[] m_values_to_insert;
    		Integer[] m_values_to_search_for;
    		boolean[] m_expected_lookup_results;
    		
    		public TestVector(Integer[] values_to_insert, Integer[] values_to_search_for, boolean[] expected_lookup_results) {
    			m_values_to_insert = values_to_insert;
    			m_values_to_search_for = values_to_search_for;
    			m_expected_lookup_results = expected_lookup_results;
    		}
    	}
    	
    	TestVector[] test_vectors = {
    			new TestVector(
    					new Integer[] { },
    					new Integer[] { 1, -2, 33, 44, -7, 9 },
    					new boolean[] { false, false, false, false, false, false }),
    			
    			new TestVector(
    					new Integer[] { 5 },
    					new Integer[] { 4, -9, 0, 1, 5, 4, 5, 6, 7, 3, 5 },
    					new boolean[] { false, false, false, false, true, false, true, false, false, false, true }),
    			
    			new TestVector(
    					new Integer[] { 4, 0, -45, 1, 1, 9, 4, 0, 87, 32, -4, 1, 100, 73, 97 },
    					new Integer[] { 4, 97, 888, -45, 4, 9, 32, 87, 99, 0, 1, 73, 77 },
    					new boolean[] { true, true, false, true, true, true, true, true, false, true, true, true, false })
    	};
    	
    	for (TestVector test_vector : test_vectors)
    	{
    		SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();

    		// Populate the list
    		for (Integer value : test_vector.m_values_to_insert)
    		{
    			list.pushBack(value);
    		}

    		// Sanity check
    		assertEquals(test_vector.m_values_to_search_for.length, test_vector.m_expected_lookup_results.length);
    		
    		// Verify that lookup results are as expected
    		int index = 0;
    		for (Integer value : test_vector.m_values_to_search_for) {
    			assertEquals(test_vector.m_expected_lookup_results[index++], list.contains(value));
    		}
    	}
    }

    /**
     * Asserts that exception is thrown if PopFront is called on
     * an empty list
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void popFrontThrowsIfCalledOnEmptyList()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        list.popFront();
    }

    /**
     * Asserts that exception is thrown if popBack is called on
     * an empty list
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void popBackThrowsIfCalledOnEmptyList()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        list.popBack();
    }

    /**
     * Asserts that exception is thrown if peakFront is called on
     * an empty list
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void PeakFrontThrowsIfCalledOnEmptyList()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        list.peakFront();
    }

    /**
     * Tests the popFront method.
     */
    @Test
    public void TestPopFront()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        Integer[] values = { -4, 3, 5, -6, 3, 5, -20, 0 };

        // Push the items from 'values' array to the list
        for (Integer val : values)
        {
            list.pushBack(val);
        }

        // Repeatedly call PopFront until list gets empty
        int i = 0;
        int expected_size = values.length;
        while (!list.isEmpty())
        {
            assertEquals(expected_size--, list.size());
            assertEquals(values[i++], list.popFront());
        }
    }

    /**
     * Tests the popBack method.
     */
    @Test
    public void TestPopBack()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
        Integer[] values = { -4, 3, 5, -6, 3, 5, -20, 0 };

        // Push the items from 'values' array to the list
        for (Integer val : values)
        {
            list.pushBack(val);
        }

        // Repeatedly call popBack until list gets empty
        int i = values.length - 1;
        int expected_size = values.length;
        while (!list.isEmpty())
        {
            assertEquals(expected_size--, list.size());
            assertEquals(values[i--], list.popBack());
        }
    }
    
    
    /**
     * Exercises the remove method.
     */
    @Test
    public void testRemove() {
    	class TestVector {
    		Integer[] m_values_to_insert;
    		Integer[] m_values_to_remove;
    		Integer[] m_expected_values_after_remove;
    		boolean[] m_expected_return_values;
    		
    		public TestVector(
    				Integer[] values_to_insert,
    				Integer[] values_to_remove,
    				Integer[] expected_values_after_remove,
    				boolean[] expected_return_values) {
    			
    			m_values_to_insert = values_to_insert;
    			m_values_to_remove = values_to_remove;
    			m_expected_values_after_remove = expected_values_after_remove;
    			m_expected_return_values = expected_return_values;
    		}
    	}
    	
    	TestVector[] test_vectors = {
    			new TestVector(
    					new Integer[] { }, 
    					new Integer[] { 4, -10, 100, 56, -45 },
    					new Integer[] { },
    					new boolean[] { false, false, false, false, false }),
    			
    			new TestVector(
    					new Integer[] { 10 },
    					new Integer[] { 45, -1, 0, 98, 10, -10, 34 },
    					new Integer[] { },
    					new boolean[] { false, false, false, false, true, false, false }),
    			
    			new TestVector(
    					new Integer[] { 10, -45, 1, 0, 23, -3, 46, 45, 1000, 6, -7, 734 },
    					new Integer[] { 1000, -3, 8, 10, 45, 46, 0, 1 },
    					new Integer[] { -45, 23, 6, -7, 734 },
    					new boolean[] { true, true, false, true, true, true, true, true }),
    			
    			new TestVector(
    					new Integer[] { -100, 5, 3, -94, 90, 11, -15, 58, 90, -17, 92, 83 },
    					new Integer[] { 83, -100, 5, 92, -17, 3, -94, 90, 58, 90, 11, -15 },
    					new Integer[] { },
    					new boolean[] { true, true, true, true, true, true, true, true, true, true, true, true })
    	};
    	
    	for (TestVector test_vector : test_vectors)
    	{
    		SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();

    		// Populate the list
    		for (Integer value : test_vector.m_values_to_insert)
    		{
    			list.pushBack(value);
    		}

    		// Sanity check
    		assertEquals(test_vector.m_values_to_remove.length, test_vector.m_expected_return_values.length);
    		
    		// Remove the values from the list
    		int index = 0;
    		for (Integer value : test_vector.m_values_to_remove) {
    			assertEquals(test_vector.m_expected_return_values[index++], list.remove(value));
    		}    		
    		
    		// Verify that the contents of the list is as expected
    		assertEquals(test_vector.m_expected_values_after_remove.length, list.size());
    		index = 0;
    		for (Integer value : list)
    		{
    			assertEquals(test_vector.m_expected_values_after_remove[index++], value);
    		}
    	}
    }
    
    /**
     * Exercises the removeAll method.
     */
    @Test
    public void testRemoveAll() {
    	class TestVector {
    		Integer[] m_values_to_insert;
    		Integer[] m_values_to_remove;
    		Integer[] m_expected_values_after_remove;
    		boolean m_expected_return_value;
    		
    		public TestVector(
    				Integer[] values_to_insert,
    				Integer[] values_to_remove,
    				Integer[] expected_values_after_remove,
    				boolean expected_return_value) {
    			
    			m_values_to_insert = values_to_insert;
    			m_values_to_remove = values_to_remove;
    			m_expected_values_after_remove = expected_values_after_remove;
    			m_expected_return_value = expected_return_value;
    		}
    	}
    	
    	TestVector[] test_vectors = {
    			new TestVector(
    					new Integer[] { }, 
    					new Integer[] { 4, -10, 100, 56, -45 },
    					new Integer[] { },
    					false),
    			
    			new TestVector(
    					new Integer[] { 10 },
    					new Integer[] { 45, -1, 0, 98, 10, -10, 34 },
    					new Integer[] { },
    					true),
    			
    			new TestVector(
    					new Integer[] { 10, -45, 1, 0, 23, -3, 46, 45, 1000, 6, -7, 734 },
    					new Integer[] { 1000, -3, 8, 10, 45, 46, 0, 1 },
    					new Integer[] { -45, 23, 6, -7, 734 },
    					true),
    			
    			new TestVector(
    					new Integer[] { -100, 5, 3, -94, 90, 11, -15, 58, 90, -17, 92, 83 },
    					new Integer[] { 83, -100, 5, 92, -17, 3, -94, 90, 58, 90, 11, -15 },
    					new Integer[] { },
    					true),
    			
    			new TestVector(
    					new Integer[] { 1, 8, 10, -45, 3, 100, 93, -17, 19, 29 },
    					new Integer[] { -1, -8, -10, 45, -3, -100, -93, 17, -19, -29 },
    					new Integer[] { 1, 8, 10, -45, 3, 100, 93, -17, 19, 29 },
    					false)
    	};
    	
    	for (TestVector test_vector : test_vectors)
    	{
    		SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();

    		// Populate the list
    		for (Integer value : test_vector.m_values_to_insert)
    		{
    			list.pushBack(value);
    		}

    		// Remove the values from the list
    		assertEquals(test_vector.m_expected_return_value, list.removeAll(Arrays.asList(test_vector.m_values_to_remove)));

    		// Verify that the contents of the list is as expected
    		assertEquals(test_vector.m_expected_values_after_remove.length, list.size());
    		int index = 0;
    		for (Integer value : list)
    		{
    			assertEquals(test_vector.m_expected_values_after_remove[index++], value);
    		}
    	}
    }
    
    /**
     * Exercises the removeIf method.
     */
    @Test
    public void testRemoveIf()
    {
    	class TestVector {
    		Integer[] m_values_to_insert;
    		Integer[] m_values_after_remove;
    		Integer m_value_to_remove;
    		boolean m_expected_return_value;
    		
    		public TestVector(Integer[] values_to_insert,
    				Integer[] values_after_remove,
    				Integer value_to_remove,
    				boolean expected_return_value) {
    			
    			m_values_to_insert = values_to_insert;
    			m_values_after_remove = values_after_remove;
    			m_value_to_remove = value_to_remove;
    			m_expected_return_value = expected_return_value;
    		}
    	}
    	
    	TestVector[] test_vectors = {
    			new TestVector(
    					new Integer[] { }, 
    					new Integer[] { },
    					5,
    					false),
    			
    			new TestVector(
    					new Integer[] { -2, 9, 0 },
    					new Integer[] { -2, 9, 0 },
    					6,
    					false),
    			
    			new TestVector(
    					new Integer[] { 6 },
    					new Integer[] { },
    					6,
    					true),
    			
    			new TestVector(
    					new Integer[] { -2, 5, 0 },
    					new Integer[] { -2, 0 },
    					5,
    					true),
    			
    			new TestVector(
    					new Integer[] { 4, 4, 4, 4, 4 },
    					new Integer[] { },
    					4,
    					true),
    			
    			new TestVector(
    					new Integer[] { -3, 5, 6, 7, -3 },
    					new Integer[] { 5, 6, 7 },
    					-3,
    					true),
    			
    			new TestVector(
    					new Integer[] { 10, 2, 5, 6, 2, 2, 2 },
    					new Integer[] { 10, 5, 6 },
    					2,
    					true),
    			
    			new TestVector(
    					new Integer[] { -1, 0, 0, 5, -1, 9 },
    					new Integer[] { 0, 0, 5, 9 },
    					-1,
    					true),
    			
    			new TestVector(
    					new Integer[] { 1, 1, 2, 3, 4, 5, -1, 4, 5 },
    					new Integer[] { 1, 1, 2, 3, 4, 5, -1, 4, 5 },
    					10,
    					false)
    	};

    	for (TestVector test_vector : test_vectors)
    	{
    		SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();

    		// Populate the list
    		for (Integer value : test_vector.m_values_to_insert)
    		{
    			list.pushBack(value);
    		}

    		// Remove all the occurrences of the value from the list
    		assertEquals(
    				test_vector.m_expected_return_value,
    				list.removeIf(value -> value.equals(test_vector.m_value_to_remove)));

    		// Verify that the contents of the list is as expected
    		assertEquals(test_vector.m_values_after_remove.length, list.size());
    		int index = 0;
    		for (Integer value : list)
    		{
    			assertEquals(test_vector.m_values_after_remove[index++], value);
    		}
    	}
    }

    /**
     * Tests the clear method.
     */
    @Test
    public void testClear()
    {
    	SinglyLinkedList<Integer> list = new SinglyLinkedList<Integer>();
    	list.pushBack(5);
    	list.pushBack(-4);
    	list.clear();
    	assertEquals(0, list.size());
    	assertTrue(list.isEmpty());
    }
}
