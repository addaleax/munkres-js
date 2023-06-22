/**
 * A Mocha unit-test for munkress-js
 *
 * @author Erel Segal-Halevi
 * @since 2016-03
 */

import { computeMunkres, profitToCostMatrix } from '../munkres';

describe('Munkres Algorithm', () => {
    it('handles singleton matrix', () => {
        const matrix = [[5]];
        expect(computeMunkres(matrix)).toEqual([[0, 0]]);
    });

    it('handles negative singleton matrix', () => {
        const matrix = [[-5]];
        expect(computeMunkres(matrix)).toEqual([[0, 0]]);
    });

    it('handles 2-by-2 matrix', () => {
        const matrix = [
            [5, 3],
            [2, 4],
        ];
        expect(computeMunkres(matrix)).toEqual([
            [0, 1],
            [1, 0],
        ]); // smallest cost is 3+2=5
    });

    it('handles 2-by-2 negative matrix', () => {
        const matrix = [
            [-5, -3],
            [-2, -4],
        ];
        expect(computeMunkres(matrix)).toEqual([
            [0, 0],
            [1, 1],
        ]); // smallest cost is -5-4=-9
    });

    it('handles 3-by-3 matrix', () => {
        const matrix = [
            [5, 3, 1],
            [2, 4, 6],
            [9, 9, 9],
        ];

        expect(computeMunkres(matrix)).toEqual([
            [0, 2],
            [1, 0],
            [2, 1],
        ]); // smallest cost is 1+2+9=12
    });

    it('handles another 3-by-3 matrix', () => {
        const matrix = [
            [400, 150, 400],
            [400, 450, 600],
            [300, 225, 300],
        ];

        expect(computeMunkres(matrix)).toEqual([
            [0, 1],
            [1, 0],
            [2, 2],
        ]); // smallest cost is 150+400+300=850
    });

    it('handles 3-by-3 matrix with both positive and negative values', () => {
        const matrix = [
            [5, 3, -1],
            [2, 4, -6],
            [9, 9, -9],
        ];

        expect(computeMunkres(matrix)).toEqual([
            [0, 1],
            [1, 0],
            [2, 2],
        ]); // smallest cost is -1+2+9=10
    });

    it('handles all-zero 3-by-3 matrix', () => {
        const matrix = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];

        expect(computeMunkres(matrix)).toEqual([
            [0, 0],
            [1, 1],
            [2, 2],
        ]); // smallest cost is 0
    });

    it('handles rectangular 3-by-4 matrix', () => {
        const matrix = [
            [400, 150, 400, 1],
            [400, 450, 600, 2],
            [300, 225, 300, 3],
        ];

        expect(computeMunkres(matrix)).toEqual([
            [0, 1],
            [1, 3],
            [2, 0],
        ]); // smallest cost is 150+2+300=452
    });

    it('converts profit-matrix to cost-matrix', () => {
        const profitmatrix = [
            [5, 3],
            [2, 4],
        ];
        const costmatrix = profitToCostMatrix(profitmatrix);

        expect(computeMunkres(costmatrix)).toEqual([
            [0, 0],
            [1, 1],
        ]); // largest profit is 5+4=9
    });
});
