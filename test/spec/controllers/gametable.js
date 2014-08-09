'use strict';

describe('Controller: GametableCtrl', function () {

  // load the controller's module
  beforeEach(module('tapWizardClientApp'));

  var GametableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GametableCtrl = $controller('GametableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
