module.exports = test => {
    test(`
    {
       hello;
       42;
    }
    `,
    {
        type: 'Program',
        body: [
          {
            type: "BlockStatement",
            body: [
                {
                    type: 'ExpressionStatement',
                    expression: { type: 'SringLiteral', vale: 'hello' }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: { type: 'NumericLiteral', vale: 42 }
                  }
                ]
            }
        ]
      },)
}