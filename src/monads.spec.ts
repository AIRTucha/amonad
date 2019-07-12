import { CJustSuccess, CNoneFailure, monad } from './monad'
import { expect } from 'chai'
import { stringify } from 'querystring'

// *** Test logic of abstract CJustSuccess and CNoneFailure classes via local implementations ***

/**
 * Union monad like base for Maybe and Result
 */
type TestMonad<T, E> = CJustSuccessTest<T, E> | CNoneFailureTest<T, E>

@monad
class CJustSuccessTest<T, E> extends CJustSuccess<T, E> {
    bind!: <TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | TestMonad<TResult1, E>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | TestMonad<TResult2, E>) | undefined | null
    ) => TestMonad<TResult1 | TResult2, E>
}

@monad
class CNoneFailureTest<T, E> extends CNoneFailure<T, E> {
    bind!: <TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | TestMonad<TResult1, E>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | TestMonad<TResult2, E>) | undefined | null
    ) => TestMonad<TResult1 | TResult2, E>
}

const testNumber1 = 1
const testNumber2 = 2

const testString1 = "test1"
const testString2 = "test2"

const mapNumbersToNumber = (v: number) => v + testNumber2
const mapNumberToString = (v: number) => v + testString1
const mapStringToString = (v: string) => v + testNumber2


describe('Base class for Just and Success', () => {

    it('get() returns correct primary value', () => {
        expect(new CJustSuccessTest(testNumber1).get()).eql(testNumber1)
    })

    it('getOrElse() return correct value', () => {
        expect(new CJustSuccessTest(testNumber1).getOrElse(testNumber2)).eql(testNumber1)
    })

    describe("bind() correctly handle", () => {
        describe("onfulfilled mapped to", () => {

            it('value of the same type', () => {
                const result = new CJustSuccessTest(testNumber1)
                        .bind( mapNumbersToNumber )
                expect( result )
                    .to
                    .be
                    .instanceOf(CJustSuccessTest)
                expect( result.get() )
                    .to
                    .eql(mapNumbersToNumber(testNumber1))
            })

            it('value of a different type', () => {
                const result = new CJustSuccessTest(testNumber1)
                        .bind( mapNumberToString )
                expect( result )
                    .to
                    .be
                    .instanceOf(CJustSuccessTest)
                expect( result.get() )
                    .to
                    .eql(mapNumberToString(testNumber1))
            })

            describe("monad of", () => {
                it('the same type', () => {
                    const result = new CJustSuccessTest(testString1)
                            .bind( value => new CJustSuccessTest(mapStringToString(value)))
                    expect( result )
                        .to
                        .be
                        .instanceOf(CJustSuccessTest)
                    expect( result.get() )
                        .to
                        .eql(mapStringToString(testString1))
                })

                it('an opposite type', () => {
                    const result = new CJustSuccessTest(testNumber1)
                            .bind( value => new CNoneFailureTest(mapNumberToString(value)))
                    expect( result )
                        .to
                        .be
                        .instanceOf(CNoneFailureTest)
                    expect( result.get() )
                        .to
                        .eql(mapNumberToString(testNumber1))
                })
            })
        })

        describe("onrejected ignore mapping to", () => {
            it('value of the same type', () => {
                const result = new CJustSuccessTest(testNumber1)
                    .bind(
                        undefined,
                        mapNumbersToNumber
                    )
                expect( result )
                    .to
                    .be
                    .instanceOf(CJustSuccessTest)
                expect( result.get() )
                    .to
                    .eql(testNumber1)
            })

            it('value of a different type', () => {
                const result = new CJustSuccessTest(testNumber1)
                    .bind(
                        undefined,
                        mapNumberToString
                    )
                expect( result )
                    .to
                    .be
                    .instanceOf(CJustSuccessTest)
                expect( result.get() )
                    .to
                    .eql(testNumber1)
            })

            describe("monad of", () => {
                it('the same type', () => {
                    const result = new CJustSuccessTest(testString1)
                        .bind(
                            undefined,
                            value => new CJustSuccessTest(mapStringToString(value))
                        )
                    expect( result )
                        .to
                        .be
                        .instanceOf(CJustSuccessTest)
                    expect( result.get() )
                        .to
                        .eql(testString1)
                })

                it('an opposite type', () => {
                    const result = new CJustSuccessTest(testString1)
                            .bind(
                                undefined,
                                value => new CNoneFailureTest(mapNumberToString(value))
                            )
                    expect( result )
                        .to
                        .be
                        .instanceOf(CJustSuccessTest)
                    expect( result.get() )
                        .to
                        .eql(testString1)
                })
            })

        })
    })

})

