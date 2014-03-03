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
