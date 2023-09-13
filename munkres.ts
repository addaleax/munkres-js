/**
 * A very large numerical value which can be used like an integer
 * (i. e., adding integers of similar size does not result in overflow).
 */
const MAX_SIZE =
    Math.floor(Number.MAX_SAFE_INTEGER / 2) || (1 << 26) * (1 << 26);

/**
 * Calculate the Munkres solution to the classical assignment problem.
 * See the module documentation for usage.
 * @constructor
 */
type Matrix = number[][];

interface Options {
    padValue?: number;
}

/**
 * Compute the indices for the lowest-cost pairings between rows and columns
 * in the database. Returns a list of (row, column) tuples that can be used
 * to traverse the matrix.
 *
 * **WARNING**: This code handles square and rectangular matrices.
 * It does *not* handle irregular matrices.
 *
 * @param {Array} originalCostMatrix The cost matrix. If this cost matrix is not square,
 *                            it will be padded with zeros. Optionally,
 *                            the pad value can be specified via options.padValue.
 *                            This method does *not* modify the caller's matrix.
 *                            It operates on a copy of the matrix.
 * @param {Object} [options] Additional options to pass in
 * @param {Number} [options.padValue] The value to use to pad a rectangular cost_matrix
 *
 * @return {Array} An array of ``(row, column)`` arrays that describe the lowest
 *                 cost path through the matrix
 */
