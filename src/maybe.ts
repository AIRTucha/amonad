
import { CJustSuccess, CNoneFailure, fulfilled, rejected } from "./monad"
import { Thenable } from './thenable'

const bindErrorMsg = "Maybe.bind() is should be full filled by monad decorator."

/**
 * Define properties specific to Maybe monad
 *
 * @note Bind is not defined, since it is attached by decorator
 */
interface IMaybe<T> extends Thenable<T> {
    /**
     * Accordingly apply the handlers produces a new Maybe as container for the output of called function
     * @param onJust Handler for fulfilled value
     * @param onNone Handler for onrejected value
     * @return Maybe object which inclose new value
     */
    bind<TResult1 =  T, TResult2 = never>(
        onJust?: ((value: T) => TResult1 | IMaybe<TResult1>) | undefined | null,
        onNone?: (() => TResult2 | IMaybe<TResult2>) | undefined | null
    ): Maybe<TResult1 | TResult2>
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
 * Representation of a value
 */
export type Just<T> = CJust<T>

/**
 * Representation of an absent value
 */
export type None<T> = CNone<T>

/**
 * Representation of a value which might not exist
 */
export type Maybe<T> = Just<T> | None<T>

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
 * Container which represents value
 */
class CJust<T> extends CJustSuccess<T, undefined> implements IMaybe<T> {

    @fulfilled<T>(isMaybe)
    bind<TResult1 =  T, TResult2 = never>(
        onJust?: ((value: T) => TResult1 | Maybe<TResult1>) | undefined | null,
        onNone?: (() => TResult2 | Maybe<TResult2>) | undefined | null
    ): Maybe<TResult1 | TResult2> {
        throw new Error( bindErrorMsg )
    }

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
class CNone<T> extends CNoneFailure<T, undefined> implements IMaybe<T> {
    constructor() {
        super(undefined)
    }

    @rejected<T>(isMaybe)
    bind<TResult1 =  T, TResult2 = never>(
        onJust?: ((value: T) => TResult1 | Maybe<TResult1>) | undefined | null,
        onNone?: (() => TResult2 | Maybe<TResult2>) | undefined | null
    ): Maybe<TResult1 | TResult2> {
        throw new Error( bindErrorMsg )
    }

    isNone(): this is None<T> {
        return true
    }

    isJust(): this is Just<T> {
        return false
    }
}









