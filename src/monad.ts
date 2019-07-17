import { Thenable, isThenable } from './thenable'

const bindErrorMsg = "Maybe.bind() is should be full filled by monad decorator."

/**
 * Container of with a fallback value
 */
interface Gettable<T, E> {
    /**
     * @returns Object of type T if available, object of type E as fallback
     */
    get(): T | E
    /**
     * @param value Fallback value in case T is not available
     * @return Stored value of T or a provided fallback
     */
    getOrElse( value: T ): T
}

/**
 * TODO: document quick fix
 */
export function fulfilled(name: string, isMonad: (value: any) => boolean ) {
    return function<V extends {new(...args: any[]): Thenable<any> }>(constructor: V) {
        constructor.prototype[name] = function<T, TResult1 = T, TResult2 = never>(
            this: any,
            onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
            onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
        ): Thenable<TResult1 | TResult2> {
            if ( onfulfilled ) {
                const value = onfulfilled( this.v )
                return isMonad( value ) ? value : new constructor( value ) as any
            }
            else
                return this as any
        }
        return constructor as any
    }
}

/**
 * TODO: document quick fix
 */
export function rejected(name: string, isMonad: (value: any) => boolean ) {
    return function<V extends {new(...args: any[]): Thenable<any> }>(constructor: V) {
        constructor.prototype[name] = function<T, TResult1 = T, TResult2 = never>(
            this: any,
            onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
            onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
        ): Thenable<TResult1 | TResult2> {
            if ( onrejected ) {
                const value = onrejected( this.v )
                return isMonad( value ) ? value : new constructor( value ) as any
            }
            else
                return this as any
        }
        return constructor as any
    }
}

/**
 * Container which might represent primary value, base for Just and Success
 */
@fulfilled("then", isThenable)
export class CJustSuccess<T, E> implements Thenable<T>, Gettable<T, E> {
    /**
     * @param v Primary stored value
     */
    constructor( private v: T ) { }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2> {
        throw new Error(bindErrorMsg)
    }

    get(): T {
        return this.v
    }

    getOrElse( value: T ): T {
        return this.v
    }
}

/**
 * Container which might represent secondary value, base for None and Failure
 */
@rejected("then", isThenable)
export class CNoneFailure<T, E> implements Thenable<T>, Gettable<T, E> {
    /**
     * @param v Secondary stored value
     */
    constructor( protected v: E ) { }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2> {
        throw new Error(bindErrorMsg)
    }

    getOrElse( value: T ): T {
        return value
    }

    get()  {
        return this.v
    }
}