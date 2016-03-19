/**
 * A Mocha unit-test for munkress-js
 * 
 * @author Erel Segal-Halevi
 * @since 2016-03
 */

var should = require('should');
var Munkres = require("../");
var m = new Munkres.Munkres();

describe('Munkres Algorithm', function() {
    it('handles singleton matrix', function() {
        var matrix = [[5]];
        m.compute(matrix).should.eql([[0,0]]);
    });
    
    it('handles negative singleton matrix', function() {
        var matrix = [[-5]];
        m.compute(matrix).should.eql([[0,0]]);
    });
    
    it('handles 2-by-2 matrix', function() {
        var matrix = [[5,3],[2,4]];
        m.compute(matrix).should.eql([[0,1],[1,0]]);  // smallest cost is 3+2=5
    });
    
    it('handles 2-by-2 negative matrix', function() {
        var matrix = [[-5,-3],[-2,-4]];
        m.compute(matrix).should.eql([[0,0],[1,1]]);
    });
    
    it('handles 3-by-3 matrix', function() {
        var matrix = [[5,3,1],[2,4,6],[9,9,9]];
        m.compute(matrix).should.eql([[0,2],[1,0],[2,1]]);  // smallest cost is 1+2+9=12
    });
    
    it('handles another 3-by-3 matrix', function() {
        var matrix = [
            [400, 150, 400],
            [400, 450, 600],
            [300, 225, 300]
        ];
        
        m.compute(matrix).should.eql([[0,1],[1,0],[2,2]]);
    });
    
    it('handles 3-by-3 matrix with both positive and negative values', function() {
        var matrix = [[5,3,-1],[2,4,-6],[9,9,-9]];
        m.compute(matrix).should.eql([[0,1],[1,0],[2,2]]);
    });
    
    it('handles all-zero 3-by-3 matrix', function() {
        var matrix = [
          [0,0,0],
          [0,0,0],
          [0,0,0]
        ];
        
        m.compute(matrix).should.eql([[0,0],[1,1],[2,2]]);
    });
    
    it('handles rectangular 3-by-4 matrix', function() {
        var matrix = [
          [400, 150, 400, 1],
          [400, 450, 600, 2],
          [300, 225, 300, 3]
        ];
        
        m.compute(matrix).should.eql([[0,1],[1,3],[2,0]]);
    });
    
    it('handles rectangular 3-by-4 matrix, shorthand-style', function() {
        var matrix = [
          [400, 150, 400, 1],
          [400, 450, 600, 2],
          [300, 225, 300, 3]
        ];
        
        Munkres(matrix).should.eql([[0,1],[1,3],[2,0]]);
    });

    it('converts profit-matrix to cost-matrix', function() {
        var profitmatrix = [[5,3],[2,4]];
        var costmatrix = Munkres.make_cost_matrix(profitmatrix);
        
        m.compute(costmatrix).should.eql([[0,0],[1,1]]);  // largest profit is 5+4=9
    });
});
