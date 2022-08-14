
var assert = require("assert")
const {Parser} = require('../parser')


const parser = new Parser()
const tests = [require("./literals-test"),
                require("./statement-list-text"),
                require("./block-test"),
                require("./math-tests"),
                require("./assignment-test"),
                require("./variable-test"),
                require("./if-test")
                ]
function exec() {
    const program = `
        if(hasSword == True && failed == null || victory == True){
            let victory = True;
        }
        else{
        }
    `
    const ast = parser.parse(program)

    console.log(JSON.stringify(ast, null, 2))
}

function test(program, expected) {
    const ast = parser.parse(program)
    assert.deepEqual(ast, expected)
}

exec()
tests.forEach(testRun => testRun(test))
console.log('All assertions passed!')

