package com.toptalprep;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the DelimiterMatcher class.
 */
public class DelimiterMatcherTest {
    /**
     * Tests several valid strings.
     */
    @Test
    public void testValidStrings() {
        String[] strings = {
                "abcdefgh",
                "a{d[c(e)f]g}h",
                "a(0)",
                "abc[dfg[f(4,3,5)]]",
                "a{0}",
                "f(b(c(d(a[g[0]fd{{5}d}]fd))))",
                "{[[[[({}[])]]]{()}]}"
        };

        for (String str: strings) {
            assertEquals(
                    "Test failed for string '" + str + "'",
                    Integer.MAX_VALUE, DelimiterMatcher.validateString(str));
        }
    }

    /**
     * Tests several invalid strings.
     */
    @Test
    public void testInvalidStrings() {
        String[] strings = {
                "a{b(c)d",
                "abc{f(a[45], f(34)]}",
                "{[[[[({}[])]]]{()}]}]",
                "a[0}",
                "a(f{5[]))"
        };
        int[] indices = { 1, 18, 20, 3, 7 };

        for (int i = 0; i < strings.length; ++i) {
            assertEquals(
                    "Test failed for string '" + strings[i] + ",",
                    indices[i], DelimiterMatcher.validateString(strings[i]));
        }
    }
}
