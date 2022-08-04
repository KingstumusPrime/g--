const {Tokenizer} = require("./Tokenizer")

class Parser {
    constructor() {
        this._string = ""
        this._tokenizer = new Tokenizer()
    }
    parse(string){
        this._string = string
        this._tokenizer.init(string)

        this._lookahead = this._tokenizer.getNextToken()

        return this.Program()
    }

    Program() {
        return{
            type: 'Program',
            body: this.StatementList()
        }
    }

    StatementList(stopLookAhead = null) {
        const StatementList = [this.Statement()]

        while(this._lookahead != null && this._lookahead.type != stopLookAhead) {
            StatementList.push(this.Statement())
        }
        return StatementList
    }

    Statement() {
        switch(this._lookahead.type) {
            case '{':
                 return this.BlockStatement()
            case ';':
                return this.EmptyStatement()
            default:
                return this.ExpressionStatement()
        }
    }
    EmptyStatement() {
        this._eat(';')
        return {type: 'EmptyStatement'}
    }
    BlockStatement() {
        this._eat('{')

        const body = this._lookahead.type !== '}' ? this.StatementList('}') : []

        this._eat('}')

        return {
            type: 'BlockStatement',
            body
        }
    }

    ExpressionStatement() {
        const expression = this.Expression()
        this._eat(';')
        return {
            type: "ExpressionStatement",
            expression
        }
    }

    Expression() {
        return this.AdditiveExpression()
    }

    AdditiveExpression() {
        let left = this.Literal();
        
        while(this._lookahead.type === 'ADDITIVE_OPERATOR') {
            const operator = this._eat('ADDITIVE_OPERATOR').value

            const right = this.Literal()

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }


        return left
    }
    Literal() {
        switch(this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral()
            case 'STRING':
                return this.StringLiteral()
        }
        throw new SyntaxError('Literal: unexpected literal production')
    }

    NumericLiteral() {
        const token = this._eat('NUMBER')
        return {
            type: "NumericLiteral",
            vale: Number(token.value)
        }
    }

    
    StringLiteral() {
        const token = this._eat('STRING')
        return {
            type: "SringLiteral",
            vale: token.value.slice(1,-1)
        }
    }
    

    _eat(tokenType) {
        const token = this._lookahead

        if(token == null) {
            throw new SyntaxError( 'unexpected end of input, expected: ${tokenType}')
        }

        if(token.type !== tokenType) {
            throw new SyntaxError( 'Unexpected end of token:' + token.value + ', expected:' + tokenType)
        }

        this._lookahead = this._tokenizer.getNextToken()

        return token
    }
}


module.exports = {
    Parser,
}

