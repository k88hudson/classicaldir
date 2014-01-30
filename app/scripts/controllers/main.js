'use strict';

angular.module('classicaldirApp')
  .controller('navigationController', function($scope, $location, personaService, serviceConfig) {
    $scope.isActive = function(path) {
      return path === $location.path();
    };
  })
  .controller('AccountCtrl', function($scope) {
    $scope.isActive = function(path) {
      return path === $location.path();
    };
  })
  .controller('AddCtrl', function($scope, $http, $location) {

    $scope.listing = {};

    $scope.listing.datetime = function() {
      var date = $scope.listing.date;
      var time = $scope.time;
      if (time.isPM && time.hours < 12) {
        time.hours += 12;
      }
      var datetime = new Date(date);
      datetime.setHours(time.hours, time.minutes);
      console.log(date, time, datetime);
      return datetime;
    };

    var autocomplete = new google.maps.places.Autocomplete(document.querySelector('[name="address"]'));
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }
      $scope.map.center = {
        latitude: place.geometry.location.d,
        longitude: place.geometry.location.e
      };

      $scope.map.zoom = 15;

      $scope.$apply();
      console.log($scope.map);
    });

    $scope.map = {
      center: {
        latitude: 43.653226,
        longitude: -79.38318429999998
      },
      zoom: 12
    };

    $scope.today = new Date();
    $scope.time = {
      isPM: true
    };

    $scope.opened = {}
    $scope.open = function($event, name) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[name] = !$scope.opened[name];
    };

    // Submit all the data
    $scope.submit = function() {

      var newListingData = {
        title: $scope.listing.title,
        description: $scope.listing.description,
        programmeNotes: $scope.listing.programmeNotes,
        venue: $scope.listing.venue,
        address: $scope.listing.address,
        latitude: $scope.map.center.latitude,
        longitude: $scope.map.center.longitude,
        mapZoom: $scope.map.zoom,
        date: $scope.listing.datetime(),
        payWhatYouCan: $scope.listing.pwyc,
        free: $scope.listing.free,
        ticketPrice: $scope.listing.ticketPrice,
        ticketSpecialPrice: $scope.listing.ticketSpecialPrice,
        ticketPurchaseLink: $scope.listing.ticketPurchaseLink,
        phoneNumber: $scope.listing.phoneNumber,
        picture: $scope.listing.picture,
        email: $scope.user.email,
        contactName: $scope.listing.contactName
      };

      $http
        .post(serviceConfig.url + '/listings', newListingData)
        .success(function(data) {
          $location.path('/listings/' + data.id);
        })
        .error(function(err) {
          console.log(err);
        });
    };

  })

  .controller('DetailsCtrl', function($scope, $http, $routeParams, serviceConfig) {
    $scope.map = {
      center: {
        latitude: 43.653226,
        longitude: -79.38318429999998
      },
      mapZoom: 12
    };

    $http
      .get(serviceConfig.url + '/listings/' + $routeParams.id)
      .success(function(data) {
        $scope.listing = data;
        if (data.latitude && data.longitude) {
          $scope.map.center = {
            latitude: data.latitude,
            longitude: data.longitude
          };
          $scope.map.mapZoom = data.mapZoom || 12;
        }
      });
  })

  .controller('MainCtrl', function($scope, $http, serviceConfig) {

    // Filter

    $scope.now = new Date();
    $scope.year = $scope.now.getFullYear();
    $scope.month = $scope.now.getMonth();

    $scope.startDate = new Date();
    $scope.endDate = new Date($scope.year, $scope.month + 1, 0); // last day of month

    $scope.opened = {}
    $scope.open = function($event, name) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[name] = !$scope.opened[name];
    };

    // Main listings

    $scope.monthText = 'January';

    $http
      .get(serviceConfig.url + '/listings')
      .success(function(data) {
        $scope.listings = data;
      });
  });
