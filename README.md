Munkres implementation for Javascript
---------------------------------

## Introduction

The Munkres module provides an implementation of the Munkres algorithm
(also called the [Hungarian algorithm][] or the Kuhn-Munkres algorithm).
The algorithm models an assignment problem as an N×M cost matrix, where
each element represents the cost of assigning the ith worker to the jth
job, and it figures out the least-cost solution, choosing a single item
from each row and column in the matrix, such that no row and no column are
used more than once.

[Hungarian algorithm]: http://en.wikipedia.org/wiki/Hungarian_algorithm

See the docs in munkres.js for more details.

## Copyright

&copy; 2014 Hauke Henningsen
&copy; 2008 Brian M. Clapper

## License

BSD license. See accompanying LICENSE file.
