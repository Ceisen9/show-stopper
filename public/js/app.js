"use strict";

(function(){
  angular
  .module("shows", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    "$locationProvider",
    "$urlRouterProvider",
    Router
  ])
  .factory("User", [
    "$resource",
    User
  ])
  .controller("profileCtrl", [
    "User",
    "$state",
    "$scope",
    profileCtrl
  ])
  .controller("showIndexCtrl", [
    "User",
    "$state",
    "$window",
    "$http",
    "$scope",
    showIndexCtrl
  ])
  .controller("showShowCtrl", [
    "User",
    "$stateParams",
    "$window",
    "$http",
    "$scope",
    "$state",
    "$resource",
    showShowCtrl
  ]);

  function Router($stateProvider, $locationProvider, $urlRouterProvider){
    // $locationProvider.html5Mode(true);
    $stateProvider
    .state("welcome", {
      url: "/",
      templateUrl: "/assets/html/welcome.html"
    })
    .state("profile", {
      url: "/profile",
      templateUrl: "/assets/html/profile.html",
      controller: "profileCtrl",
      controllerAs: "profileVM"
    })
    .state("index", {
      url: "/shows",
      templateUrl: "/assets/html/shows-index.html",
      controller: "showIndexCtrl",
      controllerAs: "indexVM"
    })
    .state("show", {
      url: "/shows/:name",
      templateUrl: "/assets/html/shows-show.html",
      controller: "showShowCtrl",
      controllerAs: "showVM"
    });
    // $urlRouterProvider.otherwise("/");
  }


  //User factory
  function User($resource){
    var User = $resource("/api/shows", {}, {
      update: {method: "PUT"},
    });
    var user = User.get();
    return user
  }

  function profileCtrl(User, $state){
    var vm = this;
    vm.user = User;
  };

  function showIndexCtrl(User, $state, $window, $http, $scope){
    var vm = this;

    vm.user = User.$promise.then(function(){
      vm.shows = User.favoriteShows;

    });

    vm.addShow = function(){

      vm.shows.push({
        "name": $scope.details.name,
         api_id: $scope.details.id,
          details: {
            image: $scope.details.image.medium,
            url: $scope.details.url,
            premiered: $scope.details.premiered,
            runtime: $scope.details.runtime,
            network: $scope.details.network.name,
            schedule: $scope.details.schedule.days.join(", "),
            genres: $scope.details.genres.join(", "),
            rating: $scope.details.rating.average
          }
        });
      User.$update().then(function(){
        // trigger a new state change
        // $state.go("index", {}, {reload: true});
        $window.location.replace("/#/shows/" + $scope.details.name);
      });
    }
    $scope.$watch('search', function() {
      fetch();
    });

    $scope.search = "Game of Thrones";

    function fetch(){
      $http.get("http://api.tvmaze.com/singlesearch/shows?q=" + $scope.search)
      .then(function(response){
        $scope.details = response.data;
        $(".summary").empty();
        $(".summary").append($scope.details.summary);

       });

      $http.get("http://api.tvmaze.com/search/shows?q=" + $scope.search)
      .then(function(response){
        $scope.related = response.data; });
    }

    $scope.update = function(show){
      $scope.search = show.name;
    };

  }

  function showShowCtrl(User, $stateParams, $window, $scope, $state, $http, $resource){
    var vm = this;

    var Episodes = $resource("http://api.tvmaze.com/shows/:id/episodes", {}, {
      get: {isArray: true },
    });

    function findShow(show){
      return show.name === $stateParams.name;
    };
    vm.show = User.favoriteShows.find(findShow);

    $scope.episodes  = Episodes.get({id: vm.show.api_id});
    console.log($scope.episodes);

    var showIndex = User.favoriteShows.findIndex(findShow);

    vm.delete = function(){
      User.favoriteShows.splice(showIndex, 1);
      User.$update().then(function(){
        // trigger a new state change
        $state.go("show", {}, {reload: true});
      });
      $window.location.replace("/#/shows");
    }
    vm.newEpisode = "";
    vm.addEpisode = function(){
      vm.show.episodes.push({"title": vm.newEpisode});
      User.$update().then(function(user){
        // trigger a new state change
        $state.go("show", {}, {reload: true});
        vm.newEpisode = "";
      });

    }
    vm.removeEpisode = function($index){
      vm.show.episodes.splice($index, 1);
      User.$update().then(function(user){
        // trigger a new state change
        $state.go("show", {}, {reload: true});
      });
    }
  }
})();
