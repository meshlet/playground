package com.toptalprep;

import com.toptalprep.Stack;


/**
 * Verifies whether delimiter characters '{', '(' and '[' are properly
 * matched within a string. For instance:
 *
 * a{d[c(b)e]f}g => valid
 * a{b(c)d => invalid (missing '}' in the end)
 * a{b(c]} => invalid (']' doesn't match opening '(')
 * a{b[c]d}e) => invalid (unexpected ')' at the end)
 */
public class DelimiterMatcher {
    /**
     * For a given closing delimiter, returns a opening one.
     */
    private static char getOpeningDelimiter(char closing_delimiter) {
        switch (closing_delimiter) {
            case '}':
                return '{';
            case ']':
                return '[';
            case ')':
                return '(';
            default:
                return closing_delimiter;
        }
    }

    /**
     * @return Returns Integer.MAX_VALUE if string is valid. Otherwise,
     * it returns an index of the invalid character.
     */
    public static int validateString(String str) {
        class Pair {
            public int m_item0;
            public char m_item1;

            Pair(int item0, char item1) {
                m_item0 = item0;
                m_item1 = item1;
            }
        }
        Stack<Pair> stack = new Stack<>(str.length(), Pair.class);

        for (int i = 0; i < str.length(); ++i) {
            char c = str.charAt(i);
            if (c == '{' || c == '[' || c == '(') {
                stack.push(new Pair(i, c));
            }
            else if (c == '}' || c == ']' || c == ')') {
                if (stack.isEmpty() || stack.pop().m_item1 != getOpeningDelimiter(c)) {
                    // Unexpected char found
                    return i;
                }
            }
        }
        if (!stack.isEmpty()) {
            return stack.peak().m_item0;
        }
        return Integer.MAX_VALUE;
    }
}
