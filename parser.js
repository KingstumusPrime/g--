const { checkPrime } = require("crypto")
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
            case 'PREFIX':
                return this.VariableStatemnet()
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
        switch(this._lookahead.type){
            case 'IDENTIFIER':
                return this.AssignmentExpression()
            default:    
                return this.AdditiveExpression()
        }
    }

    AssignmentExpression() {

        var left = this.PrimaryExpression()
        
        while(this._lookahead.type === "ASSIGNMENT_OPERATOR") {
            const operator = this._eat("ASSIGNMENT_OPERATOR").value

            const right = this.Expression()

            left = {
                type: 'AssignmentExpression',
                operator,
                left,
                right
            }
        }


        return left
    }

    Identifier() {
        const name = this._eat('IDENTIFIER').value;
        return {
          type: 'Identifier',
          name,
        }
    }



    AdditiveExpression() {
        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR'
        )
    }

    MultiplicativeExpression() {
        return this._BinaryExpression(
            'PrimaryExpression',
            'MULTIPLICATIVE_OPERATOR'
        )
    }

    _BinaryExpression(builderName, operatorToken) {
        let left = this[builderName]();
        
        while(this._lookahead.type === operatorToken) {
            const operator = this._eat(operatorToken).value

            const right = this[builderName]()

            left = {
                type: 'BinaryExpression',
                operator,
                left,
                right
            }
        }


        return left
    }
    PrimaryExpression() {
        switch(this._lookahead.type){
            case '(':
                return this.ParenthesizedExpression()
            case 'IDENTIFIER':
                return this.Identifier()
            default:
                return this.Literal()
        }
    }


    ParenthesizedExpression() {
        this._eat('(')
        const expression = this.Expression()
        this._eat(')')
        return expression
    }

    Literal() {
        switch(this._lookahead.type) {
            case 'NUMBER':
                return this.NumericLiteral()
            case 'IDENTIFIER':
                return this.Identifier()
            case 'STRING':
                return this.StringLiteral()
        }
        throw new SyntaxError('Literal: unexpected literal production of type ' + this._lookahead.type )
    }

    NumericLiteral() {
        const token = this._eat('NUMBER')
        return {
            type: "NumericLiteral",
            value: Number(token.value)
        }
    }



    StringLiteral() {
        const token = this._eat('STRING')
        return {
            type: "SringLiteral",
            value: token.value.slice(1,-1)
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

    VariableStatementInit(){
        this._eat("PREFIX")
        return this.VariableDeclarationList()
    }

    VariableDeclarationList(){
        const DeclarationList = [this.VariableDeclaration()]

        while(this._lookahead != null && this._lookahead.type != "ASSIGNMENT_OPERATOR" && this._lookahead.type != ";") {
            this._eat(",")
            DeclarationList.push(this.VariableDeclaration())
        }
        return DeclarationList
    }

    VariableDeclaration() {
        const id = this.Identifier()
        if(this._lookahead.type == "ASSIGNMENT_OPERATOR"){
            this._eat("ASSIGNMENT_OPERATOR")
            var right = this.PrimaryExpression()
        }
        else{
            var right = null
        }

        return {
            type: "VariableDeclaration",
            id: id,
            init: right

        }
    }

    VariableStatemnet(){
        const variableStatement = this.VariableStatementInit();
        this._eat(';');
        return {
            type: "VariableStatement",
            declarations: variableStatement
        };
    }
}


module.exports = {
    Parser,
}

