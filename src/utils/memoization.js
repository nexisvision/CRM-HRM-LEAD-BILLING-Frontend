import { useMemo } from 'react';

export const useMemoizedSelector = (selector, dependencies = []) => {
    return useMemo(() => selector, dependencies);
};

export const memoizeData = (data, key) => {
    const cache = new Map();
    return (...args) => {
        const cacheKey = args.join('-');
        if (!cache.has(cacheKey)) {
            cache.set(cacheKey, data(...args));
        }
        return cache.get(cacheKey);
    };
}; 