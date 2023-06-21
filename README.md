## Munkres implementation for Javascript

## Introduction

The Munkres module provides an O(n³) implementation of the Munkres algorithm
(also called the [Hungarian algorithm][] or the Kuhn-Munkres algorithm).
The algorithm models an assignment problem as an N×M cost matrix, where
each element represents the cost of assigning the ith worker to the jth
job, and it figures out the least-cost solution, choosing a single item
from each row and column in the matrix, such that no row and no column are
used more than once.

[Hungarian algorithm]: https://en.wikipedia.org/wiki/Hungarian_algorithm

[Youtube video](https://www.youtube.com/watch?v=cQ5MsiGaDY8)

## Usage

```ts
import { computeMunkres } from 'munkres-ts';

computeMunkres([
    [400, 150, 400],
    [400, 450, 600],
    [300, 225, 300],
]);
// => [ [ 0, 1 ], [ 1, 0 ], [ 2, 2 ] ]
```

Returns the list of matrix indices corresponding to the optimal assignment.

## Meta

This module is a Typescript version of the module `munkres-js` by
[Anna Henningsen] (https://github.com/addaleax/munkres-js)

which is in turn a translation of a Python implementation by
[Brian Clapper](https://github.com/bmc/munkres).

The original implementation is based on
<http://csclab.murraystate.edu/~bob.pilgrim/445/munkres.html>.

## Copyright

&copy; 2023 Slobodan Dan (Conversion to Typescript)

&copy; 2014 Anna Henningsen (Conversion to JS)

&copy; 2008 Brian M. Clapper

## License

Apache License 2.0. See accompanying LICENSE file.
