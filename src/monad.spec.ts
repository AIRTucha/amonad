import { CJustSuccess, CNoneFailure, fulfilled, rejected } from './monad'
import { expect } from 'chai'
import { testNumber1, testNumber2, testString1, mapNumberToString, mapNumbersToNumber, mapStringToString } from './testUtils'

// *** Test logic of CJustSuccess and CNoneFailure classes ***

const assertIsCJustSuccess = ( result: any ) =>
    expect( result ).to
        .be
        .instanceOf( CJustSuccess )

const assertIsCNoneFailure = ( result: any ) =>
    expect( result )
        .to
        .be
        .instanceOf( CNoneFailure )

const assertUnchangedCJustSuccess = ( monad: any ) =>
    monad.then( v =>
        expect( v )
            .to
            .eql( testNumber1 )
    )

const assertUnchangedCNoneFailure = ( monad: any ) =>
    monad.then(
        undefined,
        v => {
            expect( v )
                .to
                .eql( testNumber1 )
            return Promise.resolve()
        } )

describe( 'CJustSuccess', () => {

    it( 'get() returns correct primary value', () => {
        expect(
            new CJustSuccess( testNumber1 ).get()
        ).eql( testNumber1 )
    } )

    it( 'getOrElse() return correct value', () => {
        expect(
            new CJustSuccess( testNumber1 ).getOrElse( testNumber2 )
        ).eql( testNumber1 )
    } )

    it( 'getOrThrow() return correct value', () => {
        expect(
            new CJustSuccess( testNumber1 ).getOrThrow()
        ).eql( testNumber1 )
    } )
} )

describe( 'CNoneFailure', () => {

    it( 'get() return correct secondary value', () => {
        expect(
            new CNoneFailure( testString1 ).get()
        ).eql( testString1 )
    } )

    it( 'getOrElse() return fallback value', () => {
        expect(
            new CNoneFailure( testNumber1 ).getOrElse( testNumber2 )
        ).eql( testNumber2 )
    } )
} )
