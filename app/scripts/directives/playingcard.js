'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This is the playing card which is used for user interaction
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .directive('playingCard', function () {
    return {
      templateUrl: '../../views/playingcard.html',
      restrict: 'E',
      scope: {
        card: '=info',
        throwCard: '&callbackFn'
      },
      link: function() {

      }
    };
  });
