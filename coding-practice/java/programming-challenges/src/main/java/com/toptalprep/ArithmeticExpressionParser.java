package com.toptalprep;

import com.toptalprep.Stack;

/**
 * The class for parsing arithmetic expressions consisting of
 * integer literals, arithmetic operators +, -, * and / and
 * parentheses. The parse method will evaluate the expression
 * and return the computed integer value. For example:
 *
 * 2 + 3 * 10 => 32
 * 2 * (5 + 10) => 30
 * (2 + 3) * (7 + 3) => 50
 */
public class ArithmeticExpressionParser {
    private static boolean isOperand(char c) {
        return c != '+' && c != '-' && c != '*' && c != '/' && c != '(' && c != ')';
    }

    private static boolean isOperator(char c) {
        return c == '+' || c == '-' || c == '*' || c == '/';
    }

    /**
     *
     * @param op1   The first operator.
     * @param op2   The second operator.
     * @return  Returns negative value if op1 has lower precedence than op2, zero
     *          if op1 and op2 have equal precedence, and positive value if op1
     *          has greater precedence than op2.
     */
    private static int comparePrecedence(char op1, char op2) throws Exception {
        if ((op1 != '+' && op1 != '-' && op1 != '*' && op1 != '/') ||
                (op2 != '+' && op2 != '-' && op2 != '*' && op2 != '/')) {
            throw new Exception("Malformed expression");
        }

        if (op1 == '+' || op1 == '-') {
            if (op2 == '*' || op2 == '/') {
                return -1;
            }
            else {
                return 0;
            }
        }
        else if (op1 == '*') {
            if (op2 == '*') {
                return 0;
            }
            else {
                return 1;
            }
        }
        else {
            // op1 == '/'
            if (op2 == '*') {
                return -1;
            }
            else if (op2 == '/') {
                return 0;
            }
            else {
                return 1;
            }
        }
    }

    public static String convertToPostfix(String expr) throws Exception {
        String postfix = "";
        Stack<Character> stack = new Stack<>(expr.length(), Character.class);

        for (int i = 0; i < expr.length(); ++i) {
            char c = expr.charAt(i);

            if (isOperand(c)) {
                postfix += c;
            }
            else if (c == '(') {
                stack.push(c);
            }
            else if (isOperator(c)) {
                while (!stack.isEmpty() && stack.peak() != '(' && comparePrecedence(c, stack.peak()) <= 0) {
                    postfix += stack.pop();
                }
                // Push the current operator to the stack
                stack.push(c);
            }
            else if (c == ')') {
                while (stack.peak() != '(') {
                    postfix += stack.pop();
                }
                // Pop the '('
                stack.pop();
            }
            else {
                throw new Exception("Malformed expression");
            }
        }

        // Pop all remaining operators from the stack
        while (!stack.isEmpty()) {
            if (!isOperator(stack.peak())) {
                throw new Exception("Malformed expression");
            }

            postfix += stack.pop();
        }

        return postfix;
    }
}
