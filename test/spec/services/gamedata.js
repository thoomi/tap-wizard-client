'use strict';

describe('Service: gamedata', function () {

  // load the service's module
  beforeEach(module('tapWizardClientApp'));

  // instantiate service
  var gamedata;
  beforeEach(inject(function (_gamedata_) {
    gamedata = _gamedata_;
  }));

  it('should do something', function () {
    expect(!!gamedata).toBe(true);
  });

});
