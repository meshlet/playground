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

    it('illustrates finding all HTML elements with specified class name', function () {
        function prepareElements() {
            let parentDiv = document.createElement("div");
            let children = [];

            children.push(document.createElement("div"));
            children[children.length - 1].className = "class1 \tclass2";
            children.push(document.createElement("div"));
            children[children.length - 1].className = "class2\t\tclass1";
            children.push(document.createElement("div"));
            children.push(document.createElement("span"));
            children[children.length - 1].className = "class3 class1\tclass2";
            children.push(document.createElement("div"));
            children[children.length - 1].className = "class3";

            for (let child of children) {
                parentDiv.appendChild(child);
            }

            return parentDiv;
        }

        // Finds all 'elemType' children elements the 'parent' element that have
        // 'className' as one of their classes. If 'elemType' is not specified
        // the function considers elements of any type.
        function findElementsWithClass(parent, className, elemType) {
            // The expression 'elemType || "*"' evaluates to 'elemType' if elemType
            // isn't undefined, otherwise it evaluates to '*' which will return all
            // children elements regardless of their type.
            let children = parent.getElementsByTagName(elemType || "*");

            // Matches either the beginning of the string or a whitespace character,
            // followed by the desired class name, followed by either the of the
            // the string or a whitespace character
            let regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");

            // Iterate over all children elements and find those whose className
            // contains the desired class name
            let results = [];
            for (let child of children) {
                if (regexp.test(child.className)) {
                    results.push(child);
                }
            }
            return results;
        }

        let parentContainer = prepareElements();

        expect(findElementsWithClass(parentContainer, "class1", "div").length).toBe(2);
        expect(findElementsWithClass(parentContainer, "class2", "div").length).toBe(2);
        expect(findElementsWithClass(parentContainer, "class", "div").length).toBe(0);
        expect(findElementsWithClass(parentContainer, "class2", "span").length).toBe(1);
        expect(findElementsWithClass(parentContainer, "class3").length).toBe(2);
        expect(findElementsWithClass(parentContainer, "class2").length).toBe(3);
    });

    /**
     * Local regular expressions (without the 'g' flag) terminate as soon as
     * the character sequence is matched, even though there may be more such
     * sequences in the string. For example, regular expression /test/ will
     * match sequence 'test' exactly once. So for a candidate string
     * 'test abc test a test' only the first 'test' sequence is matched.
     */
    it('illustrates matching/capturing using local regular expressions', function () {
        // A string representing the CSS transform property that translates
        // the element 50 pixels down the y-axis.
        let string = "transform: translateY(40px);";

        // Captures the translation amount (in this case '40px'). The expression
        // matches a sequence starting with translateY followed by opening parenthesis
        // followed by one or more characters until closing parenthesis is encountered.
        // The sequence within the parentheses is captured.
        let regexp = /translateY\(([^\)]+)\)/;

        // The match is an array of length 2. The entire matched sequence is stored as
        // the first array element and the captured sequence is stored as the second
        // element.
        let match = string.match(regexp);
        expect(match).not.toBeNull();
        expect(match.length).toBe(2);
        expect(match[0]).toEqual("translateY(40px)");
        expect(match[1]).toEqual("40px");
    });

    /**
     * Global regular expressions (with the 'g' flag) find all the match instances
     * in the candidate string (as opposed to local expressions that terminate after
     * the first match is found). For example, regular expression /test/g will match
     * the all the 'test' sequences in the candidate string. So for the candidate
     * string 'test abc test a test' all of the 'test' sequences are matched. Note,
     * however, that capturing doesn't work out of the box with global expressions.
     * The captures within matches are not returned by the String.match for global
     * expressions. See the next sample on how to work around this.
     */
    it('illustrates difference between matching with local and global expressions', function () {
        let htmlString = "<div class='test'><b>Hello</b><i>world!</i></div>";

        // Match with the local regular expression. The expression matches
        // zero or one '/' character, followed by one or more alphanumeric
        // characters (tag name), followed by any character except '>' zero
        // or more times, followed by the '>' character. As this is a local
        // regular expression (no 'g' flag) only the first match instance
        // is found and captures within that instance are returned.
        let localMatch = htmlString.match(/<(\/?)(\w+)([^>]*)>/);
        expect(localMatch.length).toBe(4);
        expect(localMatch[0]).toEqual("<div class='test'>");
        expect(localMatch[1]).toEqual("");
        expect(localMatch[2]).toEqual("div");
        expect(localMatch[3]).toEqual(" class='test'");

        // Match with the global regular expression. The expression itself
        // is identical to the previous one except the 'g' flag making this
        // one global. String.match method returns only global matches in
        // this case. In other words, only no matches are returned but not
        // the captured within matches. See the next sample
        let globalMatch = htmlString.match(/<(\/?)(\w+)([^>]*)>/g);
        expect(globalMatch.length).toBe(6);
        expect(globalMatch[0]).toEqual("<div class='test'>");
        expect(globalMatch[1]).toEqual("<b>");
        expect(globalMatch[2]).toEqual("</b>");
        expect(globalMatch[3]).toEqual("<i>");
        expect(globalMatch[4]).toEqual("</i>");
        expect(globalMatch[5]).toEqual("</div>");
    });

    it('illustrates using RegExp.exec to do global search and capturing', function () {
        let htmlString = "<div class='test'><b>Hello</b><i>world!</i></div>";

        // Match with the local regular expression. The expression matches
        // zero or one '/' character, followed by one or more alphanumeric
        // characters (tag name), followed by any character except '>' zero
        // or more times, followed by the '>' character. As this is global
        // expression, only matches are returned by String.match but not
        // the captures within them. To work around this, RegExp.exec
        // method is used.
        let regexp = /<(\/?)(\w+)([^>]*)>/g;

        let actualResults = [];
        let match;

        // If expression is global the exec method becomes stateful. Each
        // call will return the next match and captures within that match.
        // This allows us to get all matches as well as the captures within
        // each match.
        while((match = regexp.exec(htmlString)) !== null) {
            actualResults.push(...match);
        }

        let expectedResults = [
            "<div class='test'>",
            "",
            "div",
            " class='test'",
            "<b>",
            "",
            "b",
            "",
            "</b>",
            "/",
            "b",
            "",
            "<i>",
            "",
            "i",
            "",
            "</i>",
            "/",
            "i",
            "",
            "</div>",
            "/",
            "div",
            ""
        ];

        expect(actualResults).toEqual(expectedResults);
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

        // Matches '<' followed by one or more of alphanumeric characters
        // followed by '>' followed by zero or more of any characters except
        // the line terminators followed by '<' followed by the sequence
        // that matched the first capture followed by '>'. This regexp
        // basically matches an XML closing and opening tags.
        let regExp2 = /<(\w+)>.*<\/\1>/;
        expect(regExp2.test("<div>abc</div>")).toBeTrue();
        expect(regExp2.test("abc")).toBeFalse();
        expect(regExp2.test("<div+>a</div+>")).toBeFalse();

        // Matches '<' followed by one or more alphanumeric characters (tag),
        // followed by zero or more characters different than '>', followed
        // by '>', followed by any number of characters which are not line
        // terminators, followed by '<', followed by the very first capture
        // within this match (the tag), followed by '>'. This is a global
        // expression so RegExp.exec needs to be used to retrieve captures
        // within matches.
        let regExp3 = /<(\w+)([^>]*)>(.*)<\/\1>/g;

        let htmlString = "<b class='hello'>Hello</b><i>world!</i>";
        let actualResults = [];
        let match;
        while ((match = regExp3.exec(htmlString)) !== null) {
            actualResults.push(...match);
        }

        let expectedResults = [
            "<b class='hello'>Hello</b>",
            "b",
            " class='hello'",
            "Hello",
            "<i>world!</i>",
            "i",
            "",
            "world!"
        ];

        expect(actualResults).toEqual(expectedResults);
    });

    it('illustrates using String.replace with regular expressions', function () {
        // Replaces all uppercase letters in a string with letter 'X'
        let regExp1 = /[A-Z]/g;
        expect("abCdeGhIjklmOPQr".replace(regExp1, "X")).toEqual("abXdeXhXjklmXXXr");

        // Converts the camelCase into dashed notation. The replace method
        // applies the regexp to the string and replaces each match with
        // the method's second argument. Note that the second argument
        // can refer to the captures using $1, $2 and so on. The capture
        // is always relative to the current match for global expressions.
        let regEx2 = /([A-Z])/g;
        expect("fontFamily".replace(regEx2, "-$1").toLowerCase()).toEqual("font-family");
        expect("longCamelCaseStringThatWillBeConvertedToDashedNotation".replace(regEx2, "-$1").toLowerCase())
            .toEqual("long-camel-case-string-that-will-be-converted-to-dashed-notation");
    });

    /**
     * When String.replace is invoked with a function as its second argument,
     * it invokes that function for each match. The arguments passed to that
     * function depend on String.replace method's first argument. If regular
     * expression is its first argument, then the following arguments are
     * passed to the replacement function:
     *
     * - the full text of the match
     * - the captures of the match, one argument for each
     * - the index of the match within the original string
     * - the source string
     *
     * The return value of the replacement function replaces the matched
     * sequence in the original string.
     */
    it('illustrates using String.replace with regexp and replacement functions', function () {
        // Converts dashed notation into camel case
        expect(
            "long-string-in-dashed-notation-that-will-be-converted-into-camel-case"
                .replace(/-(\w)/g, (entireMatch, letter) => {
                    return letter.toUpperCase();
                })
        ).toEqual("longStringInDashedNotationThatWillBeConvertedIntoCamelCase");

        // The following shows how String.replace can be utilized a means of string
        // traversal. We want to convert a query string of the
        // 'abc=1&abc=2&foo=a&mix=23&foo=8&abc=p' into a more readable format
        // 'abc=1,2,p&foo=a,8&mix=23'.
        function compressQuery(query) {
            let keys = new Map();

            query.replace(
                /(\w+)=(\w*)/g,
                (match, key, value) => {
                    if (keys.has(key)) {
                        keys.set(key, keys.get(key) + "," + value);
                    }
                    else {
                        keys.set(key, value);
                    }

                    // We don't care about the replacement string so simply return an
                    // empty string. The intention is to use the String.replace function
                    // as means of iterating over all matches
                    return "";
                }
            );

            let results = [];
            for (let mapping of keys) {
                results.push(mapping[0] + "=" + mapping[1]);
            }
            return results.join("&");
        }

        expect(compressQuery("abc=1&abc=2&foo=a&mix=23&foo=8&abc=p")).toEqual("abc=1,2,p&foo=a,8&mix=23");
        expect(compressQuery("abc=&foo=12&foo=ty")).toEqual("abc=&foo=12,ty");
    });

    it('illustrates non-capturing groups', function () {
        // Matches one or more 'prefix-' sequences followed by sequence 'name'.
        // We'd like to capture everything that comes before 'name' (so all the
        // 'prefix-' sequences), however parentheses must be placed around the
        // 'prefix-' to apply the + operator to entire sequence. This creates
        // the capture which will be returned by String.match
        let regExp1 = /((prefix-)+)name/;
        expect([..."prefix-name".match(regExp1)]).toEqual(["prefix-name", "prefix-", "prefix-"]);
        expect([..."prefix-prefix-prefix-name".match(regExp1)])
            .toEqual(["prefix-prefix-prefix-name", "prefix-prefix-prefix-", "prefix-"]);

        // We can instruct the regexp engine not to capture a group by adding '?:'
        // after the opening '(' parentheses. The following regexp is similar to
        // the one above, however this one won't capture the inner 'prefix-' group.
        // It will only capture the entire prefix (possibly made of multiple 'prefix-'
        // sequences).
        let regExp2 = /((?:prefix-)+)name/;
        expect([..."prefix-name".match(regExp2)]).toEqual(["prefix-name", "prefix-"]);
        expect([..."prefix-prefix-prefix-name".match(regExp2)])
            .toEqual(["prefix-prefix-prefix-name", "prefix-prefix-prefix-"]);
    });

    it('illustrates matching all characters including newlines', function () {
        // The following regex matches all characters except the line terminators
        let regExp1 = /(.*)/;
        expect("First line\nSecond line".match(regExp1)[0]).toEqual("First line");

        // The following regex matches either a whitespace character or any other
        // character except whitespace zero or more times. In other words, it matches
        // any possible character zero or more times including the newline
        let regExp2 = /([\s\S]*)/;
        expect("First line\nSecond line".match(regExp2)[0]).toEqual("First line\nSecond line");

        // The following regex matches either a whitespace character or a character
        // that is not a line terminator, zero or more times. The union of these are
        // all possible characters including newlines.
        let regExp3 = /(?:.|\s)*/;
        expect("First line\nSecond line".match(regExp3)[0]).toEqual("First line\nSecond line");
    });

    it('illustrates matching unicode characters', function () {
        let unicodeText = "\u5FCD\u8005\u30D1\u30EF\u30FC";

        // The following matches any common word character plus any unicode character
        // above unicode character 128 (80 hexadecimal) plus the hyphen character,
        // one or more times.
        let regExp = /[\w\u0080-\uFFFF-]+/;
        expect(regExp.test(unicodeText)).toBeTrue();
    });

    it('illustrates matching escaped characters', function () {
        // Matches any alphanumeric character OR '\' followed by any character
        // except the line terminators, one or more times. The sequence must
        // encompass the entire candidate string to be matched.
        let regExp = /^(?:\w|\\.)+$/;
        expect(regExp.test("formUpdate")).toBeTrue();
        expect(regExp.test("form\\.update\\.whatever")).toBeTrue();
        expect(regExp.test("form\\:update")).toBeTrue();
        expect(regExp.test("\\f\\o\\r\\m\\u\\p\\d\\a\\t\\e")).toBeTrue();
        expect(regExp.test("form:update")).toBeFalse();
    });
});