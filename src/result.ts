import { CJustSuccess, CNoneFailure, fulfilled, rejected } from "./monad"
import { Thenable } from './thenable'

const bindErrorMsg = "Result.bind() is should be full filled by monad decorator."

/**
 * Values which might represent an Error
 */
export type Throwable = Error | string

/**
 * Define properties specific to Result monad
 *
 * @note Bind is not defined, since it is attached by decorator
 */
interface IResult<T, E extends Throwable> extends Thenable<T> {
    /**
     * Accordingly apply the handlers produces a new Result as container for produced output
     * @param onJust Handler for fulfilled value
     * @param onNone Handler for onrejected value
     * @return Result object which inclose new value
     */
    bind<TResult1 = T, EResult1 extends Throwable = E, TResult2 = never, EResult2 extends Throwable = never >(
        onSuccess?: ((value: T) => TResult1 | IResult<TResult1, EResult1>) | undefined | null,
        onFailure?: ((reason: E) => EResult1 | IResult<TResult2, EResult2>) | undefined | null
    ): Result<TResult1 | TResult2, EResult1 | EResult2>
    /**
     * @returns Wether this is Failure
     */
    isFailure(): this is Failure<T, E>
    /**
     * @returns Wether this is Success
     */
    isSuccess(): this is Success<T, E>
}

/**
 * Represents a result of successful computation
 */
export type Success<T, E extends Throwable> = CSuccess<T, E>

/**
 * Represents an Error occurred in during execution
 */
export type Failure<T, E extends Throwable> = CFailure<T, E>

/**
 * Represents a result of computation which can potentially fail
 */
export type Result<T, E extends Throwable> = Success<T, E> | Failure<T, E>

/**
 * @param value Value which is going to be inclosed inside of Result
 * @returns Result with inclosed value as Success
 */
export const Success =
    <T, E extends Throwable> (value: T): Result<T, E> =>
        new CSuccess(value) as any

/**
 * @param error Error which is going to be inclosed inside of Result
 * @returns Result with inclosed error as Failure
 */
export const Failure =
    <T, E extends Throwable>(error: E): Result<T, E> =>
        new CFailure(error) as any

/**
 * @param action Function for evaluation
 * @returns Result of the evaluated function as
 * Success or Failure depending from situation
 */
export const Result = <T, E extends Throwable>(
    action: () => T | Result<T, E>
) => {
    try {
        const result = action()
        if (isResult(result)) {
            return result
        } else {
            return Success<T, E>(result)
        }
    } catch (e) {
        return Failure<T, E>(e)
    }
}

/**
 * @param obj Object which might be Result
 * @returns Wether the object is Result
 */
export const isResult =
    <T, E extends Throwable>(obj: any): obj is Result<T, E> =>
        isSuccess(obj) || isFailure(obj)

/**
 * @param obj Object which might be Failure
 * @returns Wether the object is Failure
 */
export const isFailure =
    <T, E extends Throwable>(obj: any): obj is Failure<T, E> =>
        obj instanceof CFailure

/**
 * @param obj Object which might be Success
 * @returns Wether the object is Success
 */
export const isSuccess =
    <T, E extends Throwable>(obj: any): obj is Success<T, E> =>
        obj instanceof CSuccess

/**
 * Container which represents result of successful computation
 */
class CSuccess<T, E extends Throwable> extends CJustSuccess<T, E> implements IResult<T, E> {

    @fulfilled<T>(isResult)
    bind<TResult1 = T, EResult1 extends Throwable = E, TResult2 = never, EResult2 extends Throwable = never >(
        onSuccess?: ((value: T) => TResult1 | Result<TResult1, EResult1>) | undefined | null,
        onFailure?: ((reason: E) => EResult1 | Result<TResult2, EResult2>) | undefined | null
    ): Result<TResult1 | TResult2, EResult1 | EResult2> {
        throw new Error( bindErrorMsg )
    }

    isFailure(): this is Failure<T, E> {
        return false
    }

    isSuccess(): this is Success<T, E> {
        return true
    }
}

/**
 * Container which represents an Error occurred in during execution
 */
class CFailure<T, E extends Throwable> extends CNoneFailure<T, E> implements IResult<T, E> {

    @rejected<T>(isResult)
    bind<TResult1 = T, EResult1 extends Throwable = E, TResult2 = never, EResult2 extends Throwable = never >(
        onSuccess?: ((value: T) => TResult1 | Result<TResult1, EResult1>) | undefined | null,
        onFailure?: ((reason: E) => EResult1 | Result<TResult2, EResult2>) | undefined | null
    ): Result<TResult1 | TResult2, EResult1 | EResult2> {
        throw new Error( bindErrorMsg )
    }

    isFailure(): this is Failure<T, E> {
        return true
    }

    isSuccess(): this is Success<T, E> {
        return false
    }
}
