package com.toptalprep;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

/**
 * Unit tests for the PriorityQueue.
 */
public class PriorityQueueTest {
    /**
     * Asserts that empty and full flags are correctly set for a
     * newly created queue.
     */
    @Test
    public void newQueueHasCorrectEmptyAndFullFlags() {
        PriorityQueue<Integer> queue = new PriorityQueue<>(5, Integer.class);
        assertTrue(queue.isEmpty());
        assertFalse(queue.isFull());
    }

    /**
     * Asserts that empty and full flags are correctly set for a
     * queue that is neither full nor empty.
     */
    @Test
    public void nonEmptyNonFullQueueHasCorrectEmptyAndFullFlags() {
        PriorityQueue<Integer> queue = new PriorityQueue<>(5, Integer.class);
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
        PriorityQueue<Integer> queue = new PriorityQueue<>(capacity, Integer.class);
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
        PriorityQueue<Integer> queue = new PriorityQueue<>(5, Integer.class);
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
        PriorityQueue<Integer> queue = new PriorityQueue<>(capacity, Integer.class);
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
        PriorityQueue<Integer> queue = new PriorityQueue<>(5, Integer.class);
        queue.dequeue();
    }

    /**
     * Asserts that an exception is thrown if peak is called on an empty
     * queue.
     */
    @Test(expected = IndexOutOfBoundsException.class)
    public void exceptionThrownOnPeakOnEmptyQueue() {
        PriorityQueue<Integer> queue = new PriorityQueue<>(5, Integer.class);
        queue.peak();
    }

    /**
     * Tests common queue operations.
     */
    @Test
    public void exerciseQueueOperation() {
        PriorityQueue<Integer> queue = new PriorityQueue<>(10, Integer.class);
        queue.enqueue(0);

        assertEquals(0, queue.peak().intValue());
        assertEquals(1, queue.size());
        assertEquals(0, queue.dequeue().intValue());
        assertTrue(queue.isEmpty());

        queue.enqueue(5);
        queue.enqueue(-3);
        queue.enqueue(15);
        queue.enqueue(-7);
        queue.enqueue(80);

        assertEquals(5, queue.size());
        assertEquals(-7, queue.peak().intValue());
        assertEquals(-7, queue.dequeue().intValue());
        assertEquals(4, queue.size());
        assertEquals(-3, queue.peak().intValue());
        assertEquals(-3, queue.dequeue().intValue());
        assertEquals(3, queue.size());

        queue.enqueue(-20);
        queue.enqueue(100);

        assertEquals(5, queue.size());
        assertEquals(-20, queue.peak().intValue());

        queue.enqueue(105);
        queue.enqueue(120);
        queue.enqueue(150);

        // Try inserting values already in the queue (the size and
        // content of the queue should be unaffected
        queue.enqueue(-20);
        assertEquals(8, queue.size());
        queue.enqueue(105);
        assertEquals(8, queue.size());
        queue.enqueue(150);
        assertEquals(8, queue.size());

        assertEquals(8, queue.size());
        assertEquals(-20, queue.peak().intValue());
        assertEquals(-20, queue.dequeue().intValue());
        assertEquals(7, queue.size());
        assertEquals(5, queue.peak().intValue());
        assertEquals(5, queue.dequeue().intValue());
        assertEquals(6, queue.size());
        assertEquals(15, queue.peak().intValue());

        queue.enqueue(130);

        assertEquals(7, queue.size());
        assertEquals(15, queue.peak().intValue());

        queue.enqueue(0);
        queue.enqueue(101);
        queue.enqueue(50);

        assertEquals(10, queue.size());
        assertTrue(queue.isFull());
        assertEquals(0, queue.peak().intValue());
        assertEquals(0, queue.dequeue().intValue());
        assertEquals(9, queue.size());
        assertEquals(15, queue.peak().intValue());
        assertEquals(15, queue.dequeue().intValue());
        assertEquals(8, queue.size());
        assertEquals(50, queue.peak().intValue());
        assertEquals(50, queue.dequeue().intValue());
        assertEquals(7, queue.size());
        assertEquals(80, queue.peak().intValue());
        assertEquals(80, queue.dequeue().intValue());
        assertEquals(6, queue.size());
        assertEquals(100, queue.peak().intValue());
        assertEquals(100, queue.dequeue().intValue());
        assertEquals(5, queue.size());
        assertEquals(101, queue.peak().intValue());
        assertEquals(101, queue.dequeue().intValue());
        assertEquals(4, queue.size());
        assertEquals(105, queue.peak().intValue());
        assertEquals(105, queue.dequeue().intValue());
        assertEquals(3, queue.size());
        assertEquals(120, queue.peak().intValue());
        assertEquals(120, queue.dequeue().intValue());
        assertEquals(2, queue.size());
        assertEquals(130, queue.peak().intValue());
        assertEquals(130, queue.dequeue().intValue());
        assertEquals(1, queue.size());
        assertEquals(150, queue.peak().intValue());
        assertEquals(150, queue.dequeue().intValue());
        assertEquals(0, queue.size());
        assertTrue(queue.isEmpty());
    }
}
