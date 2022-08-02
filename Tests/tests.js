
var assert = require("assert")
const {Parser} = require('../parser')

const parser = new Parser()
const tests = [require("./literals-test"),
                require("./statement-list-text"),
                require("./block-test")]
function exec() {
    const program = `
    "hello";
    42;
    `
    const ast = parser.parse(program)

    console.log(JSON.stringify(ast, null, 2))
}

function test(program, expected) {
    const ast = parser.parse(program)
    assert.deepEqual(ast, expected)
}

tests.forEach(testRun => testRun(test))
console.log('All assertions passed!')

