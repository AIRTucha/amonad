import { expect } from 'chai'

import { Just, isJust, None, isNone, Maybe, isMaybe } from "./maybe"

import { Success, Failure } from "./result"
import { testNumber1, mapNumbersToNumber, mapNumberToString, testString1, mapStringToString, testNumber2 } from './testUtils'

const throwIncorrectTypeIdentifiedType = () => {
    throw "Incorrectly identified type"
}

const assertUnchangedJust = ( monad: Maybe<number> ) =>
    expect( monad.get() ).to.be.eql( testNumber1 )

const assertUnchangedNone = ( monad: Maybe<number> ) =>
    expect( monad.get() ).to.be.undefined

const assertFulfilledMapNumberToNumber = ( maybe: Maybe<number> ) =>
    expect( maybe.get() ).to.be.eql( mapNumbersToNumber( testNumber1 ) )

const assertFulfilledMapNumberToString = ( maybe: Maybe<string> ) =>
    expect( maybe.get() ).to.be.eql( mapNumberToString( testNumber1 ) )

const assertIsJust = ( maybe: Maybe<any> ) =>
    expect( maybe.isJust() ).to.be.true

const assertIsNone = ( maybe: Maybe<any> ) =>
    expect( maybe.isNone() ).to.be.true

const assertRejectedMapNumberToNumber = ( maybe: Maybe<number> ) =>
    expect( maybe.get() ).to.be.undefined

const assertRejectedMapNumberToString = ( maybe: Maybe<string> ) =>
    expect( maybe.get() ).to.be.undefined

const assertIgnoreOnReject = ( maybe: Maybe<number> ) =>
    assertIsJust( maybe ) && assertUnchangedJust( maybe )

const assertIgnoreOnFullfil = ( maybe: Maybe<number> ) =>
    assertIsNone( maybe ) && assertUnchangedNone( maybe )

const nothingToNumber = () => testNumber2

