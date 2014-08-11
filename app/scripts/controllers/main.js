'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This is the start or main controller of the app.
/// Within this state the user has two options:
///    1. Create a new game room
///    2. Join an existing game room
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('MainCtrl', function ($scope, $location, $localStorage, socket, gamedata) {
    // -----------------------------------------------------------------------------
    // Clear localstorage from previous sessions and set up a fresh one
    // -----------------------------------------------------------------------------
    $localStorage.$reset();

    $scope.data = {
      createButtonText: 'new game',
      joinButtonText: 'join game'
    };

    $scope.isNewGameDisabled = false;

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn CONNECT
    ///
    /// \brief Fired after a successfull socket connection to the server 
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.CONNECT, function() {
      console.log('Websocket connected.');
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn DISCONNECT
    ///
    /// \brief Fired if the connection to the server is lost
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.DISCONNECT, function() {
      console.log('Websocket disconnected.');
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_GAME_CREATED
    ///
    /// \brief Fired if a new game has been successfully created
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.NEW_GAME_CREATED, function(_data) {
      gamedata.gameRoomId = _data.gameRoomId;
      $location.path('gameroomlobby');
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn createNewGameRoom()
    ///
    /// \brief Notifies the server that the user wants to create a new game room.
    ////////////////////////////////////////////////////////////////////////////////
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
