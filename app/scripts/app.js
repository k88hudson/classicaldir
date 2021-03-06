'use strict';

angular.module('classicaldirApp', ['ngRoute', 'ui.bootstrap', 'google-maps'])
  .constant('serviceConfig', {
    url: 'http://c-directory-service.herokuapp.com'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/listings/:id', {
        templateUrl: 'views/details.html',
        controller: 'DetailsCtrl'
      })
      .when('/add', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
      })
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if ($rootScope.user) {
          config.headers.Authorization = 'Bearer ' + $rootScope.user.token;
        }
        return config;
      },
      response: function (response) {
        if (response.status === 401) {
          response.data = 'There was a problem with the authentication token -- maybe you are not signed in?';
        }
        return response || $q.when(response);
      }
    };
  })
  .factory('personaService', ['$http', '$q', '$rootScope', '$location', '$window', 'serviceConfig',
    function personaService($http, $q, $rootScope, $location, $window, serviceConfig) {

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
            .post( serviceConfig.url + '/auth', {
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
