import { Thenable, isThenable } from './thenable'

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
 * @param obj Object of type which has to be constructed
 * @param args Arguments fo the constructor
 * @returns New object of the same type
 */
const construct = (obj: any, ...args: any[]): any =>
    new (obj as any).constructor( ...args )

/**
 * Decorator reference then from bind to complete monadic API
 * @param constructor Constructor of PromiseLike object
 * @returns Constructor of monadic object
 */
export function monad<T extends {new(...args: any[]): Thenable<any> }>(constructor: T): T & { ok: string } {
    return class Bindable extends constructor {
        bind = constructor.prototype.then
        ok = "string"
    } as any
}

/**
 * Container which might represent primary value, base for Just and Success
 */
export abstract class CJustSuccess<T, E> implements Thenable<T>, Gettable<T, E> {
    /**
     * @param v Primary stored value
     */
    constructor( private v: T ) { }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2> {
        if ( onfulfilled ) {
            const value = onfulfilled( this.v )
            return isThenable( value ) ? value : construct( this, value )
        }
        else
            return this as any
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
export class CNoneFailure<T, E> implements Thenable<T>, Gettable<T, E> {
    /**
     * @param v Secondary stored value
     */
    constructor( protected v: E ) { }

    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | Thenable<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | Thenable<TResult2>) | undefined | null
    ): Thenable<TResult1 | TResult2> {
        if (onrejected) {
            const value = onrejected(this.v)
            return isThenable<any>(value) ? value : construct( this, value )
        } else
            return this as any
    }

    getOrElse( value: T ): T {
        return value
    }

    get()  {
        return this.v
    }
}