import { isFunction } from "util"


const lift = (value: any, obj: any): any =>
    new (obj as any).constructor( value )

export const isPromiseLike = <T>(obj: any): obj is PromiseLike<T> => isFunction(obj.then)

export function monad<T extends {new(...args: any[]): {}}>(constructor: T) {
    return class extends constructor {
        bind = constructor.prototype.then
    }
}

export abstract class CJustSuccess<T> implements PromiseLike<T> {
    constructor( private v: T ) { }
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2> {
        if ( onfulfilled ) {
            const value = onfulfilled( this.v )
            return isPromiseLike( value ) ? value : lift( value, this )
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

export class CNoneFailure<T, E> implements PromiseLike<T> {
    constructor( protected v: E ) { }
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2> {
        if (onrejected) {
            const value = onrejected(this.v)
            return isPromiseLike<any>(value) ? value : lift( value, this )
        } else
            return this as any
    }
    getOrElse( value: T ): T {
        return value
    }
    get(): undefined {
        return undefined
    }
}

export type ToMonad<T, B> = B extends { bind: (...args: any[]) => any } ? T & B : never