# Amonad
[![Build Status](https://travis-ci.org/AIRTucha/amonad.svg?branch=master)](https://travis-ci.org/AIRTucha/amonad) [![Coverage Status](https://coveralls.io/repos/github/AIRTucha/amonad/badge.svg?branch=master)](https://coveralls.io/github/AIRTucha/amonad?branch=master)

Implementation of *Maybe* and *Result* monads compatible with async/await. 

*Maybe* is a container dedicated for handling of a data which might be missing. Typically, it is used to represent an optional values. It allows to avoid usage of Nullable objects. *Result* is an expansion of *Maybe* which can additionally carry the reason of unavailability. It is mainly utilized to represent the output of an operation which might fail, since *Result* is also capable to carry an error message. 

Both of them implements a fraction of Promise's functionality. It allows to model both of them via Promise. Therefore by implementation of PromiseLike interface they became compatible with async/await syntax.

## Get started 

The package is available via *npm*. It has to be installed as local dependency:

    npm install amonad

Each of the types can be represented by values of two types: *Just* and *None* for *Maybe*, *Success* and *Failure* for *Result*. The values have dedicated factory functions with corespondent names. The can also be created by a *smart factories* which are jut *Maybe* and *Result*. They creates correct version of a monad based on provided argument.

The primary way to access inclosed values is *bind()* method. It expects two optional arguments which are represented by functions which performs operations over internal state of the containers. The first one handle the data and the second is used for processing of its absents.

Also there is an API for checking of an object type. It consist of *isMaybe*, *isJust*, *isNone*, *isResult*, *isSuccess* and *isFailure* functions which accept any object as an argument and returns result of the assertion as boolean value. Moreover, there are *isJust* and *isNone* methods for *Maybe*. Corespondently, there are *isSuccess* and *isFailure* methods for *Result*. 

The carried information can be accessed via *get* and *getOrElse* methods. The first one returns the value inclosed inside of the container. The second one returns only primary value from the monad and falls back to provided argument if the primary value is not available.

## Usage
 
 WIP

## API

The API contains a ap to certain degree shared API and ones specific for *Maybe* and *Result*.

### Commune

#### Monad.prototype.bind()

Accordingly apply the handlers, produces a new Monadic as container for the output of called function

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.bind<TResult1 =  T, TResult2 = never>(
    onJust?: ((value: T) => TResult1 | IMaybe<TResult1>) | undefined | null,
    onNone?: (() => TResult2 | IMaybe<TResult2>) | undefined | null
): Maybe<TResult1 | TResult2>
```
Signature for *Result* is:

```typescript
Result<T, E>.prototype.bind<TResult1 = T, EResult1 extends Throwable = E, TResult2 = never, EResult2 extends Throwable = never >(
    onSuccess?: ((value: T) => TResult1 | IResult<TResult1, EResult1>) | undefined | null,
    onFailure?: ((reason: E) => EResult1 | IResult<TResult2, EResult2>) | undefined | null
): Result<TResult1 | TResult2, EResult1 | EResult2>
```

#### Monad.prototype.then()

Implementation of PromiseLike.then() for proper functioning of await

**param** *onfulfilled* Handler for fulfilled value

**param** *onrejected* Handler for onrejected value

**return** *PromiseLike* object which inclose new value
     
```typescript
Monad<T>.prototype.then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ( ( value: T ) => TResult1 | PromiseLike<TResult1> ) | undefined | null,
    onrejected?: ( ( reason: any ) => TResult2 | PromiseLike<TResult2> ) | undefined | null
): PromiseLike<TResult1 | TResult2>
```
It is internally utilized by *bind()*.

#### Monad.prototype.get()

Returns the value inclosed inside container.

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.get(): T | undefined
```

Signature for *Result* is:

```typescript
Result<T, E>.prototype.get(): T | E
```

#### Monad.prototype.getOrElse()

Returns the inclosed primary value or the one provided as an argument.

Signature for *Maybe* is:

```typescript
Maybe<T>.prototype.getOrElse( value: T ): T 
```

Signature for *Result* is:

```typescript
Result<T, E>.prototype.getOrElse( value: T ): T  
```

### Maybe

*Maybe<T>* itself represents a union type of Just<T> and None<T>.

It is also a *smart factory* which turns Nullable object to *Just<T>* or *None<T>* accordingly.

```typescript
Maybe<T>(value: T | undefined | null) => Maybe<T>
```

#### Just

Represents a value of specified type. It can be created via a factory which wraps the value with *Just<T>*

```typescript
Just<T>(value: T) => Maybe<T> 
```

#### None

Represents an absents of a value with specified type. It can be created via a factory with specified type.

```typescript
None<T>() => Maybe<T> 
```

#### isJust

It exists as a stand alone function which checks wether object of any type is *Just*

```typescript
isJust<T>(obj: any): obj is Just<T>
```

Moreover *Maybe* has a method dedicated to the same goal.

```typescript
Maybe<T>.prototype.isJust(): obj is Just<T>
```

#### isNone

It exists as a stand alone function which checks wether object of any type is *None*

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

Represents a value of specified type. It can be created via a factory which wraps the value with *Success<T, E>*

```typescript
Success<T, E extends Throwable>(value: T) => Result<T, E>
```

#### Failure

Represents an error which explains an absents of a value. It can be created via a factory with specified type.

```typescript
Failure<T, E extends Throwable>(error: E) => Result<T, E>
```

#### isSuccess

It exists as a stand alone function which checks wether object of any type is *Success*

```typescript
isSuccess<T>(obj: any): obj is Success<T>
```

Moreover *Result* has a method dedicated to the same goal.

```typescript
Result<T, E>.prototype.isSuccess(): obj is Success<T, E>
```

#### isFailure

It exists as a stand alone function which checks wether object of any type is *Failure*

```typescript
isFailure<T, E>(obj: any): obj is Failure<T, E>
```

Moreover *Result* has a method dedicated to the same goal.

```typescript
Result<T, E>.prototype.isFailure(): obj is Failure<T>
```

## Contribution guidelines

The project is based on *npm* eco-system. Therefore development process is organized via *npm* scripts.

For installation of dependencies run

    npm install

Build application once

    npm run build

Build application and watch for changes of files

    npm run build:w

Run tslint one time for CI

    npm run lint

Unit tests in a watching mode are performed by 

    npm run test
    
A single run of test suit

    npm run test:once

A single run of test suit with test coverage report

    npm run cover

A single run of test suit with test coverage report

    npm run test:ci

Everybody is welcome to contribute and submit pull requests. Please communicate your ideas and suggestions via *issues*.
