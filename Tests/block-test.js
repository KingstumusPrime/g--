module.exports = test => {
    test(`
    {
       "hello";
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
                    expression: { type: 'SringLiteral', value: 'hello' }
                  },
                  {
                    type: 'ExpressionStatement',
                    expression: { type: 'NumericLiteral', value: 42 }
                  }
                ]
            }
        ]
      },),
      test(`
      {

      }
      `,
      {
          type: 'Program',
          body: [
            {
              type: "BlockStatement",
              body: [
              

                  ]
              }
          ]
        },),

        test(`
        {
           "hello";
           {
            42;
           }
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
                        expression: { type: 'SringLiteral', value: 'hello' }
                      },
                      {
                        type: "BlockStatement",
                        body: [
                      {
                        type: 'ExpressionStatement',
                        expression: { type: 'NumericLiteral', value: 42 }
                      }
                    ]
                     }
                    ]
                }
            ]
          },)
}