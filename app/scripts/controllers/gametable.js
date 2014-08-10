'use strict';

////////////////////////////////////////////////////////////////////////////////
/// GameTableCtrl handles all logic like displaying cards and the score
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('GametableCtrl', function ($scope, gamedata) {
    $scope.data = {
    	gameRoomId   : gamedata.gameRoomId,
    	players      : gamedata.players,
    	cards        : [],
    	currentRound : 0,
    	maxRounds    : gamedata.maxRounds,
    	trickWinner  : '',
    	trumpCard    : {},
    	scores       : [],
    	isGameOver   : false,
    	winnerName   : ''
    };

    $scope.maxRounds = 20;

    $scope.data.players.push({playerName: 'tho', playerId: '1'});
    $scope.data.players.push({playerName: 'mich', playerId: '2'});
    $scope.data.players.push({playerName: 'man', playerId: '3'});

    $scope.isStartNextRoundDisabled = true;
  });
