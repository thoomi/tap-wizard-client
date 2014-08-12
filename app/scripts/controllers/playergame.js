'use strict';

////////////////////////////////////////////////////////////////////////////////
/// PlayergameCtrl implements the logic for a player in the game
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('PlayergameCtrl', function ($scope, $localStorage, socket) {
    // -----------------------------------------------------------------------------
    // Initialize persistant storage
    // -----------------------------------------------------------------------------
    $scope.$storage = $localStorage;

    // -----------------------------------------------------------------------------
    // Define which objects should be stored persistent
    // -----------------------------------------------------------------------------
    /*$scope.$storage = $localStorage.$default({ gameRoomId : '' });*/ // Already set from join game view
    /*$scope.$storage = $localStorage.$default({ playerName : '' });*/ // Already set from join game view
    /*$scope.$storage = $localStorage.$default({ playerId   : '' });*/ // Already set from join game view
    $scope.$storage = $localStorage.$default({ cards                  : [] });
    $scope.$storage = $localStorage.$default({ currentRound           : 1  });
    $scope.$storage = $localStorage.$default({ isGameOver             : false });
    $scope.$storage = $localStorage.$default({ winnerName             : '' });
    $scope.$storage = $localStorage.$default({ currentStateLabel      : 'Waiting for the game to start.' });
    $scope.$storage = $localStorage.$default({ isGuessTricksDisabled  : true });
    $scope.$storage = $localStorage.$default({ isThowCardsDisabled    : true });
    $scope.$storage = $localStorage.$default({ hasPlayedCardThisTrick : false });


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
        gameRoomId   : $scope.$storage.gameRoomId,
        typeOfClient : 'player',
        playerId     : $scope.$storage.playerId
      };
      this.emit(socket.events.out.RECONNECT_TO_GAME, data);
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_STARTS
    ///
    /// \brief Fired after the users want to start the game
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.GAME_STARTS, function() {
      $scope.$storage.currentStateLabel = 'Game is running!';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_HAND_CARD
    ///
    /// \brief Fired if the user / player receives a new hand card. Adds the card to
    /// the local card stack.
    //////////////////////////////////////////////////////////////////////////////// 
	socket.on(socket.events.in.NEW_HAND_CARD, function(_data) {
      $scope.$storage.cards.push(_data.card);
    });

	////////////////////////////////////////////////////////////////////////////////
    /// \fn CARD_NOT_ALLOWED
    ///
    /// \brief Fired if the card the user wanted to play is not allowed.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.CARD_NOT_ALLOWED, function(_data) {
    	// TODO: Notify user through currentStateLabel dialog that the card is not allowed.
      	$scope.$storage.currentStateLabel = 'Sorry, card is not allowed: ' + _data.card.suit + ' ' + _data.card.value;
      	$scope.$storage.cards.push(_data.card);
      	$scope.$storage.hasPlayedCardThisTrick = false;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_ROUND_STARTS
    ///
    /// \brief Fired if the next round has been started.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.NEW_ROUND_STARTS, function(_data) {
      $scope.$storage.currentRound = _data.roundNumber;
      $scope.$storage.currentStateLabel = 'Please guess your number of tricks.';
      $scope.$storage.isGuessTricksDisabled = false;
      $scope.$storage.isThrowCardsDisabled = true;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired if a trick turn is over and a winner determined.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_HAS_WON_TRICK, function(_data) {
      $scope.$storage.hasPlayedCardThisTrick = false;

      if ($scope.$storage.playerId === _data.playerId)
      {
      	$scope.$storage.currentStateLabel = 'You are allowed to throw the first card, trick winner!';
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired after round has ended and a new dealer is needed.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_IS_DEALER, function() {
      $scope.$storage.currentStateLabel = 'Hit "Start Round" on the gametable, please. You\'re the dealer!';
    });

	////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_BEGIN_TURN
    ///
    /// \brief Fired if a new round has been started.
    ////////////////////////////////////////////////////////////////////////////////    
    socket.on(socket.events.in.PLAYER_BEGIN_TURN, function() {
      $scope.$storage.currentStateLabel = 'Your are the first player in this round.';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ALL_TRICKS_GUESSED
    ///
    /// \brief Fired after every player guessed tricks. Unlocks the throw card panel.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.ALL_TRICKS_GUESSED, function() {
      $scope.$storage.isThrowCardsDisabled = false;
      $scope.$storage.currentStateLabel = 'Game is running!';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_IS_OVER
    ///
    /// \brief Fired if the game is over, or somthing bad happend.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.GAME_IS_OVER, function(_data) {
      $scope.$storage.currentStateLabel = 'Game is over!';
      $scope.$storage.winnerName = _data.winnerName;
      $scope.$storage.gameOver = true;
    });

   	
   	////////////////////////////////////////////////////////////////////////////////
    /// \fn throwCard()
    ///
    /// \brief Handles the throw a card logic. It removes the card from the local
    /// stack and notifies the server that a card has been thrown.
    ////////////////////////////////////////////////////////////////////////////////  
    $scope.throwCard = function(_card) {
      if ($scope.$storage.hasPlayedCardThisTrick === false && $scope.$storage.isThrowCardsDisabled === false) {
        // Send card to server
        var data = { 
        	gameRoomId : $scope.$storage.gameRoomId,
        	playerId   : $scope.$storage.playerId,
        	card       : _card 
        };
        socket.emit(socket.events.out.THROW_CARD, data);

        // -----------------------------------------------------------------------------
	    // Remove the card from the local stack
	    // -----------------------------------------------------------------------------
        for (var indexOfCard = 0; indexOfCard < $scope.$storage.cards.length; indexOfCard++) 
        {
            if($scope.$storage.cards[indexOfCard].suit === _card.suit && $scope.$storage.cards[indexOfCard].value === _card.value) 
            {
                $scope.$storage.cards.splice(indexOfCard, 1);
            }
        }

        $scope.$storage.hasPlayedCardThisTrick = true;

        return true;
      }
      else {
        // TODO: Notify user that he already played a card
        return false;
      }
    };

	////////////////////////////////////////////////////////////////////////////////
    /// \fn guessNumberOfTricks()
    ///
    /// \brief Sends the number of tricks guessed by the user to the server
    ////////////////////////////////////////////////////////////////////////////////    
    $scope.guessNumberOfTricks = function(_number) {
      var data = { 
      	gameRoomId            : $scope.$storage.gameRoomId,
        playerId              : $scope.$storage.playerId,
      	numberOfGuessedTricks : _number 
      };

      socket.emit(socket.events.out.GUESS_TRICKS, data);

      $scope.$storage.isGuessTricksDisabled = true;
      $scope.$storage.currentStateLabel = 'Waiting for others to guess tricks.';
    };

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
