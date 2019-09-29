using System;
using NUnit.Framework;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
      * Unit tests for the QueueViaLinkedList class.
      */
    public class QueueViaLinkedListTest
    {
        /**
         * Asserts that empty flag is correctly set for a newly created queue.
         */
        [Test()]
        public void NewQueueHasCorrectEmptyFlag()
        {
            var queue = new QueueViaLinkedList<int>();
            Assert.True(queue.IsEmpty());
        }

        /**
         * Asserts that empty flag is correctly set for a queue that is not empty.
         */
        [Test()]
        public void NonEmptyQueueHasCorrectEmptyFlag()
        {
            var queue = new QueueViaLinkedList<int>();
            queue.Enqueue(5);
            Assert.False(queue.IsEmpty());
        }

        /**
         * Asserts that empty flag is correctly set after the queue becomes
         * empty.
         */
        [Test()]
        public void EmptyFlagIsCorectAfterQueueBecomesEmpty()
        {
            var queue = new QueueViaLinkedList<int>();
            queue.Enqueue(5);
            queue.Dequeue();
            Assert.True(queue.IsEmpty());
        }

        /**
         * Asserts that an exception is thrown if dequeue is called on an empty
         * queue.
         */
        [Test()]
        public void ExceptionThrownOnDequeueFromEmptyQueue()
        {
            var queue = new QueueViaLinkedList<int>();
            Assert.Throws<IndexOutOfRangeException>(() => queue.Dequeue());
        }

        /**
         * Asserts that an exception is thrown if peak is called on an empty
         * queue.
         */
        [Test()]
        public void ExceptionThrownOnPeakOnEmptyQueue()
        {
            var queue = new QueueViaLinkedList<int>();
            Assert.Throws<IndexOutOfRangeException>(() => queue.Peak());
        }

        /**
         * Tests common queue operations.
         */
        [Test()]
        public void ExerciseQueueOperation()
        {
            var queue = new QueueViaLinkedList<int>();
            queue.Enqueue(4);
            queue.Enqueue(-1);
            queue.Enqueue(2);

            Assert.AreEqual(3, queue.Size);
            Assert.AreEqual(4, queue.Peak());
            Assert.AreEqual(4, queue.Dequeue());
            Assert.AreEqual(-1, queue.Peak());
            Assert.AreEqual(2, queue.Size);

            queue.Enqueue(2);
            queue.Enqueue(0);
            queue.Enqueue(-9);

            Assert.AreEqual(5, queue.Size);
            Assert.AreEqual(-1, queue.Dequeue());
            Assert.AreEqual(2, queue.Peak());
            Assert.AreEqual(2, queue.Dequeue());
            Assert.AreEqual(2, queue.Peak());
            Assert.AreEqual(2, queue.Dequeue());
            Assert.AreEqual(0, queue.Peak());
            Assert.AreEqual(0, queue.Dequeue());
            Assert.AreEqual(-9, queue.Peak());
            Assert.AreEqual(-9, queue.Dequeue());
            Assert.True(queue.IsEmpty());
            Assert.AreEqual(0, queue.Size);

            queue.Enqueue(0);
            queue.Enqueue(-5);
            queue.Enqueue(8);

            Assert.AreEqual(3, queue.Size);
            Assert.AreEqual(0, queue.Peak());

            queue.Enqueue(-3);
            queue.Enqueue(10);

            Assert.AreEqual(5, queue.Size);
            Assert.AreEqual(0, queue.Dequeue());
            Assert.AreEqual(-5, queue.Peak());
            Assert.AreEqual(-5, queue.Dequeue());
            Assert.AreEqual(8, queue.Peak());
            Assert.AreEqual(8, queue.Dequeue());
            Assert.AreEqual(-3, queue.Peak());
            Assert.AreEqual(-3, queue.Dequeue());
            Assert.AreEqual(10, queue.Peak());
            Assert.AreEqual(1, queue.Size);

            queue.Enqueue(-1);
            queue.Enqueue(1);
            queue.Enqueue(2);
            queue.Enqueue(5);
            queue.Enqueue(7);
            queue.Enqueue(10);
            queue.Enqueue(0);
            queue.Enqueue(9);
            queue.Enqueue(11);

            Assert.AreEqual(10, queue.Size);
        }
    }
}
