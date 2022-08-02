module.exports = test => {
    test(`42;`, {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'NumericLiteral', vale: 42 }
        }
      ]
    })

    test("'hello';", {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'SringLiteral', vale: 'hello' }
        }
      ]
    })

    test('"hello";', {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: { type: 'SringLiteral', vale: 'hello' }
        }
      ]
    })
}