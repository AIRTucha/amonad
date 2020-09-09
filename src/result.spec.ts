import { expect } from 'chai'

import { Just, None, Maybe } from "./maybe"

import { Success, isSuccess, isFailure, Failure, Result, isResult } from "./result"
import { testNumber1, mapNumbersToNumber, mapNumberToString, testString1, mapStringToString, testNumber2, testString2 } from './testUtils'

const testValue = 1
const errorMsg = "testError"

const throwIncorrectTypeIdentifiedType = () => {
    throw "Incorrectly identified type"
}

const assertUnchangedJust = ( monad: Result<number | string, string> ) =>
    expect( monad.get() ).to.be.eql( testNumber1 )

const assertUnchangedNone = ( monad: Result<number | string, string> ) =>
    expect( monad.get() ).to.be.eql( testString1 )

const assertFulfilledMapNumberToNumber = ( maybe: Result<number, string> ) =>
    expect( maybe.get() ).to.be.eql( mapNumbersToNumber( testNumber1 ) )

const assertFulfilledMapNumberToString = ( maybe: Result<string, string> ) =>
    expect( maybe.get() ).to.be.eql( mapNumberToString( testNumber1 ) )

const assertFulfilledMapStringToString = ( maybe: Result<string, string> ) =>
    expect( maybe.get() ).to.be.eql( mapStringToString( testString1 ) )

const assertIsJust = ( maybe: Result<any, any> ) =>
    expect( maybe.isSuccess() ).to.be.true

const assertIsNone = ( maybe: Result<any, any> ) =>
    expect( maybe.isFailure() ).to.be.true

const assertRejectedMapStringToString = ( maybe: Result<number, string> ) =>
    expect( maybe.get() ).to.be.eql( mapStringToString( testString1 ) )

const assertRejectedMapStringToError = ( maybe: Result<number, Error> ) => {
    if ( maybe.isFailure() ) {
        const error = maybe.get()
        expect( error ).to.be.instanceOf( Error )
        expect( error.message ).to.be.eql( testString1 )
    }
}


const assertRejectedMapNumberToString = ( maybe: Result<string, string> ) =>
    expect( maybe.get() ).to.be.eql( testNumber1 )

const assertIgnoreOnReject = ( maybe: Result<number | string, string> ) =>
    assertIsJust( maybe ) && assertUnchangedJust( maybe )

const assertIgnoreOnFullfil = ( maybe: Result<number | string, string> ) =>
    assertIsNone( maybe ) && assertUnchangedNone( maybe )

