"use strict";
/**
 * Credits to https://github.com/darrylhodgins/typescript-memoize
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear = exports.MemoizeExpiring = exports.Memoize = void 0;
function Memoize(args) {
    let hashFunction;
    let ttlMs;
    let tags;
    if (typeof args === "object") {
        hashFunction = args.hashFunction;
        ttlMs = args.ttlMs;
        tags = args.tags;
    }
    else {
        hashFunction = args;
    }
    return (target, propertyKey, descriptor) => {
        if (descriptor.value != null) {
            descriptor.value = getNewFunction(descriptor.value, hashFunction, ttlMs, tags);
        }
        else if (descriptor.get != null) {
            descriptor.get = getNewFunction(descriptor.get, hashFunction, ttlMs, tags);
        }
        else {
            throw new Error("Only put a Memoize() decorator on a method or get accessor.");
        }
    };
}
exports.Memoize = Memoize;
function MemoizeExpiring(ttlMs, hashFunction) {
    return Memoize({
        ttlMs,
        hashFunction,
    });
}
exports.MemoizeExpiring = MemoizeExpiring;
const clearCacheTagsMap = new Map();
function clear(tags) {
    const cleared = new Set();
    for (const tag of tags) {
        const maps = clearCacheTagsMap.get(tag);
        if (maps) {
            for (const mp of maps) {
                if (!cleared.has(mp)) {
                    mp.clear();
                    cleared.add(mp);
                }
            }
        }
    }
    return cleared.size;
}
exports.clear = clear;
function getNewFunction(originalMethod, hashFunction, ttlMs = 0, tags) {
    const propMapName = Symbol("__memoized_map__");
    // The function returned here gets called instead of originalMethod.
    // eslint-disable-next-line func-names
    return function (...args) {
        let returnedValue;
        // @ts-ignore
        const that = this;
        // Get or create map
        // eslint-disable-next-line no-prototype-builtins
        if (!that.hasOwnProperty(propMapName)) {
            Object.defineProperty(that, propMapName, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: new Map(),
            });
        }
        const myMap = that[propMapName];
        if (Array.isArray(tags)) {
            for (const tag of tags) {
                if (clearCacheTagsMap.has(tag)) {
                    clearCacheTagsMap.get(tag).push(myMap);
                }
                else {
                    clearCacheTagsMap.set(tag, [myMap]);
                }
            }
        }
        if (hashFunction || args.length > 0 || ttlMs > 0) {
            let hashKey;
            // If true is passed as first parameter, will automatically use every argument, passed to string
            if (hashFunction === true) {
                hashKey = args.map((a) => a.toString()).join("!");
            }
            else if (hashFunction) {
                hashKey = hashFunction.apply(that, args);
            }
            else {
                // eslint-disable-next-line prefer-destructuring
                hashKey = args[0];
            }
            const timestampKey = `${hashKey}__timestamp`;
            let isExpired = false;
            if (ttlMs > 0) {
                if (!myMap.has(timestampKey)) {
                    // "Expired" since it was never called before
                    isExpired = true;
                }
                else {
                    const timestamp = myMap.get(timestampKey);
                    isExpired = Date.now() - timestamp > ttlMs;
                }
            }
            if (myMap.has(hashKey) && !isExpired) {
                returnedValue = myMap.get(hashKey);
            }
            else {
                returnedValue = originalMethod.apply(that, args);
                myMap.set(hashKey, returnedValue);
                if (ttlMs > 0) {
                    myMap.set(timestampKey, Date.now());
                }
            }
        }
        else {
            const hashKey = that;
            if (myMap.has(hashKey)) {
                returnedValue = myMap.get(hashKey);
            }
            else {
                returnedValue = originalMethod.apply(that, args);
                myMap.set(hashKey, returnedValue);
            }
        }
        return returnedValue;
    };
}
//# sourceMappingURL=memoize-decorator.js.map