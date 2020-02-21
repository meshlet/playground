/**
 * Tests for memoization.js.
 */
describe('Memoization Tests', function () {
    it("prime computation works correctly", function () {
        var test_vectors = [
            { value: 1,  is_prime: false },
            { value: 0,  is_prime: false },
            { value: 2,  is_prime: true  },
            { value: 7,  is_prime: true  },
            { value: 10, is_prime: false },
            { value: 21, is_prime: false },
            { value: 19, is_prime: true  },
            { value: 10, is_prime: false },
            { value: 2,  is_prime: true  },
        ];

        for (var test_vector of test_vectors) {
            expect(isPrimeWithMemoization(test_vector.value)).toBe(test_vector.is_prime);
        }
    });
});