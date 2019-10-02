using System;
using System.Collections.Generic;
using System.Collections;

namespace datastructuresalgorithms
{
    /**
     * Linked list implementation in which the items are kept
     * in ascending order.
     */    
    public class SortedLinkedList<T> : IEnumerable<T> where T : IComparable<T>
    {
        private class Link
        {
            public T Data { get; set; }
            public Link Next { get; set; }

            public Link(T value)
            {
                Data = value;
                Next = null;
            }
        }

        Link head;

        public uint Size { get; private set; }

        public SortedLinkedList()
        {
            head = null;
            Size = 0;
        }

        public void Insert(T value)
        {
            ++Size;

            if (head == null)
            {
                head = new Link(value);
                return;
            }

            Link prev = null;
            Link curr = head;

            while (curr != null && value.CompareTo(curr.Data) > 0)
            {
                prev = curr;
                curr = curr.Next;
            }

            if (prev == null)
            {
                // New link is created at the very beginning
                prev = new Link(value);
                prev.Next = head;
                head = prev;
            }
            else
            {
                Link new_link = new Link(value);
                prev.Next = new_link;
                new_link.Next = curr;
            }
        }

        /**
         * Remove all links from the list containing the given value.
         */
        public void Remove(T value)
        {
            Link prev = null;
            Link curr = head;

            // As the list is sorted we can quit iterating as long as
            // the items become larger than the 'value'
            while (curr != null && value.CompareTo(curr.Data) >= 0)
            {
                if (value.CompareTo(curr.Data) == 0)
                {
                    --Size;
                    if (curr == head)
                    {
                        head = head.Next;
                    }
                    else
                    {
                        prev.Next = curr.Next;
                    }
                }
                else
                {
                    prev = curr;
                }

                curr = curr.Next;
            }
        }

        /**
         * Method doesn't check whether the list is empty.
         */
        public T PopFront()
        {
            T data = head.Data;
            head = head.Next;
            --Size;
            return data;
        }

        /**
         * Method doesn't check whether the list is empty.
         */
        public T PeakFront()
        {
            return head.Data;
        }

        /**
         * Clears the list.
         */
        public void Clear()
        {
            head = null;
            Size = 0;
        }

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