export const computeMunkres = (
    originalCostMatrix: Matrix,
    options: Options = {}
): Matrix => {
    /**
     * Pad a possibly non-square matrix to make it square.
     *
     * @param {Array} matrix An array of arrays containing the matrix cells
     * @param {Number} [pad_value] The value used to pad a rectangular matrix
     *
     * @return {Array} An array of arrays representing the padded matrix
     */
    const padMatrix = (matrix: Matrix, pad_value: number = 0): Matrix => {
        let max_columns = 0;
        let total_rows = matrix.length;

        for (let i = 0; i < total_rows; ++i)
            if (matrix[i].length > max_columns) max_columns = matrix[i].length;

        total_rows = max_columns > total_rows ? max_columns : total_rows;

        const new_matrix: Matrix = [];

        for (let i = 0; i < total_rows; ++i) {
            const row = matrix[i] || [];
            const new_row = [...row];

            // If this row is too short, pad it
            while (total_rows > new_row.length) new_row.push(pad_value);

            new_matrix.push(new_row);
        }

        return new_matrix;
    };

    /**
     * Create an n×n matrix, populating it with the specific value.
     *
     * @param {Number} n Matrix dimensions
     * @param {Number} val Value to populate the matrix with
     *
     * @return {Array} An array of arrays representing the newly created matrix
     */
    const createMatrix = (n: number, val: number): Matrix => {
        const matrix: Matrix = [];
        for (let i = 0; i < n; ++i) {
            matrix[i] = [];
            for (let j = 0; j < n; ++j) matrix[i][j] = val;
        }

        return matrix;
    };

    const originalLength = originalCostMatrix.length;
    const originalWidth = originalCostMatrix[0].length;

    const costMatrix = padMatrix(originalCostMatrix, options.padValue);
    const matrixSize = costMatrix.length;

    let rowCovered = new Array(matrixSize).fill(false);
    let colCovered = new Array(matrixSize).fill(false);
    let Z0_r = 0;
    let Z0_c = 0;
    let marked = createMatrix(matrixSize, 0);

    /**
     * For each row of the matrix, find the smallest element and
     * subtract it from every element in its row. Go to Step 2.
     */
    const step1 = (): number => {
        for (let i = 0; i < matrixSize; ++i) {
            // Find the minimum value for this row and subtract that minimum
            // from every element in the row.
            const minval = Math.min(...costMatrix[i]);

            for (let j = 0; j < matrixSize; ++j) costMatrix[i][j] -= minval;
        }

        return 2;
    };

    /**
     * Find a zero (Z) in the resulting matrix. If there is no starred
     * zero in its row or column, star Z. Repeat for each element in the
     * matrix. Go to Step 3.
     */
    const step2 = (): number => {
        for (let i = 0; i < matrixSize; ++i) {
            for (let j = 0; j < matrixSize; ++j) {
                if (
                    costMatrix[i][j] === 0 &&
                    !colCovered[j] &&
                    !rowCovered[i]
                ) {
                    marked[i][j] = 1;
                    colCovered[j] = true;
                    rowCovered[i] = true;
                    break;
                }
            }
        }

        clearCovers();

        return 3;
    };

    /**
     * Cover each column containing a starred zero. If K columns are
     * covered, the starred zeros describe a complete set of unique
     * assignments. In this case, Go to DONE, otherwise, Go to Step 4.
     */
    const step3 = (): number => {
        let count = 0;

        for (let i = 0; i < matrixSize; ++i) {
            for (let j = 0; j < matrixSize; ++j) {
                if (marked[i][j] == 1 && colCovered[j] == false) {
                    colCovered[j] = true;
                    ++count;
                }
            }
        }

        return count >= matrixSize ? 7 : 4;
    };

    /**
     * Find a noncovered zero and prime it. If there is no starred zero
     * in the row containing this primed zero, Go to Step 5. Otherwise,
     * cover this row and uncover the column containing the starred
     * zero. Continue in this manner until there are no uncovered zeros
     * left. Save the smallest uncovered value and Go to Step 6.
     */

    const step4 = (): number => {
        while (true) {
            let [row, col] = findFirstZero();

            if (row < 0) break;

            marked[row][col] = 2;
            const starCol = findStarInRow(row);

            if (starCol < 0) {
                Z0_r = row;
                Z0_c = col;
                return 5;
            }

            rowCovered[row] = true;
            colCovered[starCol] = false;
        }

        return 6;
    };

    /**
     * Construct a series of alternating primed and starred zeros as
     * follows. Let Z0 represent the uncovered primed zero found in Step 4.
     * Let Z1 denote the starred zero in the column of Z0 (if any).
     * Let Z2 denote the primed zero in the row of Z1 (there will always
     * be one). Continue until the series terminates at a primed zero
     * that has no starred zero in its column. Unstar each starred zero
     * of the series, star each primed zero of the series, erase all
     * primes and uncover every line in the matrix. Return to Step 3
     */
    const step5 = (): number => {
        let count = 0;

        const path = createMatrix(matrixSize * 2, 0);
        path[count][0] = Z0_r;
        path[count][1] = Z0_c;
        let done = false;

        while (!done) {
            let row = findStarInCol(path[count][1]);
            if (row >= 0) {
                count++;
                path[count][0] = row;
                path[count][1] = path[count - 1][1];
            } else {
                done = true;
            }

            if (!done) {
                let col = findPrimeInRow(path[count][0]);
                count++;
                path[count][0] = path[count - 1][0];
                path[count][1] = col;
            }
        }

        convertPath(path, count);
        clearCovers();
        erasePrimes();
        return 3;
    };

    /**
     * Add the value found in Step 4 to every element of each covered
     * row, and subtract it from every element of each uncovered column.
     * Return to Step 4 without altering any stars, primes, or covered
     * lines.
     */
    const step6 = (): number => {
        let minval = findSmallest();

        for (let i = 0; i < matrixSize; ++i) {
            for (let j = 0; j < matrixSize; ++j) {
                if (rowCovered[i]) costMatrix[i][j] += minval;
                if (!colCovered[j]) costMatrix[i][j] -= minval;
            }
        }

        return 4;
    };

    /**
     * Find the smallest uncovered value in the matrix.
     *
     * @return {Number} The smallest uncovered value, or MAX_SIZE if no value was found
     */
    const findSmallest = (): number => {
        let minval = MAX_SIZE;

        for (let i = 0; i < matrixSize; ++i)
            for (let j = 0; j < matrixSize; ++j)
                if (!rowCovered[i] && !colCovered[j])
                    if (minval > costMatrix[i][j]) minval = costMatrix[i][j];

        return minval;
    };

    /**
     * Find the first uncovered element with value 0.
     *
     * @return {Array} The indices of the found element or [-1, -1] if not found
     */
    const findFirstZero = (): [number, number] => {
        for (let i = 0; i < matrixSize; ++i)
            for (let j = 0; j < matrixSize; ++j)
                if (costMatrix[i][j] === 0 && !rowCovered[i] && !colCovered[j])
                    return [i, j];

        return [-1, -1];
    };

    /**
     * Find the first starred element in the specified row. Returns
     * the column index, or -1 if no starred element was found.
     *
     * @param {Number} row The index of the row to search
     * @return {Number}
     */
    const findStarInRow = (row: number): number => {
        for (let j = 0; j < matrixSize; ++j) if (marked[row][j] == 1) return j;

        return -1;
    };

    /**
     * Find the first starred element in the specified column.
     *
     * @return {Number} The row index, or -1 if no starred element was found
     */
    const findStarInCol = (col: number): number => {
        for (let i = 0; i < matrixSize; ++i) if (marked[i][col] == 1) return i;

        return -1;
    };

    /**
     * Find the first prime element in the specified row.
     *
     * @return {Number} The column index, or -1 if no prime element was found
     */
    const findPrimeInRow = (row: number): number => {
        for (let j = 0; j < matrixSize; ++j) if (marked[row][j] == 2) return j;

        return -1;
    };

    const convertPath = (path: Matrix, count: number): void => {
        for (let i = 0; i <= count; ++i)
            marked[path[i][0]][path[i][1]] =
                marked[path[i][0]][path[i][1]] == 1 ? 0 : 1;
    };

    /** Clear all covered matrix cells */
    const clearCovers = () => {
        for (let i = 0; i < matrixSize; ++i) {
            rowCovered[i] = false;
            colCovered[i] = false;
        }
    };

    /** Erase all prime markings */
    const erasePrimes = () => {
        for (let i = 0; i < matrixSize; ++i)
            for (let j = 0; j < matrixSize; ++j)
                if (marked[i][j] == 2) marked[i][j] = 0;
    };

    /**
     * Compute the indices for the lowest-cost pairings between rows and columns
     * in the database. Returns a list of (row, column) tuples that can be used
     * to traverse the matrix.
     *
     * **WARNING**: This code handles square and rectangular matrices.
     * It does *not* handle irregular matrices.
     *
     */

    let step = 1;

    const steps: {
        [key: number]: () => number;
    } = {
        1: step1,
        2: step2,
        3: step3,
        4: step4,
        5: step5,
        6: step6,
    };

    while (true) {
        const func = steps[step];
        if (!func)
            // done
            break;

        step = func.apply(this);
    }

    const results: Matrix = [];
    for (let i = 0; i < originalLength; ++i)
        for (let j = 0; j < originalWidth; ++j)
            if (marked[i][j] == 1) results.push([i, j]);

    return results;
};

