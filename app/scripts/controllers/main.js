'use strict';

angular.module('classicaldirApp')
  .controller('navigationController', function($scope, $location) {
    $scope.isActive = function(path) {
      return path === $location.path();
    };
  })
  .controller('AddCtrl', function($scope, $http) {

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

    $scope.today = new Date();

    $scope.map = {
      center: {
        latitude: 43.653226,
        longitude: -79.38318429999998
      },
      zoom: 12
    };

    $scope.opened = {}
    $scope.open = function($event, name) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[name] = !$scope.opened[name];
    };

  })

  .controller('MainCtrl', function($scope) {

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

    $scope.listings = [
      {
        date: 'January 1',
        time: '1:00 PM',
        title: 'Musicians in Ordinary',
        description: 'A New Year’s Day Concert – French Baroque Cantatas and Sonatas',
        programme: 'Viola ensemble',
        venue: 'Heliconian Hall',
        address: '35 Hazelton Ave.',
        free: false,
        pwyc: false,
        price: '$15',
        phone: '343-3432',
        specialPrice: '$10 seniors',
        image: 'http://canadianmusician.com/news/wp-content/uploads/2012/08/CM-Takes5-SO12-TSO1-by-Sian-Richards.jpg'
      },
      {
        date: 'Sat. Jan. 11, 2014',
        time: '1:00 PM',
        title: 'Mozart Symphony 39',
        description: 'A New Year’s Day Concert – French Baroque Cantatas and Sonatas',
        programme: 'Mozart composed his final three symphonies (Nos. 39, 40, and 41) in an intense burst of creative brilliance. No. 39 is one of the most charming and witty in the entire cycle. Ignat Solzhenitsyn performs both as conductor and soloist in Mozart\'s charming Piano Concerto No. 18.',
        venue: 'Roy Thomson Hall',
        address: 'Simcoe St.',
        free: false,
        pwyc: false,
        price: '$45-$150',
        phone: ' 1.855.985.2787',
        specialPrice: '$12 for under 35s',
        image: 'http://files.tso.ca/Images/Artists/1314-Mozart39-IgnatSolzhenitsyn.jpg'
      },
      {
        date: 'January 1',
        time: '1:00 PM',
        title: 'Whatever',
        description: 'A New Year’s Day Concert – French Baroque Cantatas and Sonatas',
        programme: 'Viola ensemble',
        venue: 'Heliconian Hall',
        address: '35 Hazelton Ave.',
        free: false,
        pwyc: false,
        price: '$15',
        phone: '343-3432',
        specialPrice: '$10 seniors'
      }
    ];
  });
