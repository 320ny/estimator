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

var registerFirebaseService = function (serviceName) {
    app.factory(serviceName, function (angularFire) {
        var _url = null;
        var _ref = null;

        return {
            init: function (url) {
                _url = url;
                _ref = new Firebase(_url);
            },
            setToScope: function (scope, localScopeVarName) {
                angularFire(_ref, scope, localScopeVarName);
            }
        };
    });
};

registerFirebaseService('userService'); // create userService instance


app.controller('AuthController', ['$scope','$location','angularFire','angularFireAuth', 'userService', function($scope, $location, angularFire, angularFireAuth, userService){
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
        userService.init(base_url+"users/"+user.id)
        userService.setToScope($scope, 'myUser');
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

app.controller('ProjectShowController', ['$scope', 'angularFire', 'userService', '$http', function($scope, angularFire, userService, $http){
  var url = "https://320ny.firebaseio.com/"
  var firebase = new Firebase(url);
  userService.setToScope($scope, 'myUser')
  $scope.form_user = {};

  $scope.updateToken = function(user){
    $scope.myUser.pivotal_token = user.pivotal_token;
  };

  $scope.loadPivotalUser = function(){
    $http({ method: 'GET', url: 'http://www.pivotaltracker.com/services/v3/projects', headers: { 'X-TrackerToken': $scope.myUser.pivotal_token }}).then(function(res) { console.log(res.data) });
  };
}]);