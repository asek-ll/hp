angular.module('user', [ ]).factory('userAuth', ['$http', '$q', '$location', function($http, $q, $location) {

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
    
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}]); 
