using System;
using System.Collections;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    public class DoubleEndedLinkedList<T> : IEnumerable<T> where T : IComparable<T>
    {
        private class Link
        {
            public Link(T value)
            {
                Data = value;
                Next = null;
            }

            public T Data { get; set; }
            public Link Next { get; set; }
        }

        Link head;
        Link tail;

        public UInt32 Size { get; private set; }

        public DoubleEndedLinkedList()
        {
            head = null;
            tail = null;
        }

        /**
         * Inserts value to the beginning of the list.
         */
        public void PushFront(T value)
        {
            ++Size;

            if (head == null)
            {
                // Set head and tail to the newly created link
                head = tail = new Link(value);
                return;
            }

            Link new_head = new Link(value);
            new_head.Next = head;
            head = new_head;
        }

        /**
         * Appends value to the end of the list.
         */
        public void PushBack(T value)
        {
            ++Size;

            if (head == null)
            {
                // Set head and tail to the newly created link
                head = tail = new Link(value);
                return;
            }

            Link new_tail = new Link(value);
            tail.Next = new_tail;
            tail = new_tail;
        }

        /**
         * Pops value from the beginning of the list.
         */
        public T PopFront()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            T value = head.Data;
            if (head == tail)
            {
                head = tail = null;
            }
            else
            {
                head = head.Next;
            }

            --Size;
            return value;
        }

        /**
         * Pops value from the back of the list.
         */
        public T PopBack()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            T value;
            if (head == tail)
            {
                value = head.Data;
                head = tail = null;
            }
            else
            {
                Link previous = head;
                Link current = head.Next;

                while (current.Next != null)
                {
                    previous = current;
                    current = current.Next;
                }

                value = current.Data;
                previous.Next = null;
                tail = previous;
            }

            --Size;
            return value;
        }

        /**
         * Returns the value stored in the head of the list without removing it.
         */
        public T PeakFront()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            return head.Data;
        }

        /**
         * Returns the value stored in the tail of the list without removing it.
         */
        public T PeakBack()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            return tail.Data;
        }

        /**
         * Deletes all the occurrences of the value from the list.
         */
        public void Remove(T value)
        {
            Link previous = null;
            Link current = head;

            while (current != null)
            {
                if (current.Data.CompareTo(value) == 0)
                {
                    --Size;
                    if (current == head)
                    {
                        // Move the head to the next link
                        head = current.Next;
                    }
                    else if (current == tail)
                    {
                        // Set tail to the previous link
                        tail = previous;
                        tail.Next = null;
                    }
                    else
                    {
                        previous.Next = current.Next;
                    }

                    // Proceed to the next link
                    current = current.Next;
                }
                else
                {
                    previous = current;
                    current = current.Next;
                }
            }

            if (head == null)
            {
                // This handles the situation where the list contained a single
                // item which as removed
                tail = null;
            }
        }

        /**
         * Clears the list.
         */
        public void Clear()
        {
            head = null;
            Size = 0;
        }

        /**
         * Whether list is empty or not.
         */
        public bool IsEmpty()
        {
            return head == null;
        }

        /**
         * Implements the IEnumerable<T> interface.
         */
        public IEnumerator<T> GetEnumerator()
        {
            Link link = head;
            while (link != null)
            {
                yield return link.Data;
                link = link.Next;
            }
        }

        /**
         * Implements a non-generic IEnumerable interface.
         *
         * This is required because IEnumerable<T> inherits the
         * IEnumerable interface.        
         */
        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
