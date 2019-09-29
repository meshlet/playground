using System;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Queue implementation using a linked list. The head of the
     * list (its front) is the head of the queue, and the tail of
     * the list (its back) is the tail of the queue.
     */
    public class QueueViaLinkedList<T> where T : IComparable<T>
    {
        private DoubleEndedLinkedList<T> list;

        public QueueViaLinkedList()
        {
            list = new DoubleEndedLinkedList<T>();
        }

        public void Enqueue(T value)
        {
            list.PushBack(value);
        }

        public T Dequeue()
        {
            return list.PopFront();
        }

        public T Peak()
        {
            return list.PeakFront();
        }

        public bool IsEmpty()
        {
            return list.IsEmpty();
        }

        public uint Size
        {
            get { return list.Size; }
        }
    }
}
