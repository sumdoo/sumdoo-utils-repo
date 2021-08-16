
export interface PackageManifest {
    // 包名
    name    : string
    // 描述
    description?: string;
    // 全局模块集合
    globals?: Record<string, string>
    // 是否生成 umd 格式
    iife   ?: boolean
    // 排除模块
    external?: string[]
    // 不导出
    deprecated?: boolean
}
