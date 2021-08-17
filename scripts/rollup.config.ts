
import type { OutputOptions,  RollupOptions  } from 'rollup'

import dts                  from 'rollup-plugin-dts'
import typescript           from 'rollup-plugin-typescript2'
import { activePackages }   from '../meta/packages'

const configs: RollupOptions[] = [];

for (const { name, external } of activePackages) {

    // 取得入口文件
    const input  = `packages/${name}/src/index.ts`;
    const output: OutputOptions[] = [
        {
            file   : `packages/${name}/dist/index.cjs.js`,
            format : 'cjs',
        },
        {
            file   : `packages/${name}/dist/index.esm.js`,
            format : 'es',
        }
    ];

    // 转换 typescript
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

    // 生成 dts
    configs.push({
        input,
        output: {
            file   : `packages/${name}/dist/index.d.ts`,
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

export default configs;
