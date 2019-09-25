using System;
using System.Collections;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * A singly linked list implementation.
     */
    public class SinglyLinkedList<T> : IEnumerable<T> where T : IComparable<T>
    {
        private class Link
        {
            public Link(T value)
            {
                Next = null;
                Data = value;
            }

            public Link Next { get; set; }
            public T Data { get; set; }
        }

        Link head;

        public SinglyLinkedList()
        {
            head = null;
        }

        /**
         * Inserts value to the beginning of the list.
         */
        public void PushFront(T value)
        {
            if (head == null)
            {
                head = new Link(value);
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
            if (head == null)
            {
                head = new Link(value);
                return;
            }

            Link link = head;
            while (link.Next != null)
            {
                link = link.Next;
            }

            link.Next = new Link(value);
        }

        /**
         * Pops the link from the front of the list.
         */
        public void PopFront()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            head = head.Next;
        }

        /**
         * Pops the link from the back of the list.
         */
        public void PopBack()
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            Link previous = null;
            Link current = null;

            while (current.Next != null)
            {
                previous = current;
                current = current.Next;
            }

            if (previous == null)
            {
                // The head is the only link in the list
                head = null;
            }
            else
            {
                previous.Next = current.Next;
            }
        }

        /**
         * Deletes all the occurrences of the value from the list.
         */
        public void Remove(T value)
        {
            if (head == null)
            {
                throw new IndexOutOfRangeException("List is empty");
            }

            Link previous = null;
            Link current = head;

            while (current != null)
            {
                if (current.Data.CompareTo(value) == 0)
                {
                    if (current == head)
                    {
                        // Move the head to the next link
                        current = head = current.Next;
                    }
                    else
                    {
                        previous.Next = current = current.Next;
                    }
                }
                else
                {
                    previous = current;
                    current = current.Next;
                }
            }
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
