# Amonad
[![Build Status](https://travis-ci.org/AIRTucha/amonad.svg?branch=master)](https://travis-ci.org/AIRTucha/amonad) [![Coverage Status](https://coveralls.io/repos/github/AIRTucha/amonad/badge.svg?branch=master)](https://coveralls.io/github/AIRTucha/amonad?branch=master)

Implementation of *Maybe* and *Result* monads compatible with async/await. 

*Maybe* is a container dedicated for the handling of a data which might be missing. Typically, it is used for representation of optional values. It allows prevent usage of Nullable objects. *Result* is an expansion of *Maybe* which can additionally carry the reason of unavailability. It is mainly utilized to represent the output of an operation which might fail since *Result* is also capable of containing an error message. 

Both of them implements a fraction of Promise's functionality. It allows us to model them via Promise. Therefore by the implementation of PromiseLike interface, they became compatible with async/await syntax.

## Get started 

The package is available via *npm*. It has to be installed as a local dependency:

    npm install amonad

Each of them can be represented by values of two types: *Just* and *None* for *Maybe*, *Success* and *Failure* for *Result*. The values have dedicated factory functions with correspondent names. They can also be created by a *smart factories* which are just *Maybe* and *Result*. They correctly create the monads based on the provided argument.

A primary way to access inclosed values is *bind()* method. It expects two optional arguments which are represented by functions which perform operations over the internal state of the containers. The first one processes the data, and the second is used for handling of its absents.

Also, there is an API for checking of an object type. It consist of *isMaybe*, *isJust*, *isNone*, *isResult*, *isSuccess* and *isFailure* functions which accept any object as an argument and returns result of the assertion as boolean value. Moreover, there are *isJust* and *isNone* methods for *Maybe*. Correspondingly, there are *isSuccess* and *isFailure* methods for *Result*. 

The carried information can be accessed via *get* and *getOrElse* methods. The first one returns the value inclosed inside of the container. The second one returns only the primary value from the monad and falls back to the provided argument if the primary value is not available.

## Usage

Typical usage of *Maybe* and *Result* is very similar. Sometimes it is hardly possible to make a choice, but there is a clear semantic difference in the intention behind each of them. 

*Maybe*, primary, should represent values which might not be available by design. The most obvious example is return type of *Dictionary*:

```typescript
interface Dictionary<K, V> {
    set(key: K, value: V): void
    get(key: K): Maybe<V>
}
```

It can also be used as a representation of optional value. The following example shows the way to model a *User* interface with *Maybe*. Some nationalities have a second name as an essential part of their identity other not. Therefore the value can nicely be treated as *Maybe<string>*.

```typescript
interface Client {
    name: string
    secondName: Maybe<string>
    lastName: string
}
```

Computations which might fail due to obvious reason are also a good application for *Maybe*. Lowest common denominator might be unavailable. That is why the signature makes perfect sense for *getLCD()* function:

```typescript
getLCD(num1: number, num2: number): Maybe<number>
```

*Result* is mainly used for the representation of value which might unavailable for an uncertain reason or for tagging of a data which absents can significantly affect execution flow. For example, some piece of class’s state, required for computation, might be configured via an input provided during life-circle of the object. In this case, the default status of the property can be represented by *Failure* which would clarify, that computation is not possible until the state is not initialized. Following example demonstrates the described scenario. The method will return the result of the calculation as *Success* or “Data is not initialized” error message as Failure. 

```typescript
class ResultExample {
  value: Result<Value, string> = Failure(“Data is not initialized”)
  
  init( value: Value ) {
    this.value = Success(value) 
  }

  calculateSomethingBasedOnValue(){
    return this.value.bind( value =>
        someValueBasedComputation( value, otherArgs)
     )
  }
}
```

Moreover, monadic error handling is able to replace exceptions as the primary solution for error propagation. Following example presents a possible type signature for a parsing function which utilizes Result as a return type.

```typescript
parseData( str: string ): Result<Data>
```

The output of such a function might contain processed value as *Success* or *Throwable* with an explanation of an error as *Failure*.

### Creation

As I already said it is possible to instantiate *Maybe* and *Result* via factory functions. Different ways to create the monads is presented in the following code snippet.

```typescript
const just = Just(3.14159265)
const none = None<number>()
const success = Success<string, Error>("Iron Man")
const failure: Failure<string, Error> = Failure( new Error("Does not exist."))
```

NaN safe division function can be created using this library in the way demonstrated below.

```typescript 
const divide = (numerator: number, quotient: number ): Result<number, string> => 
    quotient !== 0 ?
        Success( numerator/quotient )
    :
        Failure("It is not possible to divide by 0")
```

*Smart Maybe factory* is handy if there is Nullable object which has to be wrapped by *Maybe*.

```typescript 
const maybe = Maybe(map.get())
```

*Smart Result factory* expects a function *() => T | Success<T, E> | Failure<T, E>* which might throw object of E type as exception. *Result* wraps around the output accordingly.

```typescript
const data = Result( () => JSON.parse(inputStr) )
```

### Data handling

The first argument of *bind()* method is handler responsible for processing of expected value. It accepts two kinds of output values: value of arbitrary, *monad* of the same type.
```typescript 
// converts number value to string
const eNumberStr: Maybe<string> = Just(2.7182818284)
    .bind( 
        eNumber => `E number is: ${eNumber}` 
    )
// checks if string is valid and turns the monad to None if not
const validValue = Just<string>(inputStr)
    .bind( str => 
        isValid(inputStr) ?
            str
            :
            None<string>()
    )
```

The content can also be access by *get()*, *getOrElse()* and *getOrThrow()* methods. *get()* output a union type of the value type and the error one for *Result* and the union type of the value and undefined for *Maybe*. The issue can be resolved by validation of the monad type by *isJust()* and *isSuccess()* methods or functions.

```typescript
if(maybe.isJust()) { // it is also possible to write it via isJust(maybe)
    const value = maybe.get(); // return the value here
    // Some other actions...
} else {
    // it does not make sense to call get() here since the output is going to be undefined
    // Some other actions...
}

if(result.isSuccess()) { // it is also possible to write it via isSuccess(result)
    const error = result.get(); // return the value here
    // Some other actions...
} else {
    const value = result.get(); // return the error here
    // Some other actions...
}
```

The main advantage of the library against other existing implementations of *Maybe/Option* and *Result/Try* monads for JavaScript is compatibility with *async/await* syntax. It is possible to *await* *Result* and *Maybe* inside of *async* functions. Anyway, the output is going to be wrapped by *Promise*.

```typescript
const someStrangeMeaninglessComputations = async (num1: number, num2: number, num3: number ): Promise<number> => {
    const lcd = await getLCD(num1, num2) // will throw undefined in case LCD does not exist
    return await divide(lcd, num3)
}
```

### Error handling 

The second argument of the *bind()* method is a callback responsible for the handling of unexpected behavior. It works a bit differently for *Result* and *Maybe*. *None* has no value, that's why its callback doesn't have an argument. Additionally, it doesn't accept mapping to the value, since it should produce another *None* which also cannot contain any data. But returning of Just might be utilized to recovery *Maybe*. It is also possible to pass a void procedure to perform some side effect, for example, logging. *Failure* oriented handler works a bit more similar to the first one. It accepts two kinds of output values: the value of Throwable and *monad* of the *Result* type.

```typescript 
// tries to divide number e by n, recoveries to Infinity if division is not possible
const eDividedByN: Failure<string, string> = divide(2.7182818284, n)
    .bind( 
        eNumber => `E number divided by n is: ${eNumber}`,
        error => Success(Infinity)
    )
// looks up color from a dictionary by key, if color is not available falls back to black
const valueFrom = colorDictionary.get(key)
    .bind( 
        undefined,
        () => Just("#000000")
    )
```

It is also possible to verify if the monads are *Failure* or *None*, it can be done via *isNone()* and *isFailure()* methods and functions.

```typescript
if(maybe.isNone()) { // it is also possible to write it via isNone(maybe)
    // it does not make sense to call get() here since the output is going to be undefined
    // Some other actions...
} else {
    const value = maybe.get(); // return the value here
    // Some other actions...
}

if(result.isFailure()) { // it is also possible to write it via isFailure(result)
    const value = result.get(); // return the error here
    // Some other actions...
} else {
    const error = result.get(); // return the value here
    // Some other actions...
}
```

Awaiting of *None* and *Failure* led to throwing of an exception inside of async function. *None* doesn't have inclosed value. Therefore *undefined* is thrown. *Failure* conveniently store *Throwable* object which fulfils its purpose in such an occasion. Beyond *async* function the error is propagated as rejected *Promise*.

```typescript
const someStrangeMeaninglessComputations = async (num1: number, num2: number, num3: number ): Promise<number> => {
    try {
        const lcd = await getLCD(num1, num2) // will throw undefined in case LCD is not available for the values
        return await divide(lcd, num3) // throws "It is not possible to divide by 0" in case num3 is 0
    } catch(e) {
        // it is possible to recovery normal workflow here
        return someFallBackValue
    }
}
```

## API

The interfaces contains an up to a certain degree shared API as well as specific ones for *Maybe* and *Result*.

### Commune

#### Monad.prototype.bind()

Accordingly, applying the handlers produces a new Monadic as a container for the output of called function

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.bind<TResult1 = T, TResult2 = never>(
    onJust?: (value: T) => TResult1 | Maybe<TResult1>,
    onNone?: () => Maybe<TResult2>
): Maybe<TResult1 | TResult2> 
```

Signature for *Result* is:

```typescript
Result<T, E>.prototype.bind<TResult1 = T, EResult1 extends Throwable = E, TResult2 = never, EResult2 extends Throwable = never >(
    onSuccess?: (value: T) => TResult1 | IResult<TResult1, EResult1>,
    onFailure?: (reason: E) => EResult2 | IResult<TResult2, EResult2>
): Result<TResult1 | TResult2, EResult1 | EResult2>
```

#### Monad.prototype.then()

Implementation of PromiseLike.then() for the proper functioning of await

**param** *onfulfilled* Handler for fulfilled value

**param** *onrejected* Handler for onrejected value

**return** *PromiseLike* object which inclose new value
     
```typescript
Monad<T, E>.prototype.then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ( ( value: T ) => TResult1 | PromiseLike<TResult1> ) | undefined | null,
    onrejected?: ( ( reason: any ) => TResult2 | PromiseLike<TResult2> ) | undefined | null
): PromiseLike<TResult1 | TResult2>
```

#### Monad.prototype.get()

It returns the value enclosed inside a container.

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.get(): T | undefined
```

Signature for *Result* is:

```typescript
Result<T, E>.prototype.get(): T | E
```

#### Monad.prototype.getOrElse()

It returns the inclosed primary value or the one provided as an argument.

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.getOrElse( value: T ): T 
```

Signature for *Result* is:

```typescript
Result<T, E>.prototype.getOrElse( value: T ): T  
```

#### Monad.prototype.getOrThrow()

It returns the value for *Just* and *Success* and throws the throwable for *Failure*, *None* throws an *undefined*.

```typescript
Monad<T, E>.prototype.getOrThrow( value: T ): T 
```

It might be useful for refactoring of a legacy codebase, since it simplifies implementation of interfaces with exceptions based error handling.

### Maybe

*Maybe<T>* itself represents a union type of Just<T> and None<T>.

It is also a *smart factory* which turns Nullable object to *Just<T>* or *None<T>* accordingly.

```typescript
Maybe<T>(value: T | undefined | null) => Maybe<T>
```

#### Just

It represents the value of a specified type. It can be created via a factory which wraps the value with *Just<T>*

```typescript
Just<T>(value: T) => Maybe<T> 
```

#### None

It represents an absents of value with the specified type. It can be created via a factory with the specified type.

```typescript
None<T>() => Maybe<T> 
```

#### isJust

It exists as a stand-alone function which checks whether an object of any type is *Just*

```typescript
isJust<T>(obj: any): obj is Just<T>
```

Moreover *Maybe* has a method dedicated to the same goal.

```typescript
Maybe<T>.prototype.isJust(): obj is Just<T>
```

#### isNone

It exists as a stand-alone function which checks whether an object of any type is *None*

```typescript
isNone<T>(obj: any): obj is None<T>
```

Moreover *Maybe* has a method dedicated to the same goal.

```typescript
Maybe<T>.prototype.isNone(): obj is Just<T>
```

### Result

*Result<T, E>* itself represents a union type of Success<T, E> and Failure<T, E>.

It is also a *smart factory* which calls provided function and stores its output as *Success<T, E>* or *Failure<T, E>* accordingly.

```typescript
Maybe<T, E extends Throwable>(action: () => T | Result<T, E>) => Result<T, E>
```

#### Success

It represents the value of a specified type. It can be created via a factory which wraps the value with *Success<T, E>*

```typescript
Success<T, E extends Throwable>(value: T) => Result<T, E>
```

#### Failure

Represents an error which explains an absents of a value. It can be created via a factory with the specified type.

```typescript
Failure<T, E extends Throwable>(error: E) => Result<T, E>
```

#### isSuccess

It exists as a stand-alone function which checks whether an object of any type is *Success*

```typescript
isSuccess<T>(obj: any): obj is Success<T>
```

Moreover, *Result* has a method dedicated to the same goal.

```typescript
Result<T, E>.prototype.isSuccess(): obj is Success<T, E>
```

#### isFailure

It exists as a stand-alone function which checks whether an object of any type is *Failure*

```typescript
isFailure<T, E>(obj: any): obj is Failure<T, E>
```

Moreover, *Result* has a method dedicated to the same goal.

```typescript
Result<T, E>.prototype.isFailure(): obj is Failure<T>
```

## Contribution guidelines

The project is based on *npm* eco-system. Therefore, development process is organized via *npm* scripts.

For installation of dependencies run

    npm install

To build application once

    npm run build

To build an application and watch for changes of files

    npm run build:w

To run tslint one time for CI

    npm run lint

To unit tests in a watching mode are performed by 

    npm run test
    
To execute a test suit single time

    npm run test:once

To execute a test suit single time with coverage report

    npm run test:c

To execute a test suit single time with coverage report submitted to *coveralls*

    npm run test:ci

Everybody is welcome to contribute and submit pull requests. Please communicate your ideas and suggestions via *issues*.
