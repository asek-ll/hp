angular.module('app', [
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
}]);


angular.module('app').run(['userAuth', function(userAuth) {
  userAuth.requestCurrentUser();
}]);



angular.module('app').controller('HeaderCtrl', ['$scope', '$location', '$route', 'userAuth',
  function ($scope, $location, $route, userAuth) {

  $scope.isAuthenticated = userAuth.isAuthenticated;
  $scope.isAdmin = userAuth.isAdmin;
  $scope.user = userAuth.currentUser;

  console.log($scope.user, userAuth);

}]);
