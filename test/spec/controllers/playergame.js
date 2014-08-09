'use strict';

describe('Controller: PlayergameCtrl', function () {

  // load the controller's module
  beforeEach(module('tapWizardClientApp'));

  var PlayergameCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayergameCtrl = $controller('PlayergameCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
