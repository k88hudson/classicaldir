'use strict';

angular.module('classicaldirApp', ['ngRoute', 'ui.bootstrap', 'google-maps'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('personaService', ['$http', '$q', '$rootScope', '$location', '$window',
    function personaService($http, $q, $rootScope, $location, $window) {

      // Restore user state from local storage.
      $rootScope.user = $window.localStorage.user ? angular.fromJson($window.localStorage.user) : {};

      // Update local storage on changes to _user object.
      $rootScope.$watch('user', function() {
        if ($rootScope.user) {
          $window.localStorage.user = angular.toJson($rootScope.user);
        } else {
          delete $window.localStorage.user;
        }
      });

      // Set up login/logout functions
      $rootScope.login = function () {
        navigator.id.request();
      };
      $rootScope.logout = function () {
        navigator.id.logout();
        $rootScope.user = {};
      };

      navigator.id.watch({
        loggedInUser: null,
        onlogin: function (assertion) {
          var deferred = $q.defer();
          var audience = window.location.origin;

          $http
            .post('http://webmaker-events-service.herokuapp.com/auth', {
              audience: audience,
              assertion: assertion
            })
            .then(function (response) {
              if (response.status !== 200) {
                deferred.reject(response.data);
              } else {
                deferred.resolve(response.data);
              }
            });

          deferred.promise.then(function (data) {
            $rootScope.user = data;

          }, function (err) {
            navigator.id.logout();
            console.log(err);
          });
        },
        onlogout: function () {
          $rootScope.user = {};
          $rootScope.$apply();
        }
      });

      return {};
    }]);
