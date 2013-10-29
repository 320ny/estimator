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

app.controller('AuthController', ['$scope','$location','angularFire','angularFireAuth',function($scope, $location, angularFire, angularFireAuth){
    var base_url = "https://320ny.firebaseio.com/";
    var firebase = new Firebase(base_url);
    $scope.myUser;
    $scope.login_form= {};

    angularFireAuth.initialize(firebase, {
      scope: $scope, 
      name: "user",
      path: "#",
    });

    //authentication actions

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


    // authentication events

    $scope.$on("angularFireAuth:login", function(evt, user) {
        var user_url = base_url+"users/"+user.id;
        var user_firebase = new Firebase(user_url);
        angularFire(user_firebase, $scope, "myUser");
        $scope.myUser = user;

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