describe( "Result", () => {
    describe( "Success", () => {
        const success = Success( testValue )

        describe( "isSuccess()", () => {

            it( "function", () => {
                if ( isSuccess( success ) ) {
                    const value: number = success.get()
                    expect( value ).to.be.eql( testValue )
                } else
                    throwIncorrectTypeIdentifiedType()
            } )

            it( "method", () => {
                if ( success.isSuccess() ) {
                    const value: number = success.get()
                    expect( value ).to.be.eql( testValue )
                } else
                    throwIncorrectTypeIdentifiedType()
            } )
        } )

        describe( "isFailure()", () => {

            it( "function", () => {
                if ( isFailure( success ) )
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = success.get()
                    expect( value ).to.be.eql( testValue )
                }
            } )

            it( "method", () => {
                if ( success.isFailure() )
                    throwIncorrectTypeIdentifiedType()
                else {
                    const value: number = success.get()
                    expect( value ).to.be.eql( testValue )
                }
            } )
        } )

        describe( "then()", () => {
            let monad!: Result<number, string>

            beforeEach( () => {
                monad = Success( testNumber1 )
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
                            .then<string>( value => Success( mapNumberToString( value ) ) )
                        assertIsJust( result )
                        return assertFulfilledMapNumberToString( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<string>( value => Failure<string, string>( mapNumberToString( value ) ) )
                        assertIsNone( result )
                        return assertFulfilledMapNumberToString( result )
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
                it( 'value of the same type', () => {
                    const result = monad
                        .then(
                            undefined,
                            mapStringToString
                        )
                    return assertIgnoreOnReject( result )
                } )

                it( 'value of a different type', () => {
                    const result = monad
                        .then(
                            undefined,
                            mapStringToString
                        )
                    return assertIgnoreOnReject( result )
                } )

                describe( "monad of", () => {
                    it( 'the same type', () => {
                        const result: Result<number | string, string> = monad
                            .then<number, string, string, string>(
                                undefined,
                                value => Success<string, string>( mapStringToString( value ) )
                            )
                        return assertIgnoreOnReject( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<number, string, number, string>(
                                undefined,
                                value => Failure<number, string>( value )
                            )
                        return assertIgnoreOnReject( result )
                    } )
                } )
            } )
        } )
    } )

    describe( "Failure", () => {
        const failure = Failure<number, string>( errorMsg )

        describe( "isSuccess()", () => {

            it( "function", () => {
                if ( isSuccess( failure ) )
                    throwIncorrectTypeIdentifiedType()
                else
                    expect( failure.get() ).to.be.eql( errorMsg )
            } )

            it( "method", () => {
                if ( failure.isSuccess() )
                    throwIncorrectTypeIdentifiedType()
                else
                    expect( failure.get() ).to.be.eql( errorMsg )
            } )
        } )

        describe( "isFailure()", () => {

            it( "function", () => {
                if ( isFailure( failure ) )
                    expect( failure.get() ).to.be.eql( errorMsg )
                else
                    throwIncorrectTypeIdentifiedType()
            } )

            it( "method", () => {
                if ( failure.isFailure() )
                    expect( failure.get() ).to.be.eql( errorMsg )
                else
                    throwIncorrectTypeIdentifiedType()
            } )
        } )

        describe( "then()", () => {
            let monad: Result<number, string>

            beforeEach( () => {
                monad = Failure( testString1 )
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
                    assertIgnoreOnFullfil( result )
                } )

                describe( "monad of", () => {

                    it( 'the same type', () => {
                        const result = monad
                            .then<number>( value => Failure<number, string>( mapNumberToString( value ) ) )
                        assertIgnoreOnFullfil( result )
                    } )

                    it( 'an opposite type', () => {
                        const result = monad
                            .then<number>( value => Success<number, string>( mapNumbersToNumber( value ) ) )
                        assertIgnoreOnFullfil( result )
                    } )

                    it( 'an different type', () => {
                        const result = monad
                            .then( value => Promise.resolve( mapNumbersToNumber( value ) ) as any )
                        assertIgnoreOnFullfil( result )
                    } )
                } )
            } )

            describe( "onrejected mapped to", () => {

                it( 'value of the same type', () => {
                    const result = monad
                        .then(
                            undefined,
                            mapStringToString
                        )
                    assertIsNone( result )
                    return assertRejectedMapStringToString( result )
                } )

                it( 'value of a different type', () => {
                    const result = monad
                        .then<number, Error, number, Error>(
                            undefined,
                            value => new Error( value )
                        )
                    assertIsNone( result )
                    return assertRejectedMapStringToError( result )
                } )

                describe( "monad of", () => {
                    it( 'the same monad', () => {
                        const result = monad
                            .then<number, string, number, string>(
                                undefined,
                                value => Failure<number, string>( mapStringToString( value ) )
                            )
                        assertIsNone( result )
                        return assertRejectedMapStringToString( result )
                    } )

                    it( 'an opposite monad', () => {
                        const result = monad
                            .then<string, string, string, string>(
                                undefined,
                                value => Success<string, string>( mapStringToString( value ) )
                            )
                        assertIsJust( result )
                        return assertFulfilledMapStringToString( result )
                    } )
                } )
            } )
        } )
    } )

    describe( "Result with", () => {

        it( "value", () => {
            expect( Result( () => testValue ) ).to.be.eql( Success( testValue ) )
        } )

        it( "Success", () => {
            expect( Result( () => Success( testValue ) ) ).to.be.eql( Success( testValue ) )
        } )

        it( "Failure", () => {
            expect( Result( () => Failure( errorMsg ) ) ).to.be.eql( Failure( errorMsg ) )
        } )

        it( "throw", () => {
            expect( Result( () => { throw errorMsg } ) ).to.be.eql( Failure( errorMsg ) )
        } )

        describe( "isResult()", () => {
            it( "Success", () => {
                expect( isResult( Success( testValue ) ) ).to.be.true
            } )

            it( "Failure", () => {
                expect( isResult( Failure( errorMsg ) ) ).to.be.true
            } )

            it( "string", () => {
                expect( isResult( "Failure" ) ).to.be.false
            } )

            it( "number", () => {
                expect( isResult( 10 ) ).to.be.false
            } )

            it( "boolean", () => {
                expect( isResult( 10 ) ).to.be.false
            } )

            it( "object", () => {
                expect( isResult( {} ) ).to.be.false
            } )

            it( "Array", () => {
                expect( isResult( new Array() ) ).to.be.false
            } )

            it( "Promise", () => {
                expect( isResult( Promise.resolve() ) ).to.be.false
            } )

            it( "Just", () => {
                expect( isResult( Just( testValue ) ) ).to.be.false
            } )

            it( "None", () => {
                expect( isResult( None() ) ).to.be.false
            } )
        } )
    } )


    describe( "await", () => {
        describe( "Success", () => {

            it( "function correctly", async () => {
                const value = await Success( testNumber1 )
                expect( value ).to.be.eql( testNumber1 )
            } )

            it( "with Failure", async () => {
                try {
                    const svalue = await Success( testNumber1 )
                    const fvalue = await Failure( testString1 )
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( testString1 )
                }
            } )

            it( 'getOrThrow() throw correct error', () => {
                const error = new Error( testString1 )
                expect(
                    () => Failure( error ).getOrThrow()
                ).to.throws( error )
            } )

            describe( "Promise", () => {
                describe( "resolved", () => {

                    it( "before", async () => {
                        const pValue = await Promise.resolve( testNumber1 )
                        const value = await Success( testNumber2 )
                        expect( pValue ).to.be.eql( testNumber1 )
                        expect( value ).to.be.eql( testNumber2 )
                    } )

                    it( "after", async () => {
                        const value = await Success( testNumber2 )
                        const pValue = await Promise.resolve( testNumber1 )
                        expect( pValue ).to.be.eql( testNumber1 )
                        expect( value ).to.be.eql( testNumber2 )
                    } )
                } )
                describe( "rejected", () => {

                    it( "before", async () => {
                        try {
                            const pValue = await Promise.reject( testNumber1 )
                            const value = await Success( testNumber2 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testNumber1 )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const value = await Success( testString1 )
                            const pValue = await Promise.reject( testNumber1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testNumber1 )
                        }
                    } )
                } )
            } )

        } )

        describe( "Failure", () => {

            it( "throws value", async () => {
                try {
                    await Failure( testString1 )
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( testString1 )
                }
            } )

            it( "with Success", async () => {
                try {
                    const fvalue = await Failure( testString1 )
                    const svalue = await Success( testNumber1 )
                    throw "The line should not be reached"
                } catch ( e ) {
                    expect( e ).to.be.eql( testString1 )
                }
            } )

            describe( "Promise", () => {
                describe( "resolved", () => {

                    it( "before", async () => {
                        try {
                            const value = await Failure( testString2 )
                            const pValue = await Promise.resolve( testString1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testString2 )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const pValue = await Promise.resolve( testString1 )
                            const value = await Failure( testString2 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testString2 )
                        }
                    } )
                } )
                describe( "rejected", () => {

                    it( "before", async () => {
                        try {
                            const pValue = await Promise.reject( testString1 )
                            const value = await Failure( testString2 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testString1 )
                        }
                    } )

                    it( "after", async () => {
                        try {
                            const value = await Failure( testString1 )
                            const pValue = await Promise.reject( testString1 )
                            throw "The line should not be reached"
                        } catch ( e ) {
                            expect( e ).to.be.eql( testString1 )
                        }
                    } )
                } )
            } )
        } )
    } )
} )