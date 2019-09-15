package com.toptalprep;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for the Queue class.
 */
public class ImprovedQueueTest {
    /**
     * Asserts that empty and full flags are correctly set for a
     * newly created queue.
     */
    @Test
    public void newQueueHasCorrectEmptyAndFullFlags() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(5, Integer.class);
        assertTrue(queue.isEmpty());
        assertFalse(queue.isFull());
    }

    /**
     * Asserts that empty and full flags are correctly set for a
     * queue that is neither full nor empty.
     */
    @Test
    public void nonEmptyNonFullQueueHasCorrectEmptyAndFullFlags() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(5, Integer.class);
        queue.enqueue(5);
        assertFalse(queue.isEmpty());
        assertFalse(queue.isFull());
    }

    /**
     * Asserts that empty and full flags are correctly set for a
     * full queue.
     */
    @Test
    public void fullQueueHasCorrectEmptyAndFullFlags() {
        int capacity = 5;
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(capacity, Integer.class);
        for (int i = 0; i < capacity; ++i) {
            queue.enqueue(i);
        }
        assertFalse(queue.isEmpty());
        assertTrue(queue.isFull());
    }

    /**
     * Asserts that empty and full flags are correctly set after the
     * queue becomes empty.
     */
    @Test
    public void emptyAndFullFlagsAreCorectAfterQueueBecomesEmpty() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(5, Integer.class);
        queue.enqueue(5);
        queue.dequeue();
        assertTrue(queue.isEmpty());
        assertFalse(queue.isFull());
    }

    /**
     * Asserts that an exception is thrown if enqueue is called on an full
     * queue.
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void exceptionThrownOnEnqueueToFullQueue() {
        int capacity = 5;
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(capacity, Integer.class);
        for (int i = 0; i < capacity; ++i) {
            queue.enqueue(i);
        }

        // Queue should be full at this point
        assertTrue(queue.isFull());
        queue.enqueue(-45);
    }

    /**
     * Asserts that an exception is thrown if dequeue is called on an empty
     * queue.
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void exceptionThrownOnDequeueFromEmptyQueue() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(5, Integer.class);
        queue.dequeue();
    }

    /**
     * Asserts that an exception is thrown if peak is called on an empty
     * queue.
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void exceptionThrownOnPeakOnEmptyQueue() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(5, Integer.class);
        queue.peak();
    }

    /**
     * Tests common queue operations.
     */
    @Test
    public void exerciseQueueOperation() {
        ImprovedQueue<Integer> queue = new ImprovedQueue<>(10, Integer.class);
        queue.enqueue(4);
        queue.enqueue(-1);
        queue.enqueue(2);

        assertEquals(queue.size(), 3);
        assertEquals(queue.peak().intValue(), 4);
        assertEquals(queue.dequeue().intValue(), 4);
        assertEquals(queue.peak().intValue(), -1);
        assertEquals(queue.size(), 2);

        queue.enqueue(2);
        queue.enqueue(0);
        queue.enqueue(-9);

        assertEquals(queue.size(), 5);
        assertEquals(queue.dequeue().intValue(), -1);
        assertEquals(queue.peak().intValue(), 2);
        assertEquals(queue.dequeue().intValue(), 2);
        assertEquals(queue.peak().intValue(), 2);
        assertEquals(queue.dequeue().intValue(), 2);
        assertEquals(queue.peak().intValue(), 0);
        assertEquals(queue.dequeue().intValue(), 0);
        assertEquals(queue.peak().intValue(), -9);
        assertEquals(queue.dequeue().intValue(), -9);
        assertTrue(queue.isEmpty());
        assertEquals(queue.size(), 0);

        queue.enqueue(0);
        queue.enqueue(-5);
        queue.enqueue(8);

        assertEquals(queue.size(), 3);
        assertEquals(queue.peak().intValue(), 0);

        queue.enqueue(-3);
        queue.enqueue(10);

        assertEquals(queue.size(), 5);
        assertEquals(queue.dequeue().intValue(), 0);
        assertEquals(queue.peak().intValue(), -5);
        assertEquals(queue.dequeue().intValue(), -5);
        assertEquals(queue.peak().intValue(), 8);
        assertEquals(queue.dequeue().intValue(), 8);
        assertEquals(queue.peak().intValue(), -3);
        assertEquals(queue.dequeue().intValue(), -3);
        assertEquals(queue.peak().intValue(), 10);
        assertEquals(queue.size(), 1);

        queue.enqueue(-1);
        queue.enqueue(1);
        queue.enqueue(2);
        queue.enqueue(5);
        queue.enqueue(7);
        queue.enqueue(10);
        queue.enqueue(0);
        queue.enqueue(9);
        queue.enqueue(11);

        assertTrue(queue.isFull());
        assertEquals(queue.size(), 10);
    }
}
