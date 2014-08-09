'use strict';

////////////////////////////////////////////////////////////////////////////////
/// Create game module (This is kind of the lobby state)
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('CreategameCtrl', function ($scope, $location, socket) {
    $scope.game = {
      wait: 'Waiting for other players to join:',
      play: 'Start',
      players : []
    };

    $scope.isStartDisabled = true;

    // -----------------------------------------------------------------------------
    // Setup the socket event listeners
    // -----------------------------------------------------------------------------
   

  });