const defaultInversionFunction = (profit_matrix: Matrix, x: number): number => {
    var maximum = -1.0 / 0.0;
    for (let i = 0; i < profit_matrix.length; ++i)
        for (let j = 0; j < profit_matrix[i].length; ++j)
            if (profit_matrix[i][j] > maximum) maximum = profit_matrix[i][j];

    return maximum - x;
};

/**
 * Create a cost matrix from a profit matrix by calling
 * 'inversion_function' to invert each value. The inversion
 * function must take one numeric argument (of any type) and return
 * another numeric argument which is presumed to be the cost inverse
 * of the original profit.
 *
 * This is a static method. Call it like this:
 *
 *  cost_matrix = make_cost_matrix(matrix[, inversion_func]);
 *
 * For example:
 *
 *  cost_matrix = make_cost_matrix(matrix, function(x) { return MAXIMUM - x; });
 *
 * @param {Array} profit_matrix An array of arrays representing the matrix
 *                              to convert from a profit to a cost matrix
 * @param {Function} [inversionFunction] The function to use to invert each
 *                                       entry in the profit matrix
 *
 * @return {Array} The converted matrix
 */
export const profitToCostMatrix = (
    profit_matrix: Matrix,
    inversionFunction = defaultInversionFunction
) => {
    const cost_matrix: Matrix = [];

    for (let i = 0; i < profit_matrix.length; ++i) {
        var row = profit_matrix[i];
        cost_matrix[i] = [];

        for (let j = 0; j < row.length; ++j)
            cost_matrix[i][j] = inversionFunction(
                profit_matrix,
                profit_matrix[i][j]
            );
    }

    return cost_matrix;
};

/**
 * Convenience function: Converts the contents of a matrix of integers
 * to a printable string.
 *
 * @param {Array} matrix The matrix to print
 *
 * @return {String} The formatted matrix
 */
export const matrixToString = (matrix: Matrix): string => {
    const columnWidths: number[] = [];

    for (let i = 0; i < matrix.length; ++i) {
        for (let j = 0; j < matrix[i].length; ++j) {
            const entryWidth = String(matrix[i][j]).length;

            if (!columnWidths[j] || entryWidth >= columnWidths[j])
                columnWidths[j] = entryWidth;
        }
    }

    let formatted = '';
    for (let i = 0; i < matrix.length; ++i) {
        for (let j = 0; j < matrix[i].length; ++j) {
            let s = String(matrix[i][j]);

            // pad at front with spaces
            while (s.length < columnWidths[j]) s = ' ' + s;

            formatted += s;

            // separate columns
            if (j != matrix[i].length - 1) formatted += ' ';
        }

        if (i != matrix[i].length - 1) formatted += '\n';
    }

    return formatted;
};
