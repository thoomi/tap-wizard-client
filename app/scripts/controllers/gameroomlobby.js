'use strict';

////////////////////////////////////////////////////////////////////////////////
/// Create game module (This is kind of the lobby state)
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('GameroomlobbyCtrl', function ($scope, $location, $log, $localStorage, socket, gamedata) {
    // -----------------------------------------------------------------------------
    // Initialize persistant storage
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage;

    // -----------------------------------------------------------------------------
    // Define which objects should be stored persistent
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage.$default({ players         : [] });
    $scope.$storage = $localStorage.$default({ gameRoomId      : gamedata.gameRoomId });
    $scope.$storage = $localStorage.$default({ isStartDisabled : true });


    // -----------------------------------------------------------------------------
    // Define ordinary data bindings for view
    // -----------------------------------------------------------------------------
    $scope.label = {
      waitingText: 'Waiting for other players to join:',
      startGameText: 'Start'
    };

    $scope.isWaitingForGameStart = false;


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn CONNECT
    ///
    /// \brief Fired if the browser reconnected to the socket
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.CONNECT, function() {
      // -----------------------------------------------------------------------------
      // Notify the server that we want to reconnect to an existing game
      // -----------------------------------------------------------------------------
      var data = {
        gameRoomId: $scope.$storage.gameRoomId,
        typeOfClient: 'game_table'
      };
      this.emit(socket.events.out.RECONNECT_TO_GAME, data);
    });
    

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

      $scope.$storage.players.push(_data);

      // -----------------------------------------------------------------------------
      // Enable start button if at least 3 players have joined the game
      // -----------------------------------------------------------------------------
      if ($scope.$storage.players.length >= 3)
      {
        $scope.$storage.isStartDisabled = false;
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
      for (var indexOfPlayer = 0; indexOfPlayer < $scope.$storage.players.length; indexOfPlayer++)
      {
        if ($scope.$storage.players[indexOfPlayer].playerId === _data.playerId)
        {
          $scope.$storage.players.splice(indexOfPlayer, 1);
        }
      }

      // -----------------------------------------------------------------------------
      // Check if there are now less than 3 players
      // -----------------------------------------------------------------------------
      if ($scope.$storage.players.length < 3)
      {
        $scope.$storage.isStartDisabled = true;
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_STARTS
    ///
    /// \brief Fired if enough players have joind and the start button has been hit
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.GAME_STARTS, function(_data) {
      $scope.$storage.maxRounds = _data.maxRounds;
      $location.path('gametable');
    });


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NOT_ENOUGH_PLAYERS
    ///
    /// \brief Fired if not enough players have joined
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.NOT_ENOUGH_PLAYERS, function() {
      // -----------------------------------------------------------------------------
      // Initialize total score property on player object
      // -----------------------------------------------------------------------------
      $log.info('Not enough players!');
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn prepareGameForStart()
    ///
    /// \brief This function is bind to the start button. It notifies the server, 
    /// that the users want to start the game.
    ////////////////////////////////////////////////////////////////////////////////
    $scope.prepareGameForStart = function() {
      $scope.$storage.isStartDisabled = true;
      $scope.isWaitingForGameStart = true;

      var data = {
        gameRoomId: $scope.$storage.gameRoomId
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
