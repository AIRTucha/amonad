import { expect } from 'chai'

import { Just, isJust, None, isNone, Maybe, isMaybe } from "./maybe"

import { Success, Failure} from "./result"

const testValue = 1

const throwIncorrectTypeIdentifiedType = () => {
    throw "Incorrectly identified type"
}

describe("Maybe", () => {
    describe("Just", () => {
        const just = Just(testValue)

        describe("isJust()", () => {

            it("function", () => {
                if (isJust(just)) {
                    const value: number = just.get()
                    expect(just.get()).to.be.eql(testValue)
                } else
                    throwIncorrectTypeIdentifiedType()
            })

            it("method", () => {
                if (just.isJust()) {
                    const value: number = just.get()
                    expect(just.get()).to.be.eql(testValue)
                } else
                    throwIncorrectTypeIdentifiedType()
            })
        })

        describe("isNone()", () => {

            it("function", () => {
                if (isNone(just))
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = just.get()
                    expect(just.get()).to.be.eql(testValue)
                }
            })

            it("method", () => {
                if (just.isNone())
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = just.get()
                    expect(just.get()).to.be.eql(testValue)
                }
            })
        })
    })

    describe("None", () => {
        const none = None<number>()

        describe("isJust()", () => {

            it("function", () => {
                if (isJust(none))
                    throwIncorrectTypeIdentifiedType()
                else
                    expect(none.get()).to.be.undefined
            })

            it("method", () => {
                if (none.isJust())
                    throwIncorrectTypeIdentifiedType()
                else
                    expect(none.get()).to.be.undefined
            })
        })

        describe("isNone()", () => {

            it("function", () => {
                if (isNone(none))
                    expect(none.get()).to.be.undefined
                else
                    throwIncorrectTypeIdentifiedType()
            })

            it("method", () => {
                if (none.isNone())
                    expect(none.get()).to.be.undefined
                else
                    throwIncorrectTypeIdentifiedType()
            })
        })
    })

    describe("Maybe with", () => {

        it("value", () => {
            expect(Maybe(testValue)).to.be.eql(Just(testValue))
        })

        it("undefined", () => {
            expect(Maybe(undefined)).to.be.eql(None())
        })

        describe("isMaybe()", () => {
            it("Just", () => {
                expect(isMaybe(Just(testValue))).to.be.true
            })

            it("None", () => {
                expect(isMaybe(None())).to.be.true
            })

            it("string", () => {
                expect(isMaybe("None")).to.be.false
            })

            it("number", () => {
                expect(isMaybe(10)).to.be.false
            })

            it("boolean", () => {
                expect(isMaybe(10)).to.be.false
            })

            it("object", () => {
                expect(isMaybe({})).to.be.false
            })

            it("Array", () => {
                expect(isMaybe(new Array())).to.be.false
            })

            it("Promise", () => {
                expect(isMaybe(Promise.resolve())).to.be.false
            })

            it("Success", () => {
                expect(isMaybe(Success(testValue))).to.be.false
            })

            it("Failure", () => {
                expect(isMaybe(Failure(""))).to.be.false
            })
        })
    })
})