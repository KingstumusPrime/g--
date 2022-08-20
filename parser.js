
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
            case 'IF':
                return this.IfStatement()
            case 'ITERATION_STATEMENT':
                return this.IterationStatment()
            case "CONTINUE":
                return this.ContinueStatment()
            case "BREAK":
                return this.BreakStatment()
            case "FUNCTION":
                return this.FunctionDecloration()
            case "RETURN":
                return this.ReturnStatement()
            case "CLASS":
                return this.ClassDecloration()
            default:
                return this.ExpressionStatement()
        }
    }

    ReturnStatement(){
        this._eat("RETURN")
        var params = []

        if(this._lookahead.type != ";"){
            params.push(this.Expression())

            while(this._lookahead != null && this._lookahead.type != ";") {
                this._eat(",")
                params.push(this.Expression())
            }
        }
        this._eat(";")
        return {
                type: "ReturnStatment",
                params: params
        }    
    }

    FunctionDecloration(){
        this._eat("FUNCTION")
        const name = this.Identifier()
        const params = this.Arguments()
        const body = this.BlockStatement()
        return {
            id: name,
            params: params,
            body: body
        } 
    }

    Arguments(){
        this._eat("(")
        var params = []
        if(this._lookahead.type == "IDENTIFIER"){
            params.push(this.VariableDeclaration())

            while(this._lookahead != null && this._lookahead.type != ")" && this._lookahead.type != ";") {
                this._eat(",")
                params.push(this.VariableDeclaration())
            }
        }
        this._eat(")")
        return params
    }

    IterationStatment(){
        switch(this._lookahead.value){
            case "for":
                return this.ForStatment()
            case "do":
                return this.DoWhileStatment()
            case "while":
                return this.WhileStatment() 
        }
    }

    ForStatment(){
        this._eat("ITERATION_STATEMENT")
        this._eat("(")
        const init = this.ForStatmentInit()
        const test = this.Expression()
        this._eat(';')
        var update = null 
        if(this._lookahead != null && this._lookahead.type != ")" ){
            update = this.Expression()
            this._eat(";")
        }
        this._eat(")")
        const body = this.Statement()
        return {
            type: "ForStatment",
            init: init,
            test: test,
            update: update,
            body: body
        }
    }

    ForStatmentInit(){
        const init = this.VariableStatementInit()
        this._eat(";")
        return init
    }

    

    WhileStatment(){
        this._eat("ITERATION_STATEMENT")
        let test = this.ParenthesizedExpression()
        let body = this.Statement()
        
        return {
            type: "WhileStatment",
            test: test,
            body: body
        } 
    }

    DoWhileStatment(){
        this._eat("ITERATION_STATEMENT")
        let body = this.Statement()
        this._eat("ITERATION_STATEMENT")
        let test = this.ParenthesizedExpression()
        this._eat(";")
        return {
            type: "DoWhileStatemnet",
            body: body,
            test: test
        }
    }

    ContinueStatment(){
        this._eat("CONTINUE")
        this._eat(";")
        return{
            type: "ContinueStatment"
        }
    }

    BreakStatment(){
        this._eat("BREAK")
        this._eat(";")
        return{
            type: "BreakStatment"
        }
    }

    IfStatement() {
        this._eat("IF")
        let test = this.ParenthesizedExpression()
        let consequent = this.Statement()
        var alternate = null
        if(this._lookahead != null && this._lookahead.type == "ELSE" ){
            this._eat("ELSE")
            alternate = this.Statement()
        }
        return {
            type: "IfStatement",
            test: test,
            consequent: consequent,
            alternate: alternate
        }
    }


    ClassDecloration(){
        this._eat("CLASS")
        const name = this.Identifier()
        var superClass = null
        if(this._lookahead != null && this._lookahead.type == "FROM"){
            this._eat("FROM")
            superClass = this.Identifier()
        }
        const body = this.BlockStatement()
        
        return {
            type: "ClassDeclaration",
            id: name,
            superClass: superClass,
            body: body
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

        let expression = this.Expression()
        this._eat(';')
        return {
            type: "ExpressionStatement",
            expression
        }
    }



    Expression() {
        return this.AssignmentExpression()
    }

    AssignmentExpression() {
        var left = this.LogicalExpression()
        while(this._lookahead.type === "ASSIGNMENT_OPERATOR") {
            if(left.type != "Identifier"){
                throw console.error("EXPECTED TYPE OF IDENITIFER");
            }
            const operator = this._eat("ASSIGNMENT_OPERATOR").value

            const right = this.Expression()

            left = {
                type: 'AssignmentExpression',
                operator,
                left,
                right
            }

        }

        if(this._lookahead.type == "("){
            if(left.type != "Identifier"){
                throw console.error("EXPECTED TYPE OF FUNCTION IDENITIFER");
            }
            const args = this.Arguments()
            left = {
                type: "CallExpressionStatement",
                callee: left,
                arguments: args,
                
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

    LogicalExpression(){
        let left = this.EqualityExpression();
        
        while(this._lookahead.type === "LOGICAL_OPERATOR") {
            const operator = this._eat("LOGICAL_OPERATOR").value

            const right = this.Expression()

            left = {
                type: 'LogicalExpression',
                operator,
                left,
                right
            }
        }
        return left
    }
    EqualityExpression(){
        return this._BinaryExpression(
            "RealationalExpression",
            "EQUALITY_OPERATOR"
            )
    }
    RealationalExpression(){
        return this._BinaryExpression(
            "AdditiveExpression",
            "REALATIONAL_OPERATOR"
        )
    }

    AdditiveExpression() {
        return this._BinaryExpression(
            'MultiplicativeExpression',
            'ADDITIVE_OPERATOR'
        )
    }

    MultiplicativeExpression() {
        return this._BinaryExpression(
            'CallExpression',
            'MULTIPLICATIVE_OPERATOR'
        )
    }

    CallExpression(){
        let left = this.UnaryExpression();
        var params = []
        if(this._lookahead.type === "(") {
            this._eat("(")
            if(this._lookahead.type != ")"){
                params.push(this.LogicalExpression())
                while(this._lookahead.type != ")"){
                    this._eat(",")
                    params.push(this.LogicalExpression())
                }
            }
            this._eat(')')
            
            return {
                type: "CallExpression",
                callee: left,
                arguments: params

            }
                
        }


        return left
    }

    UnaryExpression(){

        while(this._lookahead.type === "UNARY_OPERATOR" || this._lookahead.value == "-") {
            if(this._lookahead.value == "-"){
                this._lookahead.type = "UNARY_OPERATOR"
    
            }
            var operator = this._eat("UNARY_OPERATOR").value
        }

        let argument = this.PrimaryExpression() 
        if(operator){
            return {
                type: "UnaryExpression",
                operator: operator,
                argument: argument, 
            }
        }
        else{
            return argument
        }
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
            case 'STRING':
                return this.StringLiteral()
            case 'BOOL':
                return this.BooleanLiteral()
            case 'NULL':
                return this.NullLiteral()
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
    
    BooleanLiteral(){
        const token = this._eat('BOOL')
        return {
            type: "BooleanLiteral",
            value: token.value
        }    
    }

    NullLiteral(){
        const token = this._eat('NULL')
        return {
            type: "NullLiteral",
            value: token.value
        }    
    }

    _eat(tokenType) {
        const token = this._lookahead

        // if(tokenType == ';'){
        // // if(token.type)
        // //     if(this._lookahead.type != ';' ){
        // //         token.type = ';'
        // //     }

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

