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
    "$scope",
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


  function User($resource){
    var User = $resource("/api/shows", {}, {
      update: {method: "PUT"},
      'query': {method: 'GET', isArray: false }
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

    vm.newShow = "";

    vm.addShow = function(){
      vm.shows.push({"name": vm.newShow});
      User.$update().then(function(){
        vm.newShow = "";
        // $window.location.replace("/#/shows/" + vm.newShow);
      });
    }
    $scope.$watch('search', function() {
      fetch();
    });

    $scope.search = "";

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



  function showShowCtrl(User, $stateParams, $window, $scope){
    var vm = this;

    function findShow(show){
      return show.name === $stateParams.name;
    };
    vm.show = User.favoriteShows.find(findShow);


    var showIndex = User.favoriteShows.findIndex(findShow);

    vm.delete = function(){
      User.favoriteShows.splice(showIndex, 1);
      User.$update();
      $window.location.replace("/#/shows");
    }
    vm.newEpisode = "";
    vm.addEpisode = function(){
      vm.show.episodes.push({"title": vm.newEpisode});
      console.log(vm.show.episodes);
      User.$update();
      vm.newEpisode = "";

    }
    vm.removeEpisode = function($index){
      vm.show.episodes.splice($index, 1);
      User.$update();
    }
  }
})();
