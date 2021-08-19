module.exports = {
    extends: ['alloy', 'eslint-config-alloy'],
    rules: {
        /**
         * 函数最大定义参数 5
         */
        'max-params': ['error', 5],
        /**
         * 禁止对函数的参数重新赋值
         */
        'no-param-reassign': 0,
        /**
         * 生产模式禁止打印输出
         */
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        /**
         * 生产模式禁止 debug
         */
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        /**
         * 关闭无效 this 的检查
         */
        'no-invalid-this': 'off',
         /**
         * 关闭 return 不能 awiat 表达式
         */
        'no-return-await': 'off'
    },

    overrides: [
        {
            files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
            env: {
                jest: true,
            },
        },
    ],
};
