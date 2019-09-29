using System;
using NUnit.Framework;
using datastructuresalgorithms;

namespace datastructuresalgorithmstest
{
    /**
     * Unit tests for the StackViaLinkedList class.
     */
    public class StackViaLinkedListTest
    {
        /**
         * Asserts that empty flag is correct for a newly created stack.
         */
        [Test()]
        public void NewStackHasCorrectEmptyFlag()
        {
            var s = new StackViaLinkedList<int>();
            Assert.True(s.IsEmpty());
        }

        /**
         * Asserts that empty flag is correct for a stack that is not empty.
         */
        [Test()]
        public void NonEmptyStackHasCorrectEmptyFlag()
        {
            var s = new StackViaLinkedList<int>();
            s.Push(34);
            Assert.False(s.IsEmpty());
        }
    
        /**
         * Asserts that the stack has correct empty flag after it becomes
         * empty.        
         */
        [Test()]
        public void EmptyFlagIsCorectAfterStackBecomesEmpty()
        {
            var s = new StackViaLinkedList<int>();
            s.Push(7);
            s.Pop();
            Assert.True(s.IsEmpty());
        }

        /**
         * Asserts that exception is thrown if pop is called on an empty stack.
         */
        [Test()]
        public void ExceptionThrownOnPopFromEmptyStack()
        {
            var s = new StackViaLinkedList<int>();
            Assert.Throws<IndexOutOfRangeException>(() => s.Pop());
        }
    
        /**
         * Asserts that exception is thrown if peak is called on an empty stack.
         */
        [Test()]
        public void ExceptionThrownOnPeakOnEmptyStack()
        {
            var s = new StackViaLinkedList<int>();
            Assert.Throws<IndexOutOfRangeException>(() => s.Peak());
        }
    
        /**
         * Tests push, pop and peak stack functionality.
         */
        [Test()]
        public void ExercisePushPopPeak()
        {
            var s = new StackViaLinkedList<int>();
            s.Push(5);
            Assert.AreEqual(5, s.Peak());
            s.Push(45);
            s.Push(-34);
            Assert.AreEqual(-34, s.Peak());
            Assert.AreEqual(-34, s.Pop());
            Assert.AreEqual(45, s.Peak());
            Assert.AreEqual(45, s.Pop());
            Assert.AreEqual(5, s.Peak());
        }

        /**
         * Reverses a string using a stack.
         */
        [Test()]
        public void reverseStringUsingStack()
        {
            string str = "abcdefghijklmn";
            var s = new StackViaLinkedList<char>();

            for (int i = 0; i<str.Length; ++i) {
                s.Push(str[i]);
            }

            string reversed_string = "";
            for (int i = 0; i<str.Length; ++i) {
                reversed_string += s.Pop();
            }

            Assert.AreEqual("nmlkjihgfedcba", reversed_string);
        }
    }
}