describe('CNoneFailure', () => {

    it('get() return correct secondary value', () => {
        expect(new CNoneFailureTest(testString1).get()).eql(testString1)
    })

    it('getOrElse() return fallback value', () => {
        expect(new CNoneFailureTest(testNumber1).getOrElse(testNumber2)).eql(testNumber2)
    })

    describe("bind() correctly handle", () => {
        describe("onfulfilled ignore mapping to", () => {

            it('value of the same type', () => {
                const result = new CNoneFailureTest<number, string>(testString1)
                        .bind( mapNumbersToNumber )
                expect( result )
                    .to
                    .be
                    .instanceOf(CNoneFailureTest)
                expect( result.get() )
                    .to
                    .eql(testString1)
            })

            it('value of a different type', () => {
                const result = new CNoneFailureTest<number, number>(testNumber1)
                        .bind( mapNumberToString )
                expect( result )
                    .to
                    .be
                    .instanceOf(CNoneFailureTest)
                expect( result.get() )
                    .to
                    .eql(testNumber1)
            })

            describe("monad of", () => {

                it('the same type', () => {
                    const result = new CNoneFailureTest<string, number>(testNumber1)
                            .bind( value => new CNoneFailureTest(mapStringToString(value)))
                    expect( result )
                        .to
                        .be
                        .instanceOf(CNoneFailureTest)
                    expect( result.get() )
                        .to
                        .eql(testNumber1)
                })

                it('an opposite type', () => {
                    const result = new CNoneFailureTest<number, string>(testString1)
                            .bind( value => new CJustSuccessTest(mapNumbersToNumber(value)) )
                    expect( result )
                        .to
                        .be
                        .instanceOf(CNoneFailureTest)
                    expect( result.get() )
                        .to
                        .eql(testString1)
                })
            })
        })

        describe("onrejected mapped to", () => {

            it('value of the same type', () => {
                const result = new CNoneFailureTest(testString1)
                        .bind(
                            undefined,
                            mapStringToString
                        )
                expect( result )
                    .to
                    .be
                    .instanceOf(CNoneFailureTest)
                expect( result.get() )
                    .to
                    .eql(mapStringToString(testString1))
            })

            it('value of a different type', () => {
                const result = new CNoneFailureTest(testNumber1)
                        .bind(
                            undefined,
                            mapNumberToString
                        )
                expect( result )
                    .to
                    .be
                    .instanceOf(CNoneFailureTest)
                expect( result.get() )
                    .to
                    .eql(mapNumberToString(testNumber1))
            })

            describe("monad of", () => {
                it('the same monad', () => {
                    const result = new CNoneFailureTest(testNumber1)
                            .bind(
                                undefined,
                                value => new CNoneFailureTest(mapNumbersToNumber(value))
                            )
                    expect( result )
                        .to
                        .be
                        .instanceOf(CNoneFailureTest)
                    expect( result.get() )
                        .to
                        .eql(mapNumbersToNumber(testNumber1))
                })

                it('an opposite monad', () => {
                    const result = new CNoneFailureTest(testString1)
                            .bind(
                                undefined,
                                value => new CJustSuccessTest(mapStringToString(value))
                            )
                    expect( result )
                        .to
                        .be
                        .instanceOf(CJustSuccessTest)
                    expect( result.get())
                        .to
                        .eql(mapStringToString(testString1))
                })
            })
        })
    })
})