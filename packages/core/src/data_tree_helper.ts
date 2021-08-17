interface TreeHelperConfig {
    pid     : string;
    id      : string;
    children: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
    pid     : 'pid',
    id      : 'id',
    children: 'children',
};

interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

// 获取 tree 格式配置
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

export function findPathAll(tree: any, func: Fn, config: Partial<TreeHelperConfig> = {}) {
    config = getConfig(config);

    const path: any[] = [];
    const list = [...tree];
    const result: any[] = [];

    const visitedSet = new Set(),
        { children } = config;

    while (list.length) {
        const node = list[0];

        if (visitedSet.has(node)) {
            path.pop();
            list.shift();
        } else {
            visitedSet.add(node);
            node[children!] && list.unshift(...node[children!]);
            path.push(node);
            func(node) && result.push([...path]);
        }
    }
    return result;
}

export function findPath<T = any>(
    tree: any,
    func: Fn,
    config: Partial<TreeHelperConfig> = {}
): T | T[] | null {
    config = getConfig(config);

    const path: T[] = [];
    const list = [...tree];

    const visitedSet = new Set();
    const { children } = config;

    while (list.length) {
        const node = list[0];
        if (visitedSet.has(node)) {
            path.pop();
            list.shift();
        } else {
            visitedSet.add(node);
            node[children!] && list.unshift(...node[children!]);
            path.push(node);
            if (func(node)) {
                return path;
            }
        }
    }
    return null;
}

// 树结构过滤
export function filter<T = any>(
    tree: T[],
    func: (n: T) => boolean,
    config: Partial<TreeHelperConfig> = {}
): T[] {
    config = getConfig(config);
    const childrenKey = config.children as string;

    function listFilter(list: T[]) {
        return list
            .map((node: any) => ({ ...node }))
            .filter((node) => {
                node[childrenKey] = node[childrenKey] && listFilter(node[childrenKey]);
                return func(node) || (node[childrenKey] && node[childrenKey].length);
            });
    }

    return listFilter(tree);
}
