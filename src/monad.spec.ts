import { CJustSuccess, CNoneFailure, fulfilled, rejected } from './monad'
import { expect } from 'chai'
import { testNumber1, testNumber2, testString1, mapNumberToString, mapNumbersToNumber, mapStringToString } from './testUtils'

// *** Test logic of CJustSuccess and CNoneFailure classes ***

const assertIsCJustSuccess = ( result: any ) =>
    expect(result).to
        .be
        .instanceOf(CJustSuccess)

const assertIsCNoneFailure = ( result: any ) =>
    expect( result )
        .to
        .be
        .instanceOf(CNoneFailure)

const assertUnchangedCJustSuccess = ( monad: any) =>
    monad.then( v =>
        expect( v )
            .to
            .eql( testNumber1 )
    )

const assertUnchangedCNoneFailure = ( monad: any) =>
    monad.then(
        undefined,
        v => {
            expect( v )
                .to
                .eql( testNumber1 )
            return Promise.resolve()
    })

const assertIgnoreOnReject = (monad: any) => {
    assertIsCJustSuccess(monad)
    return assertUnchangedCJustSuccess(monad)
}

const assertIgnoreOnFullfil = (monad: any) => {
    assertIsCNoneFailure(monad)
    return assertUnchangedCNoneFailure(monad)
}

const assertFulfilledMapNumberToNumber = (monad: any) =>
    monad.then(
        v => expect(v)
            .to
            .eql(mapNumbersToNumber(testNumber1))
    )

const assertFulfilledMapNumberToString = (monad: any) =>
    monad.then(
        v => expect(v)
            .to
            .eql(mapNumberToString(testNumber1))
    )

const assertRejectedMapNumberToNumber = (monad: any) =>
    monad.then(
        undefined,
        v => {
            expect( v )
                .to
                .eql( mapNumbersToNumber(testNumber1) )
        return Promise.resolve()
    })

const assertRejectedMapNumberToString = (monad: any) =>
    monad.then(
        undefined,
        v => {
            expect( v )
                .to
                .eql( mapNumberToString(testNumber1) )
        return Promise.resolve()
    })

describe('CJustSuccess', () => {

    it('get() returns correct primary value', () => {
        expect(
            new CJustSuccess(testNumber1).get()
        ).eql(testNumber1)
    })

    it('getOrElse() return correct value', () => {
        expect(
            new CJustSuccess(testNumber1).getOrElse(testNumber2)
        ).eql(testNumber1)
    })

    describe("then()", () => {
        let monad!: CJustSuccess<number, string>

        beforeEach(() => {
            monad = new CJustSuccess(testNumber1)
        })

        describe("onfulfilled mapped to", () => {

            it('value of the same type', () => {
                const result = monad
                        .then( mapNumbersToNumber )
                assertIsCJustSuccess(result)
                return assertFulfilledMapNumberToNumber(result)
            })

            it('value of a different type', () => {
                const result = monad
                        .then( mapNumberToString )
                assertIsCJustSuccess(result)
                return assertFulfilledMapNumberToString(result)
            })

            describe("monad of", () => {
                it('the same type', () => {
                    const result = monad
                            .then( value => new CJustSuccess(mapNumberToString(value)))
                    assertIsCJustSuccess(result)
                    return assertFulfilledMapNumberToString(result)
                })

                it('an opposite type', () => {
                    const result = monad
                            .then( value => new CNoneFailure<number, string>(mapNumberToString(value)))
                    assertIsCNoneFailure(result)
                    return assertRejectedMapNumberToString(result)
                })

                it('an different type', () => {
                    const result = monad
                            .then( value => Promise.resolve(mapNumberToString(value)) )
                    expect( result )
                        .to
                        .be
                        .instanceOf(Promise)
                    return assertFulfilledMapNumberToString(result)
                })
            })
        })

        describe("onrejected ignore mapping to", () => {
            it('value of the same type', () => {
                const result = monad
                    .then(
                        undefined,
                        mapNumbersToNumber
                    )
                return assertIgnoreOnReject(result)
            })

            it('value of a different type', () => {
                const result = monad
                    .then(
                        undefined,
                        mapNumberToString
                    )
                return assertIgnoreOnReject(result)
            })

            describe("monad of", () => {
                it('the same type', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => new CJustSuccess(mapStringToString(value))
                        )
                    return assertIgnoreOnReject(result)
                })

                it('an opposite type', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => new CNoneFailure(mapNumberToString(value))
                        )
                    return assertIgnoreOnReject(result)
                })

                it('an different type', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => Promise.resolve(mapNumberToString(value))
                        )
                    return assertIgnoreOnReject(result)
                })
            })
        })
    })
})

