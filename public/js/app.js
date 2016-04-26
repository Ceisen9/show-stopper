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
  .factory("Show", [
    "$resource",
    Show
  ])
  .controller("showIndexCtrl", [
    "Show",
    "$state",
    "$window",
    "$http",
    "$scope",
    showIndexCtrl
  ])
  .controller("showShowCtrl", [
    "Show",
    "$stateParams",
    "$window",
    showShowCtrl
  ]);

  function Router($stateProvider, $locationProvider, $urlRouterProvider){
    $locationProvider.html5Mode(true);
    $stateProvider
    .state("welcome", {
      url: "/",
      templateUrl: "/assets/html/shows-welcome.html"
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
    $urlRouterProvider.otherwise("/");
  }

  function Show($resource){
    var Show = $resource("/api/shows/:name", {}, {
      update: {method: "PUT"}
    });
    Show.all = Show.query();
    Show.find = function(property, value, callback){
      Show.all.$promise.then(function(show){
        Show.all.forEach(function(show){
          if(show[property]==value) callback(show);
        });
      });
    }
    return Show;
  }

  function showIndexCtrl(Show, $state, $window, $http, $scope){
    var vm = this;
    vm.shows = Show.all;
    vm.addShow = function(){
      Show.save({"name": vm.newShow}).$promise.then(function(){
        $window.location.replace("/shows/" + vm.newShow);
      });
    }

    // $scope.select = function(){
    //   this.setSelectionRange(0, this.value.length);
    // }
    $scope.searchName = "Sherlock Holmes";

    vm.search = function(){
      $scope.$watch('searchName', function() {
        console.log("clicked");

        $http.get("http://www.omdbapi.com/?t=" + $scope.searchName + "&tomatoes=true&plot=full&type=series")
        .then(function(response){
          console.log(response.data);
          $scope.details = response.data;
         });

        $http.get("http://www.omdbapi.com/?s=" + $scope.searchName)
        .then(function(response){
          console.log(response.data);
          $scope.related = response.data;
        });
      })
      // vm.update = function(show){
      //   $scope.search = show.Title;
      // }
    }
  }
  //
  // function fetch($scope, $http){
  //     $http.get("http://www.omdbapi.com/?t=" + $scope.search + "&tomatoes=true&plot=full")
  //     .then(function(response){ $scope.details = response.data; });
  //
  //     $http.get("http://www.omdbapi.com/?s=" + $scope.search)
  //     .then(function(response){ $scope.related = response.data; });
  //   }

  function showShowCtrl(Show, $stateParams, $window){
    var vm = this;
    Show.find("name", $stateParams.name, function(show){
      vm.show = show;
    });
    vm.update = function(){
      Show.update({name: $stateParams.name}, {show: vm.show}, function(response) {
        console.log(response);
      });
    }
    vm.delete = function(){
      Show.remove({name: vm.show.name}, function(){
        $window.location.replace("/shows");
      });
    }
    vm.addEpisode = function(){
      vm.show.episodes.push({"title": vm.newEpisode});
      vm.update();
      vm.newEpisode = "";
    }
    vm.removeEpisode = function($index){
      vm.show.episodes.splice($index, 1);
      vm.update();
    }
  }
})();
