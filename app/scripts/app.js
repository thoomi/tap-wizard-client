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
    'ngStorage',
    'ngDialog'
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


////////////////////////////////////////////////////////////////////////////////
/// Initialize the dialog module with sensible defaults
////////////////////////////////////////////////////////////////////////////////
angular.module('tapWizardClientApp')
  .config(['ngDialogProvider', function(ngDialogProvider) {
    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-default',
      plain: false,
      showClose: false,
      closeByDocument: true,
      closeByEscape: true,
      appendTo: false
    });
  }]);