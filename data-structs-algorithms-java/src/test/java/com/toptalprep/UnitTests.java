package com.toptalprep;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Unit tests for the data structures.
 */
public class UnitTests 
{
    /**
     * Tests the Array class.
     */
    @Test
    public void testArray()
    {
        long[] native_array = new long[10];
        Array arr = new Array(10);
        for (int i = 0; i < native_array.length; ++i)
        {
            native_array[i] = i * 5;
            arr.insert(native_array[i]);
        }

        int i = 0;
        for (Long value: arr)
        {
            assertTrue(value.longValue() == native_array[i++]);
        }
        assertTrue(arr.length() == native_array.length);

        Array arr2 = new Array(10);
        arr2.insert(3);
        arr2.insert(4);
        arr2.insert(-1);
        arr2.insert(3);
        arr2.insert(5);
        arr2.insert(3);
        arr2.insert(3);
        arr2.insert(8);
        long[] native_array2 = { 4, -1, 5, 8 };

        arr2.delete(3);
        i = 0;
        assertTrue(arr2.length() == native_array2.length);
        for (Long value: arr2)
        {
            assertTrue(value.longValue() == native_array2[i++]);
        }
    }
    
    /**
     * Tests the OrderedArray class.
     */
    @Test
    public void testOrderedArray() {
        OrderedArray array = new OrderedArray(100);
        assertTrue(array.getLength() == 0);

        array.insert(-20);
        assertTrue(array.getLength() == 1);
        long[] native_array = { -20 };
        int i = 0;
        for (Long value: array) {
            assertTrue(value == native_array[i++]);
        }

        array.delete(-20);
        assertTrue(array.getLength() == 0);

        array.insert(-30);
        array.insert(-50);
        array.insert(4);
        array.insert(-21);
        array.insert(6);
        array.insert(10);
        array.insert(0);
        array.insert(-1);
        array.insert(-5);
        array.insert(14);
        array.insert(7);
        assertTrue(array.getLength() == 11);
        long[] native_array_2 = { -50, -30, -21, -5, -1, 0, 4, 6, 7, 10, 14 };
        i = 0;
        for (Long value: array) {
            assertTrue(value == native_array_2[i++]);
        }

        array.delete(1);
        array.delete(5);
        assertTrue(array.getLength() == 11);
        i = 0;
        for (Long value: array) {
            assertTrue(value == native_array_2[i++]);
        }

        array.delete(-50);
        array.delete(14);
        array.delete(0);
        assertTrue(array.getLength() == 8);
        long[] native_array_3 = { -30, -21, -5, -1, 4, 6, 7, 10 };
        i = 0;
        for (Long value: array) {
            assertTrue(value == native_array_3[i++]);
        }
    }
}
