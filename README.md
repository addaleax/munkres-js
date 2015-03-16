Munkres implementation for Javascript
---------------------------------

![Bower Version](https://img.shields.io/bower/v/munkres-js.svg?style=flat)
[![NPM Version](https://img.shields.io/npm/v/munkres-js.svg?style=flat)](https://npmjs.org/package/munkres-js)
[![NPM Downloads](https://img.shields.io/npm/dm/munkres-js.svg?style=flat)](https://npmjs.org/package/munkres-js)
[![Build Status](https://travis-ci.org/addaleax/munkres-js.svg?style=flat&branch=master)](https://travis-ci.org/addaleax/munkres-js?branch=master)
[![Coverage Status](https://coveralls.io/repos/addaleax/munkres-js/badge.svg?branch=master)](https://coveralls.io/r/addaleax/munkres-js?branch=master)
[![Dependency Status](https://david-dm.org/addaleax/munkres-js.svg?style=flat)](https://david-dm.org/addaleax/munkres-js)
[![devDependency Status](https://david-dm.org/addaleax/munkres-js/dev-status.svg?style=flat)](https://david-dm.org/addaleax/munkres-js#info=devDependencies)

## Introduction

The Munkres module provides an implementation of the Munkres algorithm
(also called the [Hungarian algorithm][] or the Kuhn-Munkres algorithm).
The algorithm models an assignment problem as an N×M cost matrix, where
each element represents the cost of assigning the ith worker to the jth
job, and it figures out the least-cost solution, choosing a single item
from each row and column in the matrix, such that no row and no column are
used more than once.

[Hungarian algorithm]: https://en.wikipedia.org/wiki/Hungarian_algorithm

See the docs in munkres.js for more details.

## Meta

This module is a translation of a Python implementation by
[Brian Clapper](https://github.com/bmc/munkres).

It is available via `bower` and `npm` as `munkres-js`.

## Copyright

&copy; 2014 Hauke Henningsen (Conversion to JS)

&copy; 2008 Brian M. Clapper

## License

BSD license. See accompanying LICENSE file.
