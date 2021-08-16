import path from 'path'
import { execSync } from 'child_process'
import fs from 'fs-extra'
import { activePackages } from '../meta/packages';
import consola from 'consola';

const FILES_COPY_ROOT = [
    'LICENSE',
]

const FILES_COPY_LOCAL = [
    'package.json',
    'README.md',
]

const rootDir = path.resolve(__dirname, '..');
async function buildMetaFiles() {
    for(const { name } of activePackages){
        const packageRoot = path.resolve(rootDir, `packages/${name}`);
        const packageDist = path.resolve(packageRoot, 'dist');

        // 拷贝开源协议
        for (const file of FILES_COPY_ROOT) {
            await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file));
        }

        // 拷贝 package.json readme.md 文件至打包目录
        for(const file of FILES_COPY_LOCAL) {
            if (fs.existsSync(path.join(packageRoot, file))) {
                await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file));
            }
        }
    }
}

async function build() {
    consola.info('Clean up')
    execSync('yarn run clean', { stdio: 'inherit' })

    // consola.info('Generate Imports')
    // awiat updateImport

    consola.info('Rollup')
    execSync('yarn run build:rollup', { stdio: 'inherit' })

    await buildMetaFiles()
}

async function cli() {
    try {
        await build()
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

export { build }

if (require.main === module) cli();
