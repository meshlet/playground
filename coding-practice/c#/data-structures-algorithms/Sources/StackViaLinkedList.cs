using System;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Stack implementation using a linked list. The top of the
     * stack is the head of the list (or its front).    
     */
    public class StackViaLinkedList<T> where T : IComparable<T>
    {
        private SinglyLinkedList<T> list;

        public StackViaLinkedList()
        {
            list = new SinglyLinkedList<T>();
        }

        public void Push(T value)
        {
            list.PushFront(value);
        }

        public T Pop()
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
