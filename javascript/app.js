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
      otherwise({
        redirectTo: ''
      });
  }]);

app.controller('AuthController', ['$scope','$location','angularFireAuth',function($scope, $location,angularFireAuth){
    var url = "https://320ny.firebaseio.com/";
    var firebase = new Firebase(url);
    $scope.login_form= {};
    angularFireAuth.initialize(firebase, {
      scope: $scope, name: "user",
      callback: function(err, user) {
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

    $scope.$on("angularFireAuth:login", function(evt, user) {
      $location.path("/projects");
    });
    $scope.$on("angularFireAuth:logout", function(evt) {
      $location.path("#");
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
      console.log(err);
    });

}]);

app.controller('ProjectShowController', ['$scope', 'angularFire', function($scope){
  var url = "https://320ny.firebaseio.com/"
  var firebase = new Firebase(url);
}]);