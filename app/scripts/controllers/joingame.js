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

    $scope.joinGame = function() {
    	$scope.isJoinGameButtonDisabled = true;
    	$scope.data.joinGameText = 'Joining..';

    	gamedata.playerName = $scope.playerName;
    	gamedata.gameRoomId = $scope.gameRoomId;

    	var networkData = {
    		gameRoomId: gamedata.gameRoomId,
    		playerName: gamedata.playerName
    	};

    	socket.emit(socket.events.out.JOIN_GAME, networkData, function() {
    		$location.path('playergame');
    	});
    };

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
