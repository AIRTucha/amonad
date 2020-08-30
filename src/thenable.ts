import { type } from "os"

export interface Thenable<T> extends PromiseLike<T> {
    /**
     * Implementation of PromiseLike.then() for proper functioning of await
     * @param onfulfilled Handler for fulfilled value
     * @param onrejected Handler for onrejected value
     * @return PromiseLike object which inclose new value
     */
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ( ( value: T ) => TResult1 | PromiseLike<TResult1> ) | undefined | null,
        onrejected?: ( ( reason: any ) => TResult2 | PromiseLike<TResult2> ) | undefined | null
    ): PromiseLike<TResult1 | TResult2>
}

/**
 * @param obj Object which might be Thenable
 * @returns Wether the object is Thenable
 */
export const isThenable = <T>( obj: any ): obj is Thenable<T> => typeof obj.then === 'function'