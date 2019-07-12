
import { CJustSuccess, CNoneFailure, monad, Monadic } from "./monad"
import { Thenable } from './thenable'

/**
 * Define properties specific to Maybe monad
 *
 * @note Bind is not defined, since it is attached by decorator
 */
interface IMaybe<T> extends Thenable<T> {
    /**
     * @returns Wether this is None
     */
    isNone(): this is None<T>
    /**
     * @returns Wether this is Just
     */
    isJust(): this is Just<T>
}

/**
 * Container which represents value
 */
@monad
class CJust<T> extends CJustSuccess<T, undefined> implements IMaybe<T> {

    isNone(): this is None<T> {
        return false
    }

    isJust(): this is Just<T> {
        return true
    }
}

/**
 * Container which represents lack of value
 */
@monad
class CNone<T> extends CNoneFailure<T, undefined> implements IMaybe<T> {
    constructor() {
        super(undefined)
    }

    isNone(): this is None<T> {
        return true
    }

    isJust(): this is Just<T> {
        return false
    }
}

/**
 * Defined a bind() specific for Maybe
 */
interface Bindable<T> {
    bind<T, TResult1 = T, TResult2 = never>(
        onJust?: ((value: T) => TResult1 | Maybe<TResult1>) | undefined | null,
        onNone?: (() => TResult2 | Maybe<TResult2>) | undefined | null
    ): Maybe<TResult1 | TResult2>
}

/**
 * Representation of a value
 */
export type Just<T> = Monadic<CJust<T>, Bindable<T>>

/**
 * Representation of an absent value
 */
export type None<T> = Monadic<CNone<T>, Bindable<T>>

/**
 * Representation of a value which might not exist
 */
export type Maybe<T> = Just<T> | None<T>

/**
 * @param value Value which is going to be inclosed inside of Maybe
 * @returns Maybe with inclosed value as Just
 */
export const Just =
    <T>(value: T): Maybe<T> => new CJust(value) as any

/**
 * @returns Empty Maybe as None
 */
export const None =
    <T>(): Maybe<T> => new CNone() as any

/**
 * @param value Nullable value which is going to be inclosed inside of Maybe
 * @return Maybe of Just or None depends if the value was defined
 */
export const Maybe = <T>(value: T | undefined | null) =>
    value !== null && value !== undefined
    ?
        Just(value)
    :
        None()

/**
 * @param obj Object which might be Maybe
 * @returns Wether the object is Maybe
 */
export const isMaybe = <T>(obj: any): obj is Maybe<T> =>
    isNone(obj) || isJust(obj)

/**
 * @param obj Object which might be None
 * @returns Wether the object is None
 */
export const isNone = <T>(obj: any): obj is None<T> =>
    obj instanceof CNone

/**
 * @param obj Object which might be Just
 * @returns Wether the object is Just
 */
export const isJust = <T>(obj: any): obj is Just<T> =>
    obj instanceof CJust








