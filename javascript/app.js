var app = angular.module("estimator", ["firebase"]);


app.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {

    $routeProvider.
      when('/projects', {
        templateUrl: 'views/projects/index.html',
        controller: 'ProjectShowController',
        authRequired: 'true'
      }).
      when('/projects/:projectId', {
        templateUrl: 'views/projects/show.html',
        controller: 'ProjectChannelController',
        authRequired: 'true'
      }).
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        authRequired: 'false'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

app.controller('LoginController', ['$scope','angularFireAuth',function($scope, angularFireAuth){
    var url = "https://320ny.firebaseio.com/";
    var firebase = new Firebase(url);
    $scope.login_form= {};
    angularFireAuth.initialize(firebase, {
      scope: $scope, name: "user",
      callback: function(err, user) {
        // Called whenever there is a change in authentication state.
      }
    });

    $scope.login = function() {
      var email = $scope.login_form.email;
      var password = $scope.login_form.password;
     angularFireAuth.login('password',{
      email: email,
      password: password 
     });
    };
    $scope.logout = function() {
      angularFireAuth.logout();
    };
}]);