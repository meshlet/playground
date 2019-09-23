package com.toptalprep;

import java.util.Vector;

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
 *
 * The implementation assumes that there are no white-spaces
 * between tokens. It also doesn't handle negative numbers so
 * an expression -1+2 won't parse.
 */
public class ArithmeticExpressionParser {
	private enum TokenType {
		NONE,
		OPENING_PARENTHESES,
		CLOSING_PARENTHESES,
		OPERAND,
		OPERATOR
	}

	/**
	 * Whether a given char is a digit.
	 *
	 * @param c The char value.
	 * @return Returns true if character is a digit, false otherwise.
	 */
    private static boolean isOperandChar(char c) {
        return c >= '0' && c <= '9';
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
    
    private static int calculate(int operand1, int operand2, char operator) throws Exception {
    	switch (operator) {
    	case '+':
    		return operand1 + operand2;
    	case '-':
    		return operand1 - operand2;
    	case '*':
    		return operand1 * operand2;
    	case '/':
    		return operand1 / operand2;
    	default:
    		break;
    	}
    	throw new Exception("Unknown operator '" + operator + "'");
    }

    /**
     * Converts infix expression to a postfix one. The tokens are stored in a
     * vector to simplify support for multi-digit numbers.
     *
     * @param expr The arithmetic expression that is to be converted.
     * @return A vector of tokens representing the postfix expression.
     * @throws Exception
     */
    private static Vector<String> convertToPostfix(String expr) throws Exception {
    	if (expr.isEmpty()) {
    		throw new Exception("The expression is an empty string");
    	}
    	
    	Vector<String> postfix = new Vector<>();
        Stack<Character> stack = new Stack<>(expr.length(), Character.class);
        TokenType previous_token = TokenType.NONE;

        for (int i = 0; i < expr.length(); ++i) {
            char c = expr.charAt(i);

            if (isOperandChar(c)) {
            	if (previous_token != TokenType.NONE && previous_token != TokenType.OPERATOR &&
            			previous_token != TokenType.OPENING_PARENTHESES) {
            		throw new Exception("Unexpected char '" + c + "' at position " + i);
            	}
            	
            	// Read the entire operand
            	String operand = "";
            	for (; i < expr.length(); ++i) {
            		c = expr.charAt(i);
            		if (!isOperandChar(c)) {
            			--i;
            			break;
            		}
            		operand += c;
            	}
            	
                postfix.add(operand);
                previous_token = TokenType.OPERAND;
            }
            else if (c == '(') {
            	if (previous_token != TokenType.NONE && previous_token != TokenType.OPENING_PARENTHESES &&
            			previous_token != TokenType.OPERATOR) {
            		throw new Exception("Unexpected char '" + c + "' at position " + i);
            	}
            	
                stack.push(c);
                previous_token = TokenType.OPENING_PARENTHESES;
            }
            else if (isOperator(c)) {
            	if (previous_token != TokenType.OPERAND && previous_token != TokenType.CLOSING_PARENTHESES) {
            		throw new Exception("Unexpected char '" + c + "' at position " + i);
            	}
            	
            	// Pop all operators with greater or equal precedence from the stack, until either the
            	// opening parentheses is reached or stack becomes empty
                while (!stack.isEmpty() && stack.peak() != '(' && comparePrecedence(c, stack.peak()) <= 0) {
                    postfix.add(stack.pop().toString());
                }
                
                // Push the current operator to the stack
                stack.push(c);
                previous_token = TokenType.OPERATOR;
            }
            else if (c == ')') {
            	if (previous_token != TokenType.OPERAND && previous_token != TokenType.CLOSING_PARENTHESES) {
            		throw new Exception("Unexpected char '" + c + "' at position " + i);
            	}
            	
                while (stack.peak() != '(') {
                    postfix.add(stack.pop().toString());
                    
                    if (stack.isEmpty()) {
                    	throw new Exception("Couldn't find the matching '(' parentheses");
                    }
                }
                
                // Pop the '('
                stack.pop();
                previous_token = TokenType.CLOSING_PARENTHESES;
            }
            else {
            	throw new Exception("Unexpected char '" + c + "' at position " + i);
            }
        }
        
        // Make sure the expression ends with an expected token
        if (previous_token != TokenType.OPERAND && previous_token != TokenType.CLOSING_PARENTHESES) {
        	throw new Exception("Unexpected char at the end of the expression");
        }
        
        // Pop all remaining operators from the stack
        while (!stack.isEmpty()) {
            if (!isOperator(stack.peak())) {
                throw new Exception("Malformed expression");
            }

            postfix.add(stack.pop().toString());
        }

        return postfix;
    }
    
    public static int evaluate(String expr) throws Exception {
    	Vector<String> postfix = convertToPostfix(expr);
    	
    	// Iterate over the postfix array and push each operand onto a stack
    	// When operator is reached apply it to two operands at the top of the 
    	// stack (the two operands to the left of the operator).
    	Stack<Integer> stack = new Stack<>(postfix.size(), Integer.class);
    	for (String token: postfix) {
    		if (isOperator(token.charAt(0))) {
    			int operand2 = stack.pop();
    			int operand1 = stack.pop();
    			stack.push(calculate(operand1, operand2, token.charAt(0)));
    		}
    		else {
    			stack.push(Integer.valueOf(token));
    		}
    	}
    	
    	// The results is at the top of the stack
    	return stack.pop();
    }
}
