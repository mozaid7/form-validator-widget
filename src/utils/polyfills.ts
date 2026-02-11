
if (!Array.prototype.some){
    Array.prototype.some = function<T>(
        this: T[],
        callback: (value: T, index: number, array: T[]) => boolean, thisArg?: any
    ): boolean {
        for(let i=0; i< this.length; i++){
            if(callback.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };    
}

if (!Array.prototype.every){
    Array.prototype.every = function<T>(
        this: T[],
        callback: (value: T, index: number, array: T[]) => boolean, thisArg?: any
    ): boolean {
        for(let i=0; i< this.length; i++){
            if(!callback.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
        return true;
    } as typeof Array.prototype.every;    
}

if (!String.prototype.trim){
    String.prototype.trim = function(): string {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
):  T => {
    let inThrottle: boolean;
    let lastResult: ReturnType<T>;

    return function(this: any, ...args: any[]) {
        if(!inThrottle) {
            inThrottle = true;
            lastResult = func.apply(this, args);
            setTimeout(() => inThrottle = false, limit);
        }
        return lastResult;
    } as T;
};
