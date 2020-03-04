/**
 * Illustrates JavaScript regular expressions.
 */
describe("Regular Expressions", function () {
    it('illustrates creating regular expressions', function () {
        // Create the regular expression using regular expression literal
        const regExp1 = /test/;

        // Create the regular expression using the RexExp constructor
        const regExp2 = new RegExp("test");

        // Assert that these two regular expressions are same but the
        // objects themselves are different
        expect(regExp1).not.toBe(regExp2)
        expect(regExp1.toString()).toEqual(regExp2.toString());
    });

    it('illustrates exact matching', function () {
        const regExp = /test/;
        expect(regExp.test("test")).toBeTrue();
        expect(regExp.test("Test")).toBeFalse();
        expect(regExp.test("TEST")).toBeFalse();
        expect(regExp.test("est")).toBeFalse();
        expect(regExp.test("testt")).toBeTrue();
        expect(regExp.test("Ttest")).toBeTrue();
    });

    it('illustrates case-insensitive matching', function () {
        const regExp = /test/i;
        expect(regExp.test("test")).toBeTrue();
        expect(regExp.test("TEST")).toBeTrue();
        expect(regExp.test(("TeSt"))).toBeTrue();
        expect(regExp.test("TEst Test")).toBeTrue();
        expect(regExp.test("TesaTesa")).toBeFalse();
    });

    it('illustrates matching from class of characters', function () {
        // Matches 'a012', 'b012' and 'c012'
        let regExp1 = /[abc]012/;
        expect(regExp1.test("a01")).toBeFalse();
        expect(regExp1.test("a012")).toBeTrue();
        expect(regExp1.test("b120")).toBeFalse();
        expect(regExp1.test("b012")).toBeTrue();
        expect(regExp1.test("012c")).toBeFalse();
        expect(regExp1.test("c012")).toBeTrue();
        expect(regExp1.test("d012")).toBeFalse();
        expect(regExp1.test("d012a012 b012")).toBeTrue();

        // Matches any character sequence that starts with anything
        // expect 'a', 'b' or 'c' followed by 012.
        let regExp2 = /[^abc]012/;
        expect(regExp2.test("a012")).toBeFalse();
        expect(regExp2.test("b012")).toBeFalse();
        expect(regExp2.test("c012")).toBeFalse();
        expect(regExp2.test("d012")).toBeTrue();
        expect(regExp2.test("0012")).toBeTrue();
        expect(regExp2.test("a012 p012")).toBeTrue();

        // Matches any character sequence that starts with a digit
        // followed by abc
        let regExp3 = /[0-9]abc/;
        expect(regExp3.test("0abc")).toBeTrue();
        expect(regExp3.test("Aabc")).toBeFalse();
        expect(regExp3.test("0Aabc")).toBeFalse();
        expect(regExp3.test("9ab")).toBeFalse();
        expect(regExp3.test("19abcd")).toBeTrue();
    });

    it('illustrates escaping special characters', function () {
        // Matches any character sequence that starts with '[' followed
        // by a digit and closing with ']'
        let regExp = /\[[0-9]\]/;
        expect(regExp.test("[9]")).toBeTrue();
        expect(regExp.test("[0")).toBeFalse();
        expect(regExp.test("9]")).toBeFalse();
        expect(regExp.test("[90]")).toBeFalse();
        expect(regExp.test("[[5]]")).toBeTrue();
    });

    it('illustrates matching at beginning or end of the string', function () {
        // Matches 'test' at the beginning of the string
        let regExp1 = /^test/;
        expect(regExp1.test("test")).toBeTrue();
        expect(regExp1.test("A test")).toBeFalse();
        expect(regExp1.test("test Abc")).toBeTrue();

        // Matches 'test' at the end of the string
        let regExp2 = /test$/;
        expect(regExp2.test("test")).toBeTrue();
        expect(regExp2.test("A test")).toBeTrue();
        expect(regExp2.test("test ABC")).toBeFalse();

        // Matches 'test' only if it encompasses the entire string (in
        // other words, the candidate string must exactly match the
        // pattern)
        let regExp3 = /^test$/;
        expect(regExp3.test("test")).toBeTrue();
        expect(regExp3.test("A test")).toBeFalse();
        expect(regExp3.test("test ABC")).toBeFalse();
        expect(regExp3.test("testtest")).toBeFalse();
    });

    it('illustrates making character sequence optional in the pattern', function () {
        // Matches 'test' and 'est'
        let regExp = /t?est/;
        expect(regExp.test("test")).toBeTrue();
        expect(regExp.test("est")).toBeTrue();
        expect(regExp.test("Test")).toBeTrue();
        expect(regExp.test("st")).toBeFalse();
        expect(regExp.test("iest")).toBeTrue();
    });

    it('illustrates matching character sequence one or more times', function () {
        // Matches 'test', 'ttest', 'tttest' and so on with any number of
        // ts in the beginning
        let regExp = /t+est/;
        expect(regExp.test("test")).toBeTrue();
        expect(regExp.test("ttest")).toBeTrue();
        expect(regExp.test("est")).toBeFalse();
        expect(regExp.test("tttest")).toBeTrue();
    });

    it('illustrates matching character sequence zero or more times', function () {
        let regExp = /t*est/;
        expect(regExp.test("est")).toBeTrue();
        expect(regExp.test("test")).toBeTrue();
        expect(regExp.test("tttest")).toBeTrue();
        expect(regExp.test("tst")).toBeFalse();
    });

    it('illustrates matching character sequence specified number of times', function () {
        // Matches 'ttttest' with 4 ts in front
        let regExp1 = /t{4}est/;
        expect(regExp1.test("ttttest")).toBeTrue();
        expect(regExp1.test("est")).toBeFalse();
        expect(regExp1.test("test")).toBeFalse();
        expect(regExp1.test("tttest")).toBeFalse();
        expect(regExp1.test("tst")).toBeFalse();

        // Matches 3 to 5 't' characters followed by 'est'
        let regExp2 = /t{3,5}est/;
        expect(regExp2.test("ttttest")).toBeTrue();
        expect(regExp2.test("est")).toBeFalse();
        expect(regExp2.test("test")).toBeFalse();
        expect(regExp2.test("tttest")).toBeTrue();
        expect(regExp2.test("tst")).toBeFalse();
        expect(regExp2.test("tttttest")).toBeTrue();

        // Matches 4 or more 't' characters followed by 'est'
        let regExp3 = /t{4,}est/;
        expect(regExp3.test("ttttest")).toBeTrue();
        expect(regExp3.test("est")).toBeFalse();
        expect(regExp3.test("test")).toBeFalse();
        expect(regExp3.test("tttest")).toBeFalse();
        expect(regExp3.test("tst")).toBeFalse();
        expect(regExp3.test("tttttttest")).toBeTrue();
    });

    it('illustrates greedy and non-greedy repetition operators', function () {
        // Matches 'tes' followed by one or more 't' characters. The '+'
        // operator is greedy and will consume all 't' characters in the
        // end
        let regExp1 = /test+/;
        expect(regExp1.test("testtttt")).toBeTrue();
        expect(regExp1.test("tes")).toBeFalse();

        // Matches 'tes' followed by one or more 't' characters. The '+'
        // operator is non-greedy and will consume only enough 't'
        // characters to make the match (which is one 't' character in
        // this case).
        let regExp2 = /test+?/;
        expect(regExp2.test("testtttt")).toBeTrue();
        expect(regExp2.test("tes")).toBeFalse();
    });

    it('illustrates predefined character classes', function () {
        // Matches tab character followed by 'abc'
        let regExp1 = /\tabc/;
        expect(regExp1.test("abc")).toBeFalse();
        expect(regExp1.test("\tabc")).toBeTrue();

        // Matches 'abc' at the word boundary. Hence, it will match
        // 'abc' but won't match 'aabc' or 'abca'.
        let regExp2 = /\babc\b/;
        expect(regExp2.test("abc")).toBeTrue();
        expect(regExp2.test("abcabc")).toBeFalse();
        expect(regExp2.test("abc xos")).toBeTrue();
        expect(regExp2.test("hap abc")).toBeTrue();
        expect(regExp2.test("pabc")).toBeFalse();

        // Matches 'abc' if it is not on the word boundary
        let regExp3 = /\Babc\B/;
        expect(regExp3.test("abc")).toBeFalse();
        expect(regExp3.test("abcabc")).toBeFalse();
        expect(regExp3.test("abcabcabc")).toBeTrue();
        expect(regExp3.test("pabc")).toBeFalse();
        expect(regExp3.test("P abc P")).toBeFalse();
        expect(regExp3.test("AabcA")).toBeTrue();

        // Matches the vertical tab character followed by 'abc'
        let regExp4 = /\vabc/;
        expect(regExp4.test("abc")).toBeFalse();
        expect(regExp4.test("\vabc")).toBeTrue();

        // Matches form feed character followed by 'abc'
        let regExp5 = /\fabc/;
        expect(regExp5.test("abc")).toBeFalse();
        expect(regExp5.test("\fabc")).toBeTrue();

        // Matches carriage return character followed by 'abc'
        let regExp6 = /\rabc/;
        expect(regExp6.test("abc")).toBeFalse();
        expect(regExp6.test("\rabc")).toBeTrue();

        // Matches 'abc' followed by a newline character
        let regExp7 = /abc\n/;
        expect(regExp7.test("abc")).toBeFalse();
        expect(regExp7.test("abc\n")).toBeTrue();

        // Matches cA (ctrl+A which is ASCII 1) control character
        // followed by 'abc'
        let regExp8 = /\cAabc/;
        expect(regExp8.test("abc")).toBeFalse();
        expect(regExp8.test("\1abc")).toBeTrue();

        // Matches \uABC0 unicode character followed by 'abc'
        let regExp9 = /\uABC0abc/;
        expect(regExp9.test("abc")).toBeFalse();
        expect(regExp9.test("\uABC0abc")).toBeTrue();

        // Matches \xA9 ASCII hexadecimal character followed by 'abc'
        let regExp10 = /\xA9abc/;
        expect(regExp10.test("abc")).toBeFalse();
        expect(regExp10.test("\xA9abc")).toBeTrue();

        // Matches any character expect of the line terminators
        // (\r, \n, \u2028 and \u2029)
        let regExp11 = /./;
        expect(regExp11.test("a")).toBeTrue();
        expect(regExp11.test("{")).toBeTrue();
        expect(regExp11.test(" ")).toBeTrue();
        expect(regExp11.test("\t")).toBeTrue();
        expect(regExp11.test("\v")).toBeTrue();
        expect(regExp11.test("\r")).toBeFalse();
        expect(regExp11.test("\n")).toBeFalse();
        expect(regExp11.test("\u2028")).toBeFalse();
        expect(regExp11.test("\u2029")).toBeFalse();

        // Matches any decimal digit
        let regExp12 = /\d/;
        expect(regExp12.test("0")).toBeTrue();
        expect(regExp12.test("p")).toBeFalse();
        expect(regExp12.test("9")).toBeTrue();
        expect(regExp12.test("\n")).toBeFalse();

        // Matches any character that is not a decimal digit
        let regExp13 = /\D/;
        expect(regExp13.test("0")).toBeFalse();
        expect(regExp13.test("p")).toBeTrue();
        expect(regExp13.test("9")).toBeFalse();
        expect(regExp13.test("\n")).toBeTrue();

        // Matches any alphanumeric character including underscore
        // (equivalent to [A-Za-z0-9_])
        let regExp14 = /\w/;
        expect(regExp14.test("a")).toBeTrue();
        expect(regExp14.test("_")).toBeTrue();
        expect(regExp14.test("-")).toBeFalse();
        expect(regExp14.test("9")).toBeTrue();
        expect(regExp14.test("\1")).toBeFalse();

        // Matches any character that is not a alphanumeric character or
        // underscore (equivalent to [^A-Za-z0-9_])
        let regExp15 = /\W/;
        expect(regExp15.test("a")).toBeFalse();
        expect(regExp15.test("_")).toBeFalse();
        expect(regExp15.test("-")).toBeTrue();
        expect(regExp15.test("9")).toBeFalse();
        expect(regExp15.test("\1")).toBeTrue();

        // Matches any whitespace character (equivalent to [\r\n\t\f\v])
        let regExp16 = /\s/;
        expect(regExp16.test("\r")).toBeTrue();
        expect(regExp16.test("\n")).toBeTrue();
        expect(regExp16.test("\t")).toBeTrue();
        expect(regExp16.test("\f")).toBeTrue();
        expect(regExp16.test("\v")).toBeTrue();
        expect(regExp16.test("a")).toBeFalse();
        expect(regExp16.test("_")).toBeFalse();
        expect(regExp16.test("-")).toBeFalse();
        expect(regExp16.test("9")).toBeFalse();
        expect(regExp16.test("\1")).toBeFalse();

        // Matches any character that is not a whitespace character (equivalent to [^\r\n\t\f\v])
        let regExp17 = /\S/;
        expect(regExp17.test("\r")).toBeFalse();
        expect(regExp17.test("\n")).toBeFalse();
        expect(regExp17.test("\t")).toBeFalse();
        expect(regExp17.test("\f")).toBeFalse();
        expect(regExp17.test("\v")).toBeFalse();
        expect(regExp17.test("a")).toBeTrue();
        expect(regExp17.test("_")).toBeTrue();
        expect(regExp17.test("-")).toBeTrue();
        expect(regExp17.test("9")).toBeTrue();
        expect(regExp17.test("\1")).toBeTrue();
    });

    it('illustrates grouping multiple terms', function () {
        // Matches 1 or more consecutive occurrences of 'abc'
        let regExp = /(abc)+/;
        expect(regExp.test("ab")).toBeFalse();
        expect(regExp.test("abc")).toBeTrue();
        expect(regExp.test("abca")).toBeTrue();
        expect(regExp.test("abcabc")).toBeTrue();
    });

    it('illustrates alternatives', function () {
        // Matches 1 or more consecutive occurrences of 'ab' or a single
        // occurrences of xy
        let regExp = /(ab)+|xy/;
        expect(regExp.test("ab")).toBeTrue();
        expect(regExp.test("xy")).toBeTrue();
        expect(regExp.test("axby")).toBeFalse();
        expect(regExp.test("ababab")).toBeTrue();
    });

    it('illustrates back-references', function () {
        // Matches one of 'a', 'b' or 'c' followed by x followed by
        // whatever character matches the first capture (so either
        // 'a', 'b' or 'c' depending on which character was matched).
        let regExp1 = /([abc])x\1/;
        expect(regExp1.test("abc")).toBeFalse();
        expect(regExp1.test("axa")).toBeTrue();
        expect(regExp1.test("axc")).toBeFalse();
        expect(regExp1.test("cxc")).toBeTrue();

        // Matches '<' followed by any number of alphanumeric characters
        // followed by '>' followed by any number of any characters except
        // the line terminators followed by '<' followed by the sequence
        // that matched the first capture followed by '>'. This regexp
        // basically matches an XML closing and opening tags.
        let regExp2 = /<(\w+)>.*<\/\1>/;
        expect(regExp2.test("<div>abc</div>")).toBeTrue();
        expect(regExp2.test("abc")).toBeFalse();
        expect(regExp2.test("<div+>a</div+>")).toBeFalse();
    });
});