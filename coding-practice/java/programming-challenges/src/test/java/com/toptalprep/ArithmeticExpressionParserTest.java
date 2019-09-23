package com.toptalprep;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

/**
 * Unit tests for the ArithmeticExpressionParser class.
 */
public class ArithmeticExpressionParserTest {
	/**
	 * Tests the parser with several well-formed expressions.
	 *
	 * @throws Exception
	 */
    @Test
    public void testWellformedExpressions() throws Exception {
    	class Pair {
    		String m_expr;
    		int m_expected_value;
    		
    		Pair(String expr, int value) {
    			m_expr = expr;
    			m_expected_value = value;
    		}
    	}
    	
        Pair[] expressions = {
        		new Pair("1", 1),
        		new Pair("23+3", 26),
        		new Pair("(45)", 45),
        		new Pair("((123))", 123),
        		new Pair("(12-345)", -333),
                new Pair("2+1-0", 3),
                new Pair("43*6/3", 86),
                new Pair("88+2*0099", 286),
                new Pair("6*12+55", 127),
                new Pair("32*(3+7)", 320),
                new Pair("234*6-6*99", 810),
                new Pair("(34+1)*(78-1234)", -40460),
                new Pair("((6743+43)*12)-09", 81423),
                new Pair("451+056*(31-54/(23+87))", 2187),
                new Pair("31+(456+9876/34*56+1223*5)", 6607)
        };

        for (Pair expr: expressions) {
            assertEquals(expr.m_expected_value, ArithmeticExpressionParser.evaluate(expr.m_expr));
        }
    }
    
    /**
     * Tests parser's behavior when malformed expressions are provided.
     */
    @Test
    public void testMalformedExpressions() {
    	String[] malformed_expressions = {
    			"",
    			"(",
    			")",
    			"()",
    			"(45+98",
    			"098+/45",
    			"*32+65",
    			"980+12*56)",
    			"456*(160+56)/",
    			"(56+120)*((91-084)",
    			"((1+34())*53)-91",
    			"(34+98761)67"
    	};
    	
    	for (String expr: malformed_expressions) {
    		try {
    			ArithmeticExpressionParser.evaluate(expr);
    			assertTrue("Exception has not been thrown", false);
    		}
    		catch(Exception e) {
    			
    		}
    	}
    }
}
