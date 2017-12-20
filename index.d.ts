interface NodeRequire {
    ensure: (
        paths: string[],
        callback: (require: <T>(path: string) => T) => void,
        moduleName?: string
    ) => void;
}

interface Promise<T> {
    finally: (callback) => Promise<T>;
}
