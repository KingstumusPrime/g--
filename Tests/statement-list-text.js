module.exports = test => {
    test(`
    "hello";
    42;`, 
    {
        type: 'Program',
        body: [
          {
            type: 'ExpressionStatement',
            expression: { type: 'SringLiteral', value: 'hello' }
          },
          {
            type: 'ExpressionStatement',
            expression: { type: 'NumericLiteral', value: 42 }
          }
        ]
      }
    )
}