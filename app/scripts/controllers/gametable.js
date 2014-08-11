'use strict';

////////////////////////////////////////////////////////////////////////////////
/// GameTableCtrl handles all logic like displaying cards and the score
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('GametableCtrl', function ($scope, $timeout, $log, socket, gamedata) {
    $scope.data = {
    	gameRoomId   : gamedata.gameRoomId,
    	players      : gamedata.players,
    	cards        : [],
    	currentRound : 1,
    	maxRounds    : gamedata.maxRounds,
    	trickWinner  : '',
    	trumpCard    : {},
    	scores       : [], 
    	isGameOver   : false,
    	winnerName   : ''
    };

    $scope.isStartNextRoundDisabled = false;

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_THROWN_CARD
    ///
    /// \brief Fired after a player threw a card. Adds the card to the local stack.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_HAS_THROWN_CARD, function(_data) {
      $scope.data.cards.push(_data.card);
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_TRUMP_CARD
    ///
    /// \brief Fired after a new trump card has been chosen.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.NEW_TRUMP_CARD, function(_data) {
      $scope.data.trumpCard = _data.card;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_GUESSED_TRICKS
    ///
    /// \brief Fired if a player guessed his number of tricks
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_GUESSED_TRICKS, function(_data) {
      $scope.data.scores[_data.roundNumber][_data.playerId] = {};
      $scope.data.scores[_data.roundNumber][_data.playerId].guessedTricks = _data.guessedTricks;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired after a trick turn. Sets a timeout funcion to remove the "old"
    /// cards on the table after a few seconds.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_HAS_WON_TRICK, function(_data) {
      $scope.data.trickwinner = _data.playerName;

      $timeout(function() {
        $scope.data.cards = [];
      },5000);
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ROUND_IS_OVER
    ///
    /// \brief Fired if all tricks are played and a round is over. Receives and sets
    /// the round score per player to the leaderboard.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.ROUND_IS_OVER, function(_data) {
      $scope.data.trumpCard = {};

      $log.info(_data.scores);

      for (var indexOfPlayer = 0; indexOfPlayer < $scope.data.players.length; indexOfPlayer++) 
      {
        var playerId     = $scope.data.players[indexOfPlayer].playerId;
        var currentScore = $scope.data.players[indexOfPlayer].totalScore;
        var scoreToAdd   = _data.scores[playerId];

        $log.info('PlayerId: ' + playerId);
        $log.info('currentScore: ' + currentScore);
        $log.info('scoreToAdd: ' + scoreToAdd);

        $scope.data.scores[$scope.data.currentRound][playerId].score = currentScore + scoreToAdd;
        $scope.data.players[indexOfPlayer].score = currentScore + scoreToAdd;
      }

      $scope.data.currentRound++;
      $scope.isStartNextRoundDisabled = false;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_IS_OVER
    ///
    /// \brief Fired if the game has ended, or somthin realy bad happend.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.GAME_IS_OVER, function(_data) {
      $scope.data.winnerName = _data.winnerName;
      $scope.data.gameOver = true;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn startRound()
    ///
    /// \brief Notifies the server to start the next game round.
    ////////////////////////////////////////////////////////////////////////////////    
    $scope.startRound = function() {
      $scope.isStartNextRoundDisabled = true;
      $scope.data.scores[$scope.data.currentRound] = {};
      $scope.data.trickwinner = '';

      var data = {
        gameRoomId: gamedata.gameRoomId
      };
      socket.emit(socket.events.out.START_GAME_ROUND, data);
    };
  });
