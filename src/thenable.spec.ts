import { expect } from 'chai'

import { isThenable } from "./thenable"
import { Just, None } from './maybe'
import { Success, Failure } from './result'

describe("Thenable", () => {
    describe("is", () => {
        const isTrue = (obj: any) =>  expect(obj).to.be.true

        it("Promise", () => {
            isTrue(isThenable(Promise.resolve()))
        })

        it("Just", () => {
            isTrue(isThenable(Just("")))
        })

        it("None", () => {
            isTrue(isThenable(None()))
        })

        it("Success", () => {
            isTrue(isThenable(Success("")))
        })

        it("Failure", () => {
            isTrue(isThenable(Failure("")))
        })

        it("any.then()", () => {
            isTrue(isThenable({ then: () => {}}))
        })
    })

    describe("isn't", () => {
        const isFalse = (obj: any) =>  expect(obj).to.be.false

        it("object", () => {
            isFalse(isThenable({}))
        })

        it("number", () => {
            isFalse(isThenable(10))
        })

        it("boolean", () => {
            isFalse(isThenable(true))
        })

        it("string", () => {
            isFalse(isThenable("true"))
        })

        it("any.then === {}", () => {
            isFalse(isThenable({ then: {} }))
        })
    })
})