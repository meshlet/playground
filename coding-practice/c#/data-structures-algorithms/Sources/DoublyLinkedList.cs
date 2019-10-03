using System;
using System.Collections;
using System.Collections.Generic;

namespace datastructuresalgorithms
{
    /**
     * Implements a doubly linked list.
     */
    public class DoublyLinkedList<T> : IEnumerable<T> where T : IComparable<T>
    {
        private class Link
        {
            public T Data { get; set; }
            public Link Left { get; set; }
            public Link Right { get; set; }

            public Link(T data)
            {
                Data = data;
                Left = Right = null;
            }
        }

        Link head;
        Link tail;

        public uint Size { get; private set; }

        public DoublyLinkedList()
        {
            head = tail = null;
            Size = 0;
        }

        /**
         * Inserts the item to the beginning of the list.
         */
        public void InsertFirst(T value)
        {
            Link link = new Link(value);
            link.Right = head;

            if (head != null)
            {
                head.Left = link;
            }
            else
            {
                // If this is the very first item, set tail to point to it
                tail = link;
            }

            head = link;
            ++Size;
        }

        /**
         * Inserts the item to the end of the list.
         */
        public void InsertLast(T value)
        {
            Link link = new Link(value);
            link.Left = tail;

            if (tail != null)
            {
                tail.Right = link;
            }
            else
            {
                // If this is the very first item, set head to point to it
                head = link;
            }

            tail = link;
            ++Size;
        }

        /**
         * Inserts the item right after the given value. If the list
         * doesn't contain the specified value the list is left unchanged.
         *
         * If the list contains multiple items with the key value, the new
         * item is inserted after the first occurence.        
         *
         * @return true if the value was inserted, false otherwise.
         */
        public bool InsertAfter(T search_key, T value)
        {
            Link current = head;

            while (current != null && search_key.CompareTo(current.Data) != 0)
            {
                current = current.Right;
            }

            if (current != null)
            {
                if (current == head)
                {
                    InsertFirst(value);
                }
                else if (current == tail)
                {
                    InsertLast(value);
                }
                else
                {
                    Link link = new Link(value);
                    link.Right = current.Right;
                    link.Left = current;
                    current.Right.Left = link;
                    current.Right = link;
                    ++Size;
                }
                return true;
            }
            return false;
        }

        /**
         * Removes the item from the beginning of the list.
         *
         * The behavior is undefined if the list is empty.
         */
        public T RemoveFirst()
        {
            T data = head.Data;
            head = head.Right;

            if (head != null)
            {
                // The list is not empty
                head.Left = null;
            }
            else
            {
                // The list is empty, reset the tail to null as well
                tail = null;
            }

            --Size;
            return data;
        }

        /**
         * Removes the item from the end of the list.
         *
         * The behavior is undefiend if the list is empty.
         */
        public T RemoveLast()
        {
            T data = tail.Data;
            tail = tail.Left;

            if (tail != null)
            {
                // The list is not empty
                tail.Right = null;
            }
            else
            {
                // The list is empty, reset the head to null as well
                head = null;
            }

            --Size;
            return data;
        }

        /**
         * Removes the first item with the given value. If the list doesn't
         * contain the value the list is left unmodified.
         *
         * @return true if the item has been removed, false otherwise.
         */
        public bool Remove(T value)
        {
            Link current = head;

            while (current != null && value.CompareTo(current.Data) != 0)
            {
                current = current.Right;
            }

            if (current != null)
            {
                if (current == head)
                {
                    RemoveFirst();
                }
                else if (current == tail)
                {
                    RemoveLast();
                }
                else
                {
                    current.Left.Right = current.Right;
                    current.Right.Left = current.Left;
                    --Size;
                }
                return true;
            }
            return false;
        }

        /**
         * Peaks the first item in the list without removing it.
         *
         * Behavior is undefined if the list is empty.
         */
        public T PeakFirst()
        {
            return head.Data;
        }

        /**
         * Peaks the last item in the list without removing it.
         *
         * Behavior is undefined if the list is empty.
         */
        public T PeakLast()
        {
            return tail.Data;
        }

        /**
         * Clears the list;
         */
        public void Clear()
        {
            head = tail = null;
            Size = 0;
        }

        /**
         * Whether the list is empty or not.
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
            Link current = head;
            while (current != null)
            {
                yield return current.Data;
                current = current.Right;
            }
        }

        /**
         * Implements the non-generic IEnumerable interface.
         */
        IEnumerator IEnumerable.GetEnumerator()
        {
            return this.GetEnumerator();
        }
    }
}
