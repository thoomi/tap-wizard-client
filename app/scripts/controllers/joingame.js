'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This is the join game controller. It handles the logic to join an existing
/// game.
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('JoingameCtrl', function ($scope, $location, $localStorage, ngDialog, socket) {
    // -----------------------------------------------------------------------------
    // Initialize persistant storage
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage;

    // -----------------------------------------------------------------------------
    // Define which objects should be stored persistent
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage.$default({ gameRoomId : '' });
    $scope.$storage = $localStorage.$default({ playerName : '' });
    $scope.$storage = $localStorage.$default({ isJoinGameButtonDisabled : false });

    // -----------------------------------------------------------------------------
    // Define button lables etc.. for view
    // -----------------------------------------------------------------------------
    $scope.label = {
      joinGameText: 'Join'
    };


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn joinGame()
    ///
    /// \brief Notifies the server that the user wants to join the game
    ////////////////////////////////////////////////////////////////////////////////
    $scope.joinGame = function() {
        // -----------------------------------------------------------------------------
        // Check if socket is connected
        // -----------------------------------------------------------------------------
        if (!socket.socket.connected)
        {
            $scope.dialogModel = {};
            $scope.dialogModel.type = 'Error';
            $scope.dialogModel.message = 'Sorry, could not connect to game server.';

            ngDialog.open({
                template: 'views/dialogs/default.html',
                scope: $scope
            });

            return;
        }

    	$scope.$storage.isJoinGameButtonDisabled = true;
    	$scope.label.joinGameText = 'Joining..';

    	var networkData = {
    		gameRoomId: $scope.$storage.gameRoomId,
    		playerName: $scope.$storage.playerName
    	};

    	socket.emit(socket.events.out.JOIN_GAME, networkData, function(_data) {
            // -----------------------------------------------------------------------------
            // Save game id after successfull join and switch to the play view
            // -----------------------------------------------------------------------------
    		$scope.$storage.playerId = _data.playerId;
    		$location.path('playergame').replace();
    	});
    };

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ERROR
    ///
    /// \brief Handles error events from the server. Here in most cases might the
    /// gameroom not exist which the user wants to join.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.ERROR, function(_data) {
        $scope.dialogModel = {};
        $scope.dialogModel.type = _data.type;
        $scope.dialogModel.message = _data.message;

        ngDialog.open({
            template: 'views/dialogs/default.html',
            scope: $scope
        });

        $scope.$storage.isJoinGameButtonDisabled = false;
        $scope.label.joinGameText = 'Join';
    });

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
