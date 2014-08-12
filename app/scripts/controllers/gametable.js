'use strict';

////////////////////////////////////////////////////////////////////////////////
/// GameTableCtrl handles all logic like displaying cards and the score
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('GametableCtrl', function ($scope, $timeout, $log, $localStorage, socket) {
    // -----------------------------------------------------------------------------
    // Initialize persistant storage
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage;

    // -----------------------------------------------------------------------------
    // Define which objects should be stored persistent
    // -----------------------------------------------------------------------------
    /*$scope.$storage = $localStorage.$default({ players    : [] });*/                   // Exists from game room lobby
    /*$scope.$storage = $localStorage.$default({ gameRoomId : gamedata.gameRoomId });*/  // Exists from game room lobby
    /*$scope.$storage = $localStorage.$default({ maxRounds  : gamedata.maxRounds  });*/  // Exists from game room lobby
    $scope.$storage = $localStorage.$default({ cards        : [] });
    $scope.$storage = $localStorage.$default({ currentRound : 1  });
    $scope.$storage = $localStorage.$default({ trickWinner  : '' });
    $scope.$storage = $localStorage.$default({ trumpCard    : {} });
    $scope.$storage = $localStorage.$default({ scores       : [] });
    $scope.$storage = $localStorage.$default({ winnerName   : '' });
    $scope.$storage = $localStorage.$default({ isStartNextRoundDisabled : false });


    $scope.isStartNextRoundDisabled = false;


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn CONNECT
    ///
    /// \brief Fired after the disconnected socket has been reconencted
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
    /// \fn PLAYER_HAS_THROWN_CARD
    ///
    /// \brief Fired after a player threw a card. Adds the card to the local stack.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_HAS_THROWN_CARD, function(_data) {
      $scope.$storage.cards.push(_data.card);
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_TRUMP_CARD
    ///
    /// \brief Fired after a new trump card has been chosen.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.NEW_TRUMP_CARD, function(_data) {
      $scope.$storage.trumpCard = _data.card;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_GUESSED_TRICKS
    ///
    /// \brief Fired if a player guessed his number of tricks
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_GUESSED_TRICKS, function(_data) {
      $scope.$storage.scores[_data.roundNumber][_data.playerId] = {};
      $scope.$storage.scores[_data.roundNumber][_data.playerId].guessedTricks = _data.guessedTricks;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired after a trick turn. Sets a timeout funcion to remove the "old"
    /// cards on the table after a few seconds.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.PLAYER_HAS_WON_TRICK, function(_data) {
      $scope.$storage.trickwinner = _data.playerName;

      // -----------------------------------------------------------------------------
      // TODO: Develop some other way to remove the old cards...
      // -----------------------------------------------------------------------------
      $timeout(function() {
        $scope.$storage.cards = [];
      },5000);
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ROUND_IS_OVER
    ///
    /// \brief Fired if all tricks are played and a round is over. Receives and sets
    /// the round score per player to the leaderboard.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.ROUND_IS_OVER, function(_data) {
      $scope.$storage.trumpCard = {};

      $log.info(_data.scores);

      for (var indexOfPlayer = 0; indexOfPlayer < $scope.$storage.players.length; indexOfPlayer++) 
      {
        var playerId     = $scope.$storage.players[indexOfPlayer].playerId;
        var currentScore = $scope.$storage.players[indexOfPlayer].totalScore;
        var scoreToAdd   = _data.scores[playerId];

        // -----------------------------------------------------------------------------
        // Save the score to the scores object and the individual player
        // -----------------------------------------------------------------------------
        $scope.$storage.scores[$scope.$storage.currentRound][playerId].score = currentScore + scoreToAdd;
        $scope.$storage.players[indexOfPlayer].score = currentScore + scoreToAdd;
      }

      $scope.$storage.currentRound++;
      $scope.$storage.isStartNextRoundDisabled = false;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_IS_OVER
    ///
    /// \brief Fired if the game has ended, or somthin realy bad happend.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.GAME_IS_OVER, function(_data) {
      $scope.$storage.winnerName = _data.winnerName;
      $scope.$storage.gameOver = true;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn startRound()
    ///
    /// \brief Notifies the server to start the next game round.
    ////////////////////////////////////////////////////////////////////////////////    
    $scope.startRound = function() {
      $scope.$storage.isStartNextRoundDisabled = true;
      $scope.$storage.scores[$scope.$storage.currentRound] = {};
      $scope.$storage.trickwinner = '';

      var data = {
        gameRoomId: $scope.$storage.gameRoomId
      };
      socket.emit(socket.events.out.START_GAME_ROUND, data);
    };
  });
