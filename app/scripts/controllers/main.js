'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This is the start or main controller of the app.
/// Within this state the user has two options:
///    1. Create a new game room
///    2. Join an existing game room
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('MainCtrl', function ($scope, $location, socket, gamedata) {
    $scope.data = {
      createButtonText: 'new game',
      joinButtonText: 'join game'
    };

    $scope.isNewGameDisabled = false;

    // -----------------------------------------------------------------------------
    // Setup the socket event listeners.
    // -----------------------------------------------------------------------------
    socket.on(socket.events.in.CONNECT, function() {
      console.log('Websocket connected.');
    });

    socket.on(socket.events.in.DISCONNECT, function() {
      console.log('Websocket disconnected.');
    });

    socket.on(socket.events.in.NEW_GAME_CREATED, function(_data) {
      gamedata.gameRoomId = _data.gameRoomId;
      $location.path('gameroomlobby');
    });

    // -----------------------------------------------------------------------------
    // This function gets called if the client clicks the NEW GAME button.
    // -----------------------------------------------------------------------------
    $scope.createNewGameRoom = function() {
    	$scope.isNewGameDisabled = true;
      $scope.data.createButtonText = 'Creating..';
    	socket.emit(socket.events.out.NEW_GAME);
    };

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
