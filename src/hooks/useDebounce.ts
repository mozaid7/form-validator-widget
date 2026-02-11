import { useCallback, useRef } from "react";

export function useDebounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): T {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    return useCallback(
        ((...args: any[]) => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                fn(...args);
            }, delay);
        }) as T,
        [fn, delay]
    );
}