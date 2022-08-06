module.exports = test => {
  // Simple variable declaration:
  test(`let x = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'VariableStatement',
        declarations: [
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'x',
            },
            init: {
              type: 'NumericLiteral',
              value: 42,
            },
          },
        ],
      },
    ],
  })
}