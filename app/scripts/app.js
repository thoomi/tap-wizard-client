'use strict';

////////////////////////////////////////////////////////////////////////////////
/// Setup the angular modules and the main components. Furthermore all available
/// routes are defined here.
////////////////////////////////////////////////////////////////////////////////
angular
  .module('tapWizardClientApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/joingame', {
        templateUrl: 'views/joingame.html',
        controller: 'JoingameCtrl'
      })
      .when('/gameroomlobby', {
        templateUrl: 'views/gameroomlobby.html',
        controller: 'GameroomlobbyCtrl'
      })
      .when('/playergame', {
        templateUrl: 'views/playergame.html',
        controller: 'PlayergameCtrl'
      })
      .when('/gametable', {
        templateUrl: 'views/gametable.html',
        controller: 'GametableCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
