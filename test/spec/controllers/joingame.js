'use strict';

describe('Controller: JoingameCtrl', function () {

  // load the controller's module
  beforeEach(module('tapWizardClientApp'));

  var JoingameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JoingameCtrl = $controller('JoingameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
