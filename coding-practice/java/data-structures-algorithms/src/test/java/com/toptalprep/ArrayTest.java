package com.toptalprep;

import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Unit tests for the Array class.
 */
public class ArrayTest 
{
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
}
