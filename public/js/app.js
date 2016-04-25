"use strict";

(function(){
  angular
  .module("shows", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    Router
  ]);

  function Router($stateProvider){
    $stateProvider
    .state("index", {
      url: "/",
      templateUrl: "/assets/html/shows-index.html"
    })
  }
})();
