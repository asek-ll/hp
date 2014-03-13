angular.module('accounting', [
  'ngRoute',
  'angularOauth',
  'ngResource'
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
  $routeProvider.when('/accounting/new', {
    templateUrl:'accounting/account-form.tpl.html', 
    controller:'accountFormCtrl'
  }); 
}]);

angular.module('accounting').factory('Accounts',['$resource','Token', function ($resource, Token) {
  var resource = $resource('/api/accounts/:id', {
    id:'@_id'
  });
  resource = Token.wrapActions( resource, ["query", "update", "save"] );
  return resource;
}]);


angular.module('accounting').controller('accountListCtrl',['$scope','Accounts', function ($scope, Accounts) {
  var accounts = Accounts.query({}, function () {
    $scope.accounts = accounts;
  });
}]);

angular.module('accounting').controller('accountFormCtrl',['$scope', 'Accounts', '$location', function ($scope, Accounts, $location) {
  $scope.save = function(){
    var newAccount = new Accounts({name: $scope.name});
    newAccount.$save(function () {
      $location.path('/accounting');
    });
  };
}]);

angular.module('accounting').controller('transferListCtrl',['$scope', function ($scope) {
  //body
}]);
angular.module('accounting').controller('transferFormCtrl',['$scope', function ($scope) {
  //body
}]);
