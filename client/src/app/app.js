angular.module('app', [
  'accounting',
  'ngRoute',
  'angularOauth',
  'templates.app',
  'templates.common'
]);

angular.module('app').controller('AppCtrl',['$scope', function ($scope) {
  //body
}]);

angular.module('app').config(['$routeProvider', '$locationProvider','TokenProvider', function ($routeProvider, $locationProvider, TokenProvider) {
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

  TokenProvider.extendConfig({
    clientId: 'webclient',
    redirectUri: '/oauth2callback.html',  // allow lunching demo from a mirror
    scopes: ["*"],
    authorizationEndpoint: '/login',
    verifyFunc: function (config, accessToken) {
      var $injector = angular.injector(['ng']);
      return $injector.invoke(['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
        var deferred = $q.defer();

        $rootScope.$apply(function() {
          deferred.resolve(accessToken);
        });

        return deferred.promise;
      }]);
    }
  });

  $routeProvider.when('/oauth2callback', {
    templateUrl:'oauth2callback.tpl.html', 
    controller:'CallbackCtrl'
  }); 

}]);


angular.module('app').controller('returnToCtrl', ['$window', '$location', function($window, $location){
  if($window.opener){
    $window.opener.location.reload();
    $window.close();
  } else {
    $location.path("/");
  }
}]);

angular.module('app').controller('HeaderCtrl', ['$rootScope','$scope', '$location', '$route', 'Token', function ($rootScope, $scope, $location, $route, Token) {

  $scope.accessToken = Token.get();

  $scope.authenticate = function() {
    var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};
    Token.getTokenByPopup(extraParams)
    .then(function(params) {
      // Success getting token from popup.

      // Verify the token before setting it, to avoid the confused deputy problem.
      Token.verifyAsync(params.access_token).
        then(function(data) {
        $rootScope.$apply(function() {
          $scope.accessToken = params.access_token;
          $scope.expiresIn = params.expires_in;

          Token.set(params.access_token);
          console.log("token", params);
        });
      }, function() {
        alert("Failed to verify token.");
      });

    }, function() {
      // Failure getting token from popup.
      alert("Failed to get token from popup.");
    });
  };


  //$scope.isAuthenticated = userAuth.isAuthenticated;
  //$scope.isAdmin = userAuth.isAdmin;
  //$scope.user = userAuth.currentUser;
  //$scope.userAuth = userAuth;

}]);

angular.module('app').controller('LoginFormCtrl', ['$scope', '$http', function($scope, $http){
 }]);
