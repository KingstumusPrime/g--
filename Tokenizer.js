const Spec = [
    // whitespace
    [/^\s+/, null],
    // single line comment
    [/^\/\/.*/, null],
    // multiline comment
    [/^\/\*[\s\S]*?\*\//, null],
    // symbols
    [/^;/, ';'],
    [/^{/, '{'], 
    [/^}/, '}'],
    [/^\(/, '('],
    [/^\)/, ')'],
    [/^\,/, ','],
    // operators
    [/^[+/-]/, 'ADDITIVE_OPERATOR'],
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],
    [/^=/, "ASSIGNMENT_OPERATOR"],
    // Idnetifier
    [/^let/, "PREFIX"],
    [/^[a-zA-Z_$][a-zA-Z\d$_]*/, "IDENTIFIER"],

    [/^\d+/, 'NUMBER'],
    [/^"[^]*"/, "STRING"],
    [/^'[^]*'/, "STRING"]
]


class Tokenizer {
    init(string) {
        this._string = string
        this._cursor = 0
    }
    isEOF() {
        return this._cursor === this._string.length
    }
    hasMoreTokens() {
        return this._cursor < this._string.length
    }
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null
        }

        const string = this._string.slice(this._cursor)

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string)

            if(tokenValue == null){
                continue
            }
            if(tokenType == null){
                return this.getNextToken()
            }
            return {
                type: tokenType,
                value: tokenValue
            }
        

        }
        throw new SyntaxError('Unexpected token: ' + string[0])
    }
    _match(regexp, string) {
        const matched = regexp.exec(string)
        if (matched == null) {
            return null
        }
        this._cursor += matched[0].length
         return matched[0]  
    }

    
}

module.exports = {
    Tokenizer,
}