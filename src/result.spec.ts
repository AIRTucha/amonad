import { expect } from 'chai'

import { Just, None, Maybe } from "./maybe"

import { Success, isSuccess, isFailure, Failure, Result, isResult } from "./result"
import { testNumber1, mapNumbersToNumber, mapNumberToString, testString1, mapStringToString, testNumber2 } from './testUtils'

const testValue = 1
const errorMsg = "testError"

const throwIncorrectTypeIdentifiedType = () => {
    throw "Incorrectly identified type"
}

const assertUnchangedJust = ( monad: Result<number | string, string>) =>
    expect(monad.get()).to.be.eql(testNumber1)

const assertUnchangedNone = ( monad: Result<number | string, string>) =>
    expect(monad.get()).to.be.eql(testString1)

const assertFulfilledMapNumberToNumber = ( maybe: Result<number, string>) =>
    expect(maybe.get()).to.be.eql(mapNumbersToNumber(testNumber1))

const assertFulfilledMapNumberToString = ( maybe: Result<string, string>) =>
    expect(maybe.get()).to.be.eql(mapNumberToString(testNumber1))

const assertFulfilledMapStringToString = ( maybe: Result<string, string>) =>
    expect(maybe.get()).to.be.eql(mapStringToString(testString1))

const assertIsJust = ( maybe: Result<any, any> ) =>
    expect(maybe.isSuccess()).to.be.true

const assertIsNone = ( maybe: Result<any, any> ) =>
    expect(maybe.isFailure()).to.be.true

const assertRejectedMapStringToString = ( maybe: Result<number, string>) =>
    expect(maybe.get()).to.be.eql(mapStringToString(testString1))

const assertRejectedMapStringToError = ( maybe: Result<number, Error>) => {
    if (maybe.isFailure() ) {
        const error = maybe.get()
        expect(error).to.be.instanceOf(Error)
        expect(error.message).to.be.eql(testString1)
    }
}


const assertRejectedMapNumberToString = ( maybe: Result<string, string>) =>
    expect(maybe.get()).to.be.eql(testNumber1)

const assertIgnoreOnReject = ( maybe: Result<number | string, string>) =>
    assertIsJust(maybe) && assertUnchangedJust(maybe)

const assertIgnoreOnFullfil = ( maybe: Result<number | string, string>) =>
    assertIsNone(maybe) && assertUnchangedNone(maybe)

