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
    /**
     * @returns Object of type T if available or throws an error which described absents of value
     * @note It is not right way to use the API,
     *       but it might be handy refactoring of an old codebase
     */
    getOrThrow(): T
}


export function fulfilled<T>( isMonad: ( value: any ) => boolean ) {
    return function ( target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any> ) {
        descriptor.value = function <TResult1 = T, TResult2 = never>(
            this: any,
            onfulfilled?: ( ( value: T ) => TResult1 | Thenable<TResult1> ) | undefined | null,
            onrejected?: ( ( reason: any ) => TResult2 | Thenable<TResult2> ) | undefined | null
        ): Thenable<TResult1 | TResult2> {
            if ( onfulfilled ) {
                const value = onfulfilled( this.v )
                return isMonad( value ) ? value : new target.constructor( value ) as any
            } else
                return this as any
        } as any
    }
}

export function rejected<T>( isMonad: ( value: any ) => boolean ) {
    return function ( target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any> ) {
        descriptor.value = function <T, TResult1 = T, TResult2 = never>(
            this: any,
            onfulfilled?: ( ( value: T ) => TResult1 | Thenable<TResult1> ) | undefined | null,
            onrejected?: ( ( reason: any ) => TResult2 | Thenable<TResult2> ) | undefined | null
        ): Thenable<TResult1 | TResult2> {
            if ( onrejected ) {
                const value = onrejected( this.v )
                return isMonad( value ) ? value : new target.constructor( value ) as any
            } else
                return this as any
        } as any
    }
}

/**
 * Container which might represent primary value, base for Just and Success
 */
export class CJustSuccess<T, E> {
    /**
     * @param v Primary stored value
     */
    constructor( private v: T ) { }

    get(): T {
        return this.v
    }

    getOrElse( value: T ): T {
        return this.v
    }

    getOrThrow(): T {
        return this.v
    }
}

/**
 * Container which might represent secondary value, base for None and Failure
 */
export class CNoneFailure<T, E> {
    /**
     * @param v Secondary stored value
     */
    constructor( protected v: E ) { }

    getOrElse( value: T ): T {
        return value
    }

    get() {
        return this.v
    }

    getOrThrow(): T {
        this.v
        throw this.v
    }
}