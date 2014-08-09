'use strict';

/**
 * @ngdoc function
 * @name tapWizardClientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the tapWizardClientApp
 */
angular.module('tapWizardClientApp')
  .controller('MainCtrl', function ($scope) {
    $scope.game = {
      create: 'new game',
      join: 'join game'
    };
  });
