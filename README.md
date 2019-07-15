# Amonad
[![Build Status](https://travis-ci.org/AIRTucha/amonad.svg?branch=master)](https://travis-ci.org/AIRTucha/amonad) [![Coverage Status](https://coveralls.io/repos/github/AIRTucha/amonad/badge.svg?branch=master)](https://coveralls.io/github/AIRTucha/amonad?branch=master)

Implementation of *Maybe* and *Result* monads compatible with async/await. 

A lot of developers say that an individual lose an ability to explain the story behind monad at the moment they finally understand them. Another group of developers tell that it is just enough to say that *Promise* is one of *monads* and everybody are aware of the API. It seems to be that didn't completely get monads, since I believe that I am still able to explain it to others.

Explanation of *monads* from purely mathematical point is sophisticated, but from software development point of view it is just a container for data which limits direct manipulation on carried information. The primary way to access inclosed information is a function which is traditionally called *bind*. It enable two kinds of operations: mapping of the value with some modifications, possibly, to another type and mapping of the value to a *monad* of the same type which is able to contain values of type different from the initial one. The second operation is used to prevent creation of nested *monads* of the same kind. Due to certain limitations, usually, modern programming languages represents *bind* as two separate functions called *map* and *flatMap*. The first one is responsible for mapping of value to value and the second is used for operation which maps value to the *monad*. Although, *Promise.then()* represents combination of them.

The limitation of a data access allows *monads* to be utilized for modeling of many abstractions. For example *Promise* is able to model a data which might be available asynchronously as well as for some reason not available at all. *Result* in some sense is a smaller brother of *Promise*. It is not capable to manage latency, but it still can represent an absents of value and reasons of unavailability. Deterministic nature of *Result* allows it to have an extended API which provide some limited access to its internal state. It is mainly utilized to represent the output of an operation which might fail, since *Result* is also able to carry an error message. *Maybe* is simplified version of *Result*. It can only contain a value or nothing. Typically, it is used for a values which are optional. The difference is purely semantic. The reduction of complexity from *Promise* to *Maybe* let us model *Maybe* by *Result*, corespondently by *Promise*.

Preventing the nesting is also very handy, since it allows them to be freely used inside context of each other. *Promise* is mainly used for representation of a data produced by asynchronous operation like request to an *http* services or reading from a file storage. It frequently happens that one of the operation depends from an information provided by another one. This is the situation when *bind* rescues us. In case of *Result*, it might be reframed to a situation if an operation which might fail depends from a value which is output of another computation of uncertain nature. 

## Get started 

## Usage

## API

## Contribution guidelines