describe( "Maybe", () => {
    describe( "Just", () => {
        const just = Just( testNumber1 )

        describe( "isJust()", () => {

            it( "function", () => {
                if ( isJust( just ) ) {
                    const value: number = just.get()
                    expect( value ).to.be.eql( testNumber1 )
                } else
                    throwIncorrectTypeIdentifiedType()
            } )

            it( "method", () => {
                if ( just.isJust() ) {
                    const value: number = just.get()
                    expect( value ).to.be.eql( testNumber1 )
                } else
                    throwIncorrectTypeIdentifiedType()
            } )
        } )

        describe( "isNone()", () => {

            it( "function", () => {
                if ( isNone( just ) )
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = just.get()
                    expect( value ).to.be.eql( testNumber1 )
                }
            } )

            it( "method", () => {
                if ( just.isNone() )
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = just.get()
                    expect( value ).to.be.eql( testNumber1 )
                }
            } )
        } )

        describe( "then()", () => {
            let monad!: Maybe<number>

            beforeEach( () => {
                monad = Just( testNumber1 )
            } )

            describe( "onfulfilled mapped to", () => {

                it( 'value of the same type', () => {
                    const result = monad
                        .then( mapNumbersToNumber )
                    assertIsJust( result )
                    return assertFulfilledMapNumberToNumber( result )
                } )

                it( 'value of a different type', () => {
                    const result = monad
                        .then( mapNumberToString )
                    assertIsJust( result )
                    return assertFulfilledMapNumberToString( result )
                } )

                describe( "monad of", () => {
                    it( 'the same type', () => {
                        const result = monad
                            .then<string>( value => Just( mapNumberToString( value ) ) )
                        assertIsJust( result )
                        return assertFulfilledMapNumberToString( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<string>( value => None<string>() )
                        assertIsNone( result )
                        return assertRejectedMapNumberToString( result )
                    } )

                    it( 'an different type', async () => {
                        const result = monad
                            .then( value => Promise.resolve( mapNumberToString( value ) ) )
                        assertIsJust( result )
                        const promise = await result
                        const maybe = await promise
                        expect( maybe ).to.be.eql( mapNumberToString( testNumber1 ) )
                    } )
                } )
            } )

            describe( "onrejected ignore mapping to", () => {

                describe( "monad of", () => {
                    it( 'the same type', () => {
                        const result = monad
                            .then<number, number>(
                                undefined,
                                () => Just( testNumber2 )
                            )
                        return assertIgnoreOnReject( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<number, number>(
                                undefined,
                                () => None<number>()
                            )
                        return assertIgnoreOnReject( result )
                    } )
                } )
            } )
        } )
    } )

    describe( "None", () => {
        const none = None<number>()

        describe( "isJust()", () => {

            it( "function", () => {
                if ( isJust( none ) )
                    throwIncorrectTypeIdentifiedType()
                else
                    expect( none.get() ).to.be.undefined
            } )

            it( "method", () => {
                if ( none.isJust() )
                    throwIncorrectTypeIdentifiedType()
                else
                    expect( none.get() ).to.be.undefined
            } )
        } )

        describe( "isNone()", () => {

            it( "function", () => {
                if ( isNone( none ) )
                    expect( none.get() ).to.be.undefined
                else
                    throwIncorrectTypeIdentifiedType()
            } )

            it( "method", () => {
                if ( none.isNone() )
                    expect( none.get() ).to.be.undefined
                else
                    throwIncorrectTypeIdentifiedType()
            } )
        } )

        describe( "then()", () => {
            let monad: Maybe<number>

            beforeEach( () => {
                monad = None()
            } )

            describe( "onfulfilled ignore mapping to", () => {

                it( 'value of the same type', () => {
                    const result = monad
                        .then( mapNumbersToNumber )
                    assertIgnoreOnFullfil( result )
                } )

                it( 'value of a different type', () => {
                    const result = monad
                        .then( mapNumberToString )
                    assertIgnoreOnFullfil( result as any )
                } )

                describe( "monad of", () => {

                    it( 'the same type', () => {
                        const result = monad
                            .then<number>( value => None<number>() )
                        assertIgnoreOnFullfil( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<number>( value => Just( mapNumbersToNumber( value ) ) )
                        assertIgnoreOnFullfil( result )
                    } )

                    it( 'an different type', () => {
                        const result = monad
                            .then( value => Promise.resolve( mapNumbersToNumber( value ) ) )
                        assertIgnoreOnFullfil( result as any )
                    } )
                } )
            } )

            describe( "onrejected mapped to", () => {

                describe( "monad of", () => {
                    it( 'the same monad', () => {
                        const result = monad
                            .then<number, number>(
                                undefined,
                                () => None<number>()
                            )
                        assertIsNone( result )
                        return assertRejectedMapNumberToNumber( result )
                    } )

                    it( 'an opposite monad', () => {
                        const result = monad
                            .then<number, number>(
                                undefined,
                                () => Just( mapNumbersToNumber( testNumber1 ) )
                            )
                        assertIsJust( result )
                        return assertFulfilledMapNumberToNumber( result )
                    } )
                } )
            } )
        } )
    } )

    describe( "Maybe with", () => {

        it( "value", () => {
            expect( Maybe( testNumber1 ) ).to.be.eql( Just( testNumber1 ) )
        } )

        it( "undefined", () => {
            expect( Maybe( undefined ) ).to.be.eql( None() )
        } )

        describe( "isMaybe()", () => {
            it( "Just", () => {
                expect( isMaybe( Just( testNumber1 ) ) ).to.be.true
            } )

            it( "None", () => {
                expect( isMaybe( None() ) ).to.be.true
            } )

            it( "string", () => {
                expect( isMaybe( "None" ) ).to.be.false
            } )

            it( "number", () => {
                expect( isMaybe( 10 ) ).to.be.false
            } )

            it( "boolean", () => {
                expect( isMaybe( 10 ) ).to.be.false
            } )

            it( "object", () => {
                expect( isMaybe( {} ) ).to.be.false
            } )

            it( "Array", () => {
                expect( isMaybe( new Array() ) ).to.be.false
            } )

            it( "Promise", () => {
                expect( isMaybe( Promise.resolve() ) ).to.be.false
            } )

            it( "Success", () => {
                expect( isMaybe( Success( testNumber1 ) ) ).to.be.false
            } )

            it( "Failure", () => {
                expect( isMaybe( Failure( "" ) ) ).to.be.false
            } )
        } )
    } )

    describe( "await", () => {
        describe( "Just", () => {

            it( "function correctly", async () => {
                const value = await Just( testNumber1 )
                expect( value ).to.be.eql( testNumber1 )
            } )

            it( "with None", async () => {
                try {
                    const svalue = await Just( testNumber1 )
                    const fvalue = await None()
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( undefined )
                }
            } )

            it( 'getOrThrow() throw correct error', () => {
                const error = new Error( testString1 )
                expect(
                    () => None().getOrThrow()
                ).to.throws( "The value is None" )
            } )

            describe( "Promise", () => {
                describe( "resolved", () => {

                    it( "before", async () => {
                        const pValue = await Promise.resolve( testNumber1 )
                        const value = await Just( testNumber2 )
                        expect( pValue ).to.be.eql( testNumber1 )
                        expect( value ).to.be.eql( testNumber2 )
                    } )

                    it( "after", async () => {
                        const value = await Just( testNumber2 )
                        const pValue = await Promise.resolve( testNumber1 )
                        expect( pValue ).to.be.eql( testNumber1 )
                        expect( value ).to.be.eql( testNumber2 )
                    } )
                } )
                describe( "rejected", () => {

                    it( "before", async () => {
                        try {
                            const pValue = await Promise.reject( testNumber1 )
                            const value = await Just( testNumber2 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testNumber1 )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const value = await Just( testString1 )
                            const pValue = await Promise.reject( testNumber1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testNumber1 )
                        }
                    } )
                } )
            } )

        } )

        describe( "None", () => {

            it( "throws value", async () => {
                try {
                    await None()
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( undefined )
                }
            } )

            it( "with Just", async () => {
                try {
                    const fvalue = await None()
                    const svalue = await Just( testNumber1 )
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( undefined )
                }
            } )

            describe( "Promise", () => {
                describe( "resolved", () => {

                    it( "before", async () => {
                        try {
                            const value = await None()
                            const pValue = await Promise.resolve( testNumber1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( undefined )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const pValue = await Promise.resolve( testNumber1 )
                            const value = await None()
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( undefined )
                        }
                    } )
                } )
                describe( "rejected", () => {

                    it( "before", async () => {
                        try {
                            const pValue = await Promise.reject( testNumber1 )
                            const value = await None()
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testNumber1 )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const value = await None()
                            const pValue = await Promise.reject( testNumber1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( undefined )
                        }
                    } )
                } )
            } )
        } )
    } )
} )