'use strict';

describe('Directive: playingCard', function () {

  // load the directive's module
  beforeEach(module('tapWizardClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<playing-card></playing-card>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the playingCard directive');
  }));
});
