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

  $routeProvider.when('/login', {
    templateUrl:'login.tpl.html', 
    controller:'LoginFormCtrl'
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

angular.module('app').controller('LoginFormCtrl', ['$scope', '$http', function($scope, $http){
  $scope.authorize = function () {
    var data = {
      username: $scope.username,
      password: $scope.password,
    };
    $http({
      url: '/login',
      method: 'POST',
      data: data
    }).success(function (data, status, headers, config) {
      console.log(arguments);
    });
  };
}]);
