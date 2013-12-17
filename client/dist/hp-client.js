/*! hp-client - v0.0.1 - 2013-12-17
 * Copyright (c) 2013 Denis Blokhin;
 * Licensed 
 */
angular.module('accounting', [
  'ngRoute'
]);


angular.module('accounting').config(['$routeProvider',  function ($routeProvider) {
  $routeProvider.when('/accounting', {
    templateUrl:'accounting/account-list.tpl.html', 
    controller:'accountListCtrl'
  }); 
  $routeProvider.when('/accounting/transfer', {
    templateUrl:'accounting/transfer-list.tpl.html', 
    controller:'transferListCtrl'
  }); 
  $routeProvider.when('/accounting/transfer/new', {
    templateUrl:'accounting/transfer-form.tpl.html', 
    controller:'transferFormCtrl'
  }); 
}]);



angular.module('accounting').controller('accountListCtrl',['$scope', function ($scope) {
  //body
}]);
angular.module('accounting').controller('transferListCtrl',['$scope', function ($scope) {
  //body
}]);
angular.module('accounting').controller('transferFormCtrl',['$scope', function ($scope) {
  //body
}]);

angular.module('app', [
  'accounting',
  'ngRoute',
  'user',
  'templates.app',
  'templates.common'
]);

angular.module('app').controller('AppCtrl',['$scope', function ($scope) {
  //body
}]);

angular.module('app').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.otherwise({redirectTo:'/'});

  $routeProvider.when('/auth/return', {
    template:'test', 
    controller:'returnToCtrl'
  }); 

}]);

angular.module('app').run(['userAuth', function(userAuth) {
  userAuth.requestCurrentUser();
}]);


angular.module('app').controller('returnToCtrl', ['$window', '$location', function($window, $location){
  if($window.opener){
    $window.opener.location.reload();
    $window.close();
  } else {
    $location.path("/");
  }
}]);

angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'userAuth',
  function ($scope, $location, $route, userAuth) {

  $scope.isAuthenticated = userAuth.isAuthenticated;
  $scope.isAdmin = userAuth.isAdmin;
  //$scope.user = userAuth.currentUser;
  $scope.userAuth = userAuth;

}]);

angular.module('user', [ ]);

angular.module('user').factory('userAuth', ['$http', '$q', '$location', function($http, $q, $location) {

  var service = {

    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } 
      return $http.get('/current-user').then(function(response) {
        service.currentUser = response.data.user;
        return service.currentUser;
      });
    },

    currentUser: null,

    isAuthenticated: function(){
      return !!service.currentUser;
    },

    logout: function() {
      $http.get('/logout').then(function() {
        service.currentUser = null;
      });
    },
    
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]); 

angular.module('templates.app', ['accounting/account-list.tpl.html', 'accounting/transfer-form.tpl.html', 'accounting/transfer-list.tpl.html', 'header.tpl.html']);

angular.module("accounting/account-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/account-list.tpl.html",
    "Account LIst\n" +
    "");
}]);

angular.module("accounting/transfer-form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/transfer-form.tpl.html",
    "Transfer form\n" +
    "");
}]);

angular.module("accounting/transfer-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("accounting/transfer-list.tpl.html",
    "Transfer list\n" +
    "");
}]);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<nav class=\"navbar navbar-default navbar-static-top\" role=\"navigation\" ng-controller=\"HeaderCtrl\">\n" +
    "<div class=\"container\">\n" +
    "  <div class=\"navbar-header\">\n" +
    "    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-8\">\n" +
    "      <span class=\"sr-only\">Toggle navigation</span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "      <span class=\"icon-bar\"></span>\n" +
    "    </button>\n" +
    "    <a class=\"navbar-brand\" href=\"/\">HoPan</a>\n" +
    "  </div>\n" +
    "\n" +
    "  <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "  <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-8\">\n" +
    "    <ul ng-if='userAuth.currentUser' class=\"nav navbar-nav\">\n" +
    "      <li><a href=\"/accounting\">Accounting</a></li>\n" +
    "      <li><a href=\"#\">Link</a></li>\n" +
    "    </ul>\n" +
    "    <ul class=\"nav navbar-nav navbar-right\">\n" +
    "      <li ng-if='!userAuth.currentUser'><a href=\"/auth/google\" onClick=\"window.open('/auth/google','new','width=800,height=600,scrollbars=no,menubar=no,status=no,toolbar=no')\">Login</a></li>\n" +
    "      <li ng-if='userAuth.currentUser'><a href='/' ng-bind=\"userAuth.currentUser.displayName\"></a></li>\n" +
    "      <li ng-if='userAuth.currentUser'><button class=\"btn btn-default navbar-btn\" ng-click=\"userAuth.logout()\" >Logout</button></li>\n" +
    "    </ul>\n" +
    "  </div><!-- /.navbar-collapse -->\n" +
    "</div>\n" +
    "</nav>\n" +
    "");
}]);

angular.module('templates.common', []);