describe('CNoneFailure', () => {

    it('get() return correct secondary value', () => {
        expect(
            new CNoneFailure(testString1).get()
        ).eql(testString1)
    })

    it('getOrElse() return fallback value', () => {
        expect(
            new CNoneFailure(testNumber1).getOrElse(testNumber2)
        ).eql(testNumber2)
    })

    describe("then()", () => {
        let monad: CNoneFailure<number, number>

        beforeEach( () => {
            monad = new CNoneFailure(testNumber1)
        })

        describe("onfulfilled ignore mapping to", () => {

            it('value of the same type', () => {
                const result = monad
                        .then( mapNumbersToNumber )
                assertIgnoreOnFullfil(result)
            })

            it('value of a different type', () => {
                const result = monad
                        .then( mapNumberToString )
                assertIgnoreOnFullfil(result)
            })

            describe("monad of", () => {

                it('the same type', () => {
                    const result = monad
                        .then( value => new CNoneFailure(mapNumberToString(value)))
                    assertIgnoreOnFullfil(result)
                })

                it('an opposite type', () => {
                    const result = monad
                        .then( value => new CJustSuccess(mapNumbersToNumber(value)) )
                    assertIgnoreOnFullfil(result)
                })

                it('an different type', () => {
                    const result = monad
                        .then( value => Promise.resolve(mapNumbersToNumber(value)) )
                    assertIgnoreOnFullfil(result)
                })
            })
        })

        describe("onrejected mapped to", () => {

            it('value of the same type', () => {
                const result = monad
                    .then(
                        undefined,
                        mapNumberToString
                    )
                assertIsCNoneFailure(result)
                return assertRejectedMapNumberToString(result)
            })

            it('value of a different type', () => {
                const result = monad
                    .then(
                        undefined,
                        mapNumberToString
                    )
                assertIsCNoneFailure(result)
                return assertRejectedMapNumberToString(result)
            })

            describe("monad of", () => {
                it('the same monad', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => new CNoneFailure(mapNumbersToNumber(value))
                        )
                    assertIsCNoneFailure(result)
                    return assertRejectedMapNumberToNumber(result)
                })

                it('an opposite monad', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => new CJustSuccess(mapNumbersToNumber(value))
                        )
                    assertIsCJustSuccess( result )
                    return assertFulfilledMapNumberToNumber(result)
                })

                it('an different monad', () => {
                    const result = monad
                        .then(
                            undefined,
                            value => Promise.resolve(mapNumberToString(value))
                        )
                    expect( result )
                        .to
                        .be
                        .instanceOf(Promise)
                    return assertFulfilledMapNumberToString(result)
                })
            })
        })
    })
})

describe("await", () => {
    describe("CJustSuccess", () => {

        it("function correctly", async () => {
            const value = await new CJustSuccess(testNumber1)
            expect(value).to.be.eql(testNumber1)
        })

        it("with CNoneFailure", async () => {
            try {
                const svalue = await new CJustSuccess(testNumber1)
                const fvalue = await new CNoneFailure(testString1)
                throw "The line should not be reached"
            } catch (e) {
                expect(e).to.be.eql(testString1)
            }
        })

        describe("Promise", () => {
            describe("resolved", () => {

                it("before", async () => {
                    const pValue = await Promise.resolve(testNumber1)
                    const value = await new CJustSuccess(testNumber2)
                    expect(pValue).to.be.eql(testNumber1)
                    expect(value).to.be.eql(testNumber2)
                })

                it("after", async () => {
                    const value = await new CJustSuccess(testNumber2)
                    const pValue = await Promise.resolve(testNumber1)
                    expect(pValue).to.be.eql(testNumber1)
                    expect(value).to.be.eql(testNumber2)
                })
            })
            describe("rejected", () => {

                it("before", async () => {
                    try {
                        const pValue = await Promise.reject(testNumber1)
                        const value = await new CJustSuccess(testNumber2)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testNumber1)
                    }
                })

                it("after", async () => {
                    try {
                        const value = await new CJustSuccess(testString1)
                        const pValue = await Promise.reject(testNumber1)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testNumber1)
                    }
                })
            })
        })

    })

    describe("CNoneFailure", () => {

        it("throws value", async () => {
            try {
                await new CNoneFailure(testString1)
                throw "The line should not be reached"
            } catch (e) {
                expect(e).to.be.eql(testString1)
            }
        })

        it("with CJustSuccess", async () => {
            try {
                const fvalue = await new CNoneFailure(testString1)
                const svalue = await new CJustSuccess(testNumber1)
                throw "The line should not be reached"
            } catch (e) {
                expect(e).to.be.eql(testString1)
            }
        })

        describe("Promise", () => {
            describe("resolved", () => {

                it("before", async () => {
                    try {
                        const value = await new CNoneFailure(testNumber2)
                        const pValue = await Promise.resolve(testNumber1)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testNumber2)
                    }
                })

                it("after", async () => {
                    try {
                        const pValue = await Promise.resolve(testNumber1)
                        const value = await new CNoneFailure(testNumber2)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testNumber2)
                    }
                })
            })
            describe("rejected", () => {

                it("before", async () => {
                    try {
                        const pValue = await Promise.reject(testNumber1)
                        const value = await new CNoneFailure(testNumber2)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testNumber1)
                    }
                })

                it("after", async () => {
                    try {
                        const value = await new CNoneFailure(testString1)
                        const pValue = await Promise.reject(testNumber1)
                        throw "The line should not be reached"
                    } catch (e) {
                        expect(e).to.be.eql(testString1)
                    }
                })
            })
        })
    })
})