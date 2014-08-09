/* global io*/
'use strict';

////////////////////////////////////////////////////////////////////////////////
/// This Socket service abstracts the socket io library for usage in angular
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .service('socket', function Socket($rootScope) {
  	// -----------------------------------------------------------------------------
    // Create the connection to the game server. The "io" variable is the global
    // socket.io object (file included in index.html).
    // -----------------------------------------------------------------------------
    var socket = io.connect('http://localhost:3000', {
    	reconnection:         true,
    	reconnectionDelay:    1000, // 1 sec
    	reconnectionDelayMax: 5000, // 3 sec
    	timeout:              20000 // 20 sec
    });

    io.reconnectionAttempts(5);

    return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            },
            removeAllListeners: function() {
              socket.removeAllListeners();
            },
            events: {
                in: {
                    CONNECT:                'connect',                // Fired upon connecting
                    DISCONNECT:             'disconnect'              // Fired upon a disconnection
                    CONNECT_ERROR           'connect_error',          // Fired upon connection error
                    RECONNECT               'reconnect',              // Fired upon a successful reconnection
                    RECONNECT_ATTEMPT       'reconnect_attempt',      // Fired upon an attempt to reconnect
                    RECONNECTING:           'reconnecting',           // Fired upon an attempt to reconnect
                    RECONNECT_ERROR:        'reconnect_error',        // Fired upon an reconnection attempt error
                    RECONNECT_FAILD:        'reconnect_faild',        // Fired when couldn't reconnect within 'reconnectionAttempts'
                    PLAYER_JOINED_GAME:     'player_joined_game',     // Fired when a player joined the game room
                    NOT_ENOUGH_PLAYERS:     'not_enough_players',     // Fired if not enough players in the room to start the game
                    GAME_STARTS:            'game_starts',            // Fired upon game start
                    NEW_ROUND_STARTS:       'new_round_starts',       // Fired when a new round begins
                    NEW_HAND_CARD:          'new_hand_card',          // Fired when the server deals the game cards
                    NEW_TRUMP_CARD:         'new_trump_card',         // Fired when the server chose a trump card for a round
                    PLAYER_IS_DEALER:       'player_is_dealer',       // Fired after a round end to notify the player who is the next dealer
                    PLAYER_BEGIN_TURN:      'player_begin_turn',      // Fired upon the beginning of a new trick turn
                    PLAYER_GUESSED_TRICKS:  'player_guessed_tricks',  // Fired when a player guessed the tricks for a round
                    ALL_TRICKS_GUESSED:     'all_tricks_guessed',     // Fired when all tricks for a round are guessed
                    CARD_NOT_ALLOWED:       'card_not_allowed',       // Fired when a card the player wanted to play is not allowed
                    PLAYER_HAS_THROWN_CARD: 'player_has_thrown_card', // Fired after a player successfully played a card
                    PLAYER_HAS_WON_TRICK:   'player_has_won_trick',   // Fired to notify the players that a trick turn is over
                    ROUND_IS_OVER:          'round_is_over',          // Fired when a round has ended
                    GAME_IS_OVER:           'game_is_over'            // Fired when the game ended
                    ERROR:                  'error'                   // Fired upn an error
                },
                out: {
                    RECONNECT_TO_GAME: 'reconnect_to_game',
                    NEW_GAME:          'create_new_game',
                    PREPARE_GAME:      'prepare_game',
                    START_GAME_ROUND:  'start_game_round',
                    JOIN_GAME:         'join_game',
                    THROW_CARD:        'throw_card',
                    GUESS_TRICKS:      'guess_tricks'
                }
            }
        };
  });
