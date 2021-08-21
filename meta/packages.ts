
import type { PackageManifest } from './types';
export const packages: PackageManifest[] = [
    // {
    //     name: 'axios',
    //     description: '工具函数请求库'
    // },
    // {
    //     name: 'core',
    //     description: '工具函数核心库'
    // },
    {
        name        : 'uniapp-helper',
        description : '小程序工具函数集合',
    }
    // {
    //     name: 'web',
    //     description: 'Web-工具函数整合'
    // }
]

export const activePackages = packages.filter((i : any) => !i.deprecatedy);
