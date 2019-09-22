package com.toptalprep;

import org.junit.Test;

/**
 * Unit tests for the ArithmeticExpressionParser class.
 */
public class ArithmeticExpressionParserTest {
    @Test
    public void bla() throws Exception {
        String[] expressions = {
                "A+B-C",
                "A*B/C",
                "A+B*C",
                "A*B+C",
                "A*(B+C)",
                "A*B+C*D",
                "(A+B)*(C-D)",
                "((A+B)*C)-D",
                "A+B*(C-D/(E+F))",
                "A+(B+C/D*E+F*G)"
        };

        for (String infix: expressions) {
            System.out.print("Infix = " + infix + ", Postfix = ");
            System.out.println(ArithmeticExpressionParser.convertToPostfix(infix));
        }
    }
}
