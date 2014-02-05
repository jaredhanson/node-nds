/* global describe, it, expect */

var nds = require('..');

describe('nds', function() {
  
  it('should export constructors', function() {
    expect(nds.Resolver).to.be.a('function');
  });
  
});
