
import type { PackageManifest } from './types';
export const packages: PackageManifest[] = [
    {
        name: 'core',
        description: '工具函数核心库'
    }
]

export const activePackages = packages.filter((i : any) => !i.deprecatedy);
