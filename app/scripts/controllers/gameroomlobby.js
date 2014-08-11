'use strict';

////////////////////////////////////////////////////////////////////////////////
/// Create game module (This is kind of the lobby state)
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('GameroomlobbyCtrl', function ($scope, $location, $log, socket, gamedata) {
    $scope.data = {
      waitingText: 'Waiting for other players to join:',
      startGameText: 'Start',
      players : [],
      gameRoomId: gamedata.gameRoomId
    };

    $scope.isStartDisabled = true;


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_JOINED_GAME
    ///
    /// \brief Fired when a new player joind the game
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_JOINED_GAME, function(_data) {
      // -----------------------------------------------------------------------------
      // Initialize total score property on player object
      // -----------------------------------------------------------------------------
      _data.totalScore = 0;

      $scope.data.players.push(_data);
      gamedata.players.push(_data);

      // -----------------------------------------------------------------------------
      // Enable start button if at least 3 players have joined the game
      // -----------------------------------------------------------------------------
      if ($scope.data.players.length >= 3)
      {
        $scope.isStartDisabled = false;
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_LEFT_GAME
    ///
    /// \brief Fired when a player left the game
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_LEFT_GAME, function(_data) {
      
      // -----------------------------------------------------------------------------
      // Search for the player who left the game
      // -----------------------------------------------------------------------------
      for (var indexOfPlayer = 0; indexOfPlayer < $scope.data.players.length; indexOfPlayer++)
      {
        if ($scope.data.players[indexOfPlayer].playerId === _data.playerId)
        {
          $log.info('Array: ' + $scope.data.players[indexOfPlayer].playerId);
          $log.info('Data: ' + _data.playerId);

          $scope.data.players.splice(indexOfPlayer, 1);
          gamedata.players.splice(indexOfPlayer, 1);
        }
      }

      // -----------------------------------------------------------------------------
      // Check if there are now less than 3 players
      // -----------------------------------------------------------------------------
      if ($scope.data.players.length < 3)
      {
        $scope.isStartDisabled = true;
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_STARTS
    ///
    /// \brief Fired if enough players have joind and the start button has been hit
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.GAME_STARTS, function(_data) {
      gamedata.maxRounds = _data.maxRounds;
      $location.path('gametable');
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn prepareGameForStart()
    ///
    /// \brief This function is bind to the start button. It notifies the server, 
    /// that the users want to start the game.
    ////////////////////////////////////////////////////////////////////////////////
    $scope.prepareGameForStart = function() {
      $scope.isStartDisabled = true;

      var data = {
        gameRoomId: gamedata.gameRoomId
      };
      socket.emit(socket.events.out.PREPARE_GAME, data);
    };

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
