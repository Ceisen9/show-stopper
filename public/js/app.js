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

  function showIndexCtrl(Show, $state){
    var vm = this;
    vm.shows = Show.all;

  }

  function showShowCtrl(Show, $stateParams, $window){
    var vm = this;
    Show.find("name", $stateParams.name, function(show){
      vm.show = show;
    });
    vm.update = function(){
      Show.update({name: vm.show.name}, {show: vm.show}, function(response) {
        console.log(response);
      });
    }
    vm.delete = function(){
      Show.remove({name: vm.show.name}, function(){
        $window.location.replace("/shows");
      });
    }
    vm.addEpisode = function(){
      if(vm.show.episodes.includes(vm.newEpisode)){
        console.log("nope, duplicate")
      } else{
        vm.show.episodes.push(vm.newEpisode);
        vm.newEpisode = "";
        vm.update();
      }
      vm.removeEpisode = function($index){
        vm.show.episodes.splice($index, 1);
        vm.update();
      }
    }
  }
})();
