using NUnit.Framework;
using System;
using programmingchallenges;

namespace programmingchallengestest
{
    /**
     * Unit tests for the Power class.
     */
    [TestFixture()]
    public class PowerTest
    {
        [Test()]
        public void TestPowerCalculation()
        {
            /* Item 1 is the base, item 2 the exponent and item 3 expected result */
            Tuple<uint, uint, uint>[] test_vectors =
            {
                new Tuple<uint, uint, uint>(0, 45, 0),
                new Tuple<uint, uint, uint>(4, 0, 1),
                new Tuple<uint, uint, uint>(2, 1, 2),
                new Tuple<uint, uint, uint>(3, 2, 9),
                new Tuple<uint, uint, uint>(3, 11, 177147),
                new Tuple<uint, uint, uint>(2, 10, 1024),
                new Tuple<uint, uint, uint>(1, 11, 1),
                new Tuple<uint, uint, uint>(13, 1, 13),
                new Tuple<uint, uint, uint>(17, 7, 410338673)
            };


            foreach (var test_vector in test_vectors)
            {
                Assert.AreEqual(test_vector.Item3, Power.calculate(test_vector.Item1, test_vector.Item2));
            }
        }
    }
}
