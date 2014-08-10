'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This is the join game controller. It handles the logic to join an existing
/// game.
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('JoingameCtrl', function ($scope, $location, socket, gamedata) {
    $scope.data = {
      joinGameText: 'Join'
    };

    $scope.isJoinGameButtonDisabled = false;

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn joinGame()
    ///
    /// \brief Notifies the server that the user wants to join the game
    ////////////////////////////////////////////////////////////////////////////////
    $scope.joinGame = function() {
    	$scope.isJoinGameButtonDisabled = true;
    	$scope.data.joinGameText = 'Joining..';

    	gamedata.playerName = $scope.playerName;
    	gamedata.gameRoomId = $scope.gameRoomId;

    	var networkData = {
    		gameRoomId: gamedata.gameRoomId,
    		playerName: gamedata.playerName
    	};

    	socket.emit(socket.events.out.JOIN_GAME, networkData, function(_data) {
    		gamedata.playerId = _data.playerId;
    		$location.path('playergame');
    	});
    };

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ERROR
    ///
    /// \brief Handles error events from the server. Here in most cases might the
    /// gameroom not exist which the user wants to join.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.ERROR, function() {
      $scope.isJoinGameButtonDisabled = false;
      $scope.data.joinGameText = 'Join';
    });

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
