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
