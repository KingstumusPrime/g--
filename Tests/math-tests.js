const { type } = require("os")

module.exports = test => {
    test(`2 + 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        vale: 2
                    },
                    right: {
                        type: 'NumericLiteral',
                        vale: 2
                    }
                }
            }
        ]
        
    }),
    test(`3 + 2 - 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '-',
                    left: {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: {
                            type: 'NumericLiteral',
                            vale: 3
                        },
                        right: {
                            type: 'NumericLiteral',
                            vale: 2
                        }
                    },
                    right: {
                        type: 'NumericLiteral',
                        vale: 2
                    }
                }
            }
        ]
        
    }),
    test(`2 + 2 * 2;`, {
        type: 'Program',
        body: [
            {
                type: 'ExpressionStatement',
                expression: {
                    type: 'BinaryExpression',
                    operator: '+',
                    left: {
                        type: 'NumericLiteral',
                        vale: 2
                    },
                    right: {
                        type: 'BinaryExpression',
                        operator: '*',
                        left: {
                            type: 'NumericLiteral',
                            vale: 2
                        },
                        right: {
                            type: 'NumericLiteral',
                            vale: 2
                        }
                    }
                }
            }
        ]
        
    })
}