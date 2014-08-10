'use strict';

////////////////////////////////////////////////////////////////////////////////
/// PlayergameCtrl implements the logic for a player in the game
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .controller('PlayergameCtrl', function ($scope, socket, gamedata) {
    $scope.data = {
    	cards        : [],
    	currentRound : 0,
    	notification : 'Waiting for the game start.',
    	isGameOver   : false,
    	winnerName   : ''
    };

    $scope.isGuessTricksDisabled  = true;
    $scope.isThowCardsDisabled    = true;
    $scope.hasPlayedCardThisTrick = false;


    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_STARTS
    ///
    /// \brief Fired after the users want to start the game
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.GAME_STARTS, function() {
      $scope.data.notification = 'Game is running!';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_HAND_CARD
    ///
    /// \brief Fired if the user / player receives a new hand card. Adds the card to
    /// the local card stack.
    //////////////////////////////////////////////////////////////////////////////// 
	socket.on(socket.events.in.NEW_HAND_CARD, function(_data) {
      $scope.data.cards.push(_data.card);
    });

	////////////////////////////////////////////////////////////////////////////////
    /// \fn CARD_NOT_ALLOWED
    ///
    /// \brief Fired if the card the user wanted to play is not allowed.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.CARD_NOT_ALLOWED, function(_data) {
    	// TODO: Notify user through notification dialog that the card is not allowed.
      	$scope.data.notification = 'Sorry, card is not allowed: ' + _data.card.suit + ' ' + _data.card.value;
      	$scope.data.cards.push(_data.card);
      	$scope.hasPlayedCardThisTrick = false;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn NEW_ROUND_STARTS
    ///
    /// \brief Fired if the next round has been started.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.NEW_ROUND_STARTS, function(_data) {
      $scope.data.currentRound = _data.roundNumber;
      $scope.data.notification = 'Please guess your number of tricks.';
      $scope.isGuessTricksDisabled = false;
      $scope.isThrowCardsDisabled = true;
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired if a trick turn is over and a winner determined.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_HAS_WON_TRICK, function(_data) {
      $scope.playedCardThisTrick = false;

      if (gamedata.playerId === _data.playerId)
      {
      	$scope.data.notification = 'You are allowed to throw the first card, trick winner!';
      }
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_HAS_WON_TRICK
    ///
    /// \brief Fired after round has ended and a new dealer is needed.
    ////////////////////////////////////////////////////////////////////////////////
    socket.on(socket.events.in.PLAYER_IS_DEALER, function() {
      $scope.data.notification = 'Hit "Start Round" on the gametable, please. You\'re the dealer!';
    });

	////////////////////////////////////////////////////////////////////////////////
    /// \fn PLAYER_BEGIN_TURN
    ///
    /// \brief Fired if a new round has been started.
    ////////////////////////////////////////////////////////////////////////////////    
    socket.on(socket.events.in.PLAYER_BEGIN_TURN, function() {
      $scope.data.notification = 'Your are the first player in this round.';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn ALL_TRICKS_GUESSED
    ///
    /// \brief Fired after every player guessed tricks. Unlocks the throw card panel.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.ALL_TRICKS_GUESSED, function() {
      $scope.isThrowCardsDisabled = false;
      $scope.data.notification = 'Game is running!';
    });

    ////////////////////////////////////////////////////////////////////////////////
    /// \fn GAME_IS_OVER
    ///
    /// \brief Fired if the game is over, or somthing bad happend.
    //////////////////////////////////////////////////////////////////////////////// 
    socket.on(socket.events.in.GAME_IS_OVER, function(_data) {
      $scope.data.notification = 'Game is over!';
      $scope.data.winnerName = _data.winnerName;
      $scope.data.gameOver = true;
    });

   	
   	////////////////////////////////////////////////////////////////////////////////
    /// \fn throwCard()
    ///
    /// \brief Handles the throw a card logic. It removes the card from the local
    /// stack and notifies the server that a card has been thrown.
    ////////////////////////////////////////////////////////////////////////////////  
    $scope.throwCard = function(_card) {
      if ($scope.hasPlayedCardThisTrick === false && $scope.isThrowCardsDisabled === false) {
        // Send card to server
        var data = { 
        	gameRoomId : gamedata.gameRoomId,
        	playerId   : gamedata.playerId,
        	card       : _card 
        };
        socket.emit(socket.events.out.THROW_CARD, data);

        // -----------------------------------------------------------------------------
	    // Remove the card from the local stack
	    // -----------------------------------------------------------------------------
        for (var indexOfCard = 0; indexOfCard < $scope.data.cards.length; indexOfCard++) 
        {
            if($scope.cards[indexOfCard].suit === _card.suit && $scope.data.cards[indexOfCard].value === _card.value) 
            {
                $scope.data.cards.splice(indexOfCard, 1);
            }
        }

        $scope.hasPlayedCardThisTrick = true;

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
      	gameRoomId            : gamedata.gameRoomId, 
      	numberOfGuessedTricks : _number 
      };

      socket.emit(socket.events.out.GUESS_TRICKS, data);

      $scope.isGuessTricksDisabled = true;
      $scope.data.notification = 'Waiting for others to guess tricks.';
    };

    // -----------------------------------------------------------------------------
    // Remove all socket listeners when the controller is destroyed respectively the
    // view gets switched.
    // -----------------------------------------------------------------------------
    $scope.$on('$destroy', function () {
        socket.removeAllListeners();
    });
  });