describe("Result", () => {
    describe("Success", () => {
        const success = Success(testValue)

        describe("isSuccess()", () => {

            it("function", () => {
                if (isSuccess(success)) {
                    const value: number = success.get()
                    expect(value).to.be.eql(testValue)
                } else
                    throwIncorrectTypeIdentifiedType()
            })

            it("method", () => {
                if (success.isSuccess()) {
                    const value: number = success.get()
                    expect(value).to.be.eql(testValue)
                } else
                    throwIncorrectTypeIdentifiedType()
            })
        })

        describe("isFailure()", () => {

            it("function", () => {
                if (isFailure(success))
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = success.get()
                    expect(value).to.be.eql(testValue)
                }
            })

            it("method", () => {
                if (success.isFailure())
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = success.get()
                    expect(value).to.be.eql(testValue)
                }
            })
        })

        describe("bind()", () => {
            let monad!: Result<number, string>

            beforeEach(() => {
                monad = Success(testNumber1)
            })

            describe("onfulfilled mapped to", () => {

                it('value of the same type', () => {
                    const result = monad
                        .bind( mapNumbersToNumber )
                    assertIsJust(result)
                    return assertFulfilledMapNumberToNumber(result)
                })

                it('value of a different type', () => {
                    const result = monad
                        .bind( mapNumberToString )
                    assertIsJust(result)
                    return assertFulfilledMapNumberToString(result)
                })

                describe("monad of", () => {
                    it('the same type', () => {
                        const result = monad
                            .bind<string>( value => Success(mapNumberToString(value)))
                        assertIsJust(result)
                        return assertFulfilledMapNumberToString(result)
                    })

                    it('an opposite type', () => {
                        const result = monad
                            .bind<string>( value => Failure<string, string>(mapNumberToString(value)))
                        assertIsNone(result)
                        return assertFulfilledMapNumberToString(result)
                    })

                    it('an different type', async () => {
                        const result = monad
                            .bind( value => Promise.resolve(mapNumberToString(value)) )
                        assertIsJust(result)
                        const promise = await result
                        const maybe = await promise
                        expect(maybe).to.be.eql(mapNumberToString(testNumber1))
                    })
                })
            })

            describe("onrejected ignore mapping to", () => {
                it('value of the same type', () => {
                    const result = monad
                        .bind(
                            undefined,
                            mapStringToString
                        )
                    return assertIgnoreOnReject(result)
                })

                it('value of a different type', () => {
                    const result = monad
                        .bind(
                            undefined,
                            mapStringToString
                        )
                    return assertIgnoreOnReject(result)
                })

                describe("monad of", () => {
                    it('the same type', () => {
                        const result: Result<number | string, string> = monad
                            .bind<number, string, string, string>(
                                undefined,
                                value => Success<string, string>(mapStringToString(value))
                            )
                        return assertIgnoreOnReject(result)
                    })

                    it('an opposite type', () => {
                        const result = monad
                            .bind<number, string, number, string>(
                                undefined,
                                value => Failure<number, string>(value)
                            )
                        return assertIgnoreOnReject(result)
                    })
                })
            })
        })
    })

    describe("Failure", () => {
        const failure = Failure<number, string>(errorMsg)

        describe("isSuccess()", () => {

            it("function", () => {
                if (isSuccess(failure))
                    throwIncorrectTypeIdentifiedType()
                else
                    expect(failure.get()).to.be.eql(errorMsg)
            })

            it("method", () => {
                if (failure.isSuccess())
                    throwIncorrectTypeIdentifiedType()
                else
                    expect(failure.get()).to.be.eql(errorMsg)
            })
        })

        describe("isFailure()", () => {

            it("function", () => {
                if (isFailure(failure))
                    expect(failure.get()).to.be.eql(errorMsg)
                else
                    throwIncorrectTypeIdentifiedType()
            })

            it("method", () => {
                if (failure.isFailure())
                    expect(failure.get()).to.be.eql(errorMsg)
                else
                    throwIncorrectTypeIdentifiedType()
            })
        })

        describe("bind()", () => {
            let monad: Result<number, string>

            beforeEach( () => {
                monad = Failure(testString1)
            })

            describe("onfulfilled ignore mapping to", () => {

                it('value of the same type', () => {
                    const result = monad
                        .bind( mapNumbersToNumber )
                    assertIgnoreOnFullfil(result)
                })

                it('value of a different type', () => {
                    const result = monad
                        .bind( mapNumberToString )
                    assertIgnoreOnFullfil(result)
                })

                describe("monad of", () => {

                    it('the same type', () => {
                        const result = monad
                            .bind<number>( value => Failure<number, string>(mapNumberToString(value)) )
                        assertIgnoreOnFullfil(result)
                    })

                    it('an opposite type', () => {
                        const result = monad
                            .bind<number>( value => Success<number, string>(mapNumbersToNumber(value)) )
                        assertIgnoreOnFullfil(result)
                    })

                    it('an different type', () => {
                        const result = monad
                            .bind( value => Promise.resolve(mapNumbersToNumber(value)) as any )
                        assertIgnoreOnFullfil(result)
                    })
                })
            })

            describe("onrejected mapped to", () => {

                it('value of the same type', () => {
                    const result = monad
                        .bind(
                            undefined,
                            mapStringToString
                        )
                    assertIsNone(result)
                    return assertRejectedMapStringToString(result)
                })

                it('value of a different type', () => {
                    const result = monad
                        .bind(
                            undefined,
                            value => new Error(value)
                        )
                    assertIsNone(result)
                    return assertRejectedMapStringToError(result)
                })

                describe("monad of", () => {
                    it('the same monad', () => {
                        const result = monad
                            .bind<number, string, number, string>(
                                undefined,
                                value => Failure<number, string>(mapStringToString(value))
                            )
                        assertIsNone(result)
                        return assertRejectedMapStringToString(result)
                    })

                    it('an opposite monad', () => {
                        const result = monad
                            .bind<string, string, string, string>(
                                undefined,
                                value => Success<string, string>(mapStringToString(value))
                            )
                        assertIsJust( result )
                        return assertFulfilledMapStringToString(result)
                    })
                })
            })
        })
    })

    describe("Result with", () => {

        it("value", () => {
            expect(Result(() => testValue)).to.be.eql(Success(testValue))
        })

        it("Success", () => {
            expect(Result(() => Success(testValue))).to.be.eql(Success(testValue))
        })

        it("Failure", () => {
            expect(Result(() => Failure(errorMsg))).to.be.eql(Failure(errorMsg))
        })

        it("throw", () => {
            expect(Result(() => { throw errorMsg })).to.be.eql(Failure(errorMsg))
        })

        describe("isResult()", () => {
            it("Success", () => {
                expect(isResult(Success(testValue))).to.be.true
            })

            it("Failure", () => {
                expect(isResult(Failure(errorMsg))).to.be.true
            })

            it("string", () => {
                expect(isResult("Failure")).to.be.false
            })

            it("number", () => {
                expect(isResult(10)).to.be.false
            })

            it("boolean", () => {
                expect(isResult(10)).to.be.false
            })

            it("object", () => {
                expect(isResult({})).to.be.false
            })

            it("Array", () => {
                expect(isResult(new Array())).to.be.false
            })

            it("Promise", () => {
                expect(isResult(Promise.resolve())).to.be.false
            })

            it("Just", () => {
                expect(isResult(Just(testValue))).to.be.false
            })

            it("None", () => {
                expect(isResult(None())).to.be.false
            })
        })
    })
})