
import typescript from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'
import { OutputOptions,  RollupOptions } from 'rollup'
import { activePackages } from '../meta/packages'

const configs: RollupOptions[] = [];

for (const { name, external } of activePackages) {

    const functionNames = ['index'];
    for (const fn of functionNames) {
        // 取得入口文件
        const input  = fn === 'index' ? `packages/${name}/index.ts` : `packages/${name}/${fn}/index.ts`
        const output: OutputOptions[] = [
            {
                file   : `packages/${name}/dist/${fn}.cjs.js`,
                format : 'cjs',
            },
            {
                file   : `packages/${name}/dist/${fn}.esm.js`,
                format : 'es',
            }
        ]

        configs.push({
            input,
            output,
            plugins: [
                typescript({
                    tsconfigOverride: { 
                        declaration: false,
                    }
                })
            ],
            external: [
                ...(external || [])
            ]
        })

        configs.push({
            input,
            output: {
                file   : `packages/${name}/dist/${fn}.d.ts`,
                format : 'es'
            },
            plugins: [
                dts(),
            ],
            external: [
                ...(external || [])
            ]
        })
    }
}

export default configs;
