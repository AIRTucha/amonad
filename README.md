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

### Maybe



## Contribution guidelines




