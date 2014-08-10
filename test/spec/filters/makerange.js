'use strict';

describe('Filter: makeRange', function () {

  // load the filter's module
  beforeEach(module('tapWizardClientApp'));

  // initialize a new instance of the filter before each test
  var makeRange;
  beforeEach(inject(function ($filter) {
    makeRange = $filter('makeRange');
  }));

  it('should return the input prefixed with "makeRange filter:"', function () {
    var text = 'angularjs';
    expect(makeRange(text)).toBe('makeRange filter: ' + text);
  });

});
