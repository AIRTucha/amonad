import { expect } from 'chai'

import { Just, None } from "./maybe"

import { Success, isSuccess, isFailure, Failure, Result, isResult } from "./result"

const testValue = 1
const errorMsg = "testError"

const throwIncorrectTypeIdentifiedType = () => {
    throw "Incorrectly identified type"
}

describe("Result", () => {
    describe("Success", () => {
        const success = Success(testValue)

        describe("isSuccess()", () => {

            it("function", () => {
                if (isSuccess(success)) {
                    const value: number = success.get()
                    expect(success.get()).to.be.eql(testValue)
                } else
                    throwIncorrectTypeIdentifiedType()
            })

            it("method", () => {
                if (success.isSuccess()) {
                    const value: number = success.get()
                    expect(success.get()).to.be.eql(testValue)
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
                    expect(success.get()).to.be.eql(testValue)
                }
            })

            it("method", () => {
                if (success.isFailure())
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = success.get()
                    expect(success.get()).to.be.eql(testValue)
                }
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