'use strict';

/**
 * @ngdoc service
 * @name tapWizardClientApp.gamedata
 * @description
 * # gamedata
 * Factory in the tapWizardClientApp.
 */
angular.module('tapWizardClientApp')
  .factory('gamedata', function () {

    var gameRoomId = '';
    var players    = [];
    var maxRounds  = 0;
    var playerName = 'Player';
    var playerId   = '';

    return {
      gameRoomId      : gameRoomId,
      players         : players,
      maxRounds       : maxRounds,
      numberOfPlayers : players.length,
      playerName      : playerName,
      playerId        : playerId
    };
  });
