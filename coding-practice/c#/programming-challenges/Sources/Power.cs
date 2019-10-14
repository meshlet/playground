using System;

namespace programmingchallenges
{
    /**
     * Implements unsigned integer base^exp function that has O(log(exp))
     * time complexity The class is not allowed to use the in-built pow
     * function.    
     */
    public class Power
    {
        static public uint calculate(uint base_val, uint exp_val)
        {
            /* Handle x^0 as a special case */
            if (exp_val == 0)
            {
                return 1;
            }

            return pow_internal(base_val, exp_val);
        }

        static private uint pow_internal(uint current_val, uint current_exp)
        {
            if (current_exp == 1)
            {
                return current_val;
            }

            uint tmp = pow_internal(current_val * current_val, current_exp / 2);
            return (current_exp % 2 == 0) ? tmp : tmp * current_val;
        }
    }
}
