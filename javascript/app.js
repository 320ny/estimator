var app = angular.module("estimator", ["firebase"]);


app.config(['$locationProvider', '$routeProvider',
  function($locationProvider, $routeProvider) {

    $routeProvider.
      when('/projects', {
        templateUrl: 'views/projects/index.html',
        controller: 'ProjectIndexController',
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
app.constant('firebase_settings', {
    baseUrl: 'https://320ny.firebaseio.com/'
});

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


app.controller('AuthController', ['$scope','$location','angularFire','angularFireAuth', 'userService', 'firebase_settings', function($scope, $location, angularFire, angularFireAuth, userService, firebase_settings){
    var base_url = "https://320ny.firebaseio.com/";
    var firebase = new Firebase(firebase_settings.baseUrl);

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
        if($scope.myUser == {}){
          $scope.myUser = user;
        }
        $location.path("/projects");
    });

    $scope.$on("angularFireAuth:logout", function(evt) {
      $location.path("#");
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
      console.log(err);
    });

}]);

app.controller('ProjectIndexController', ['$scope', 'angularFire', 'userService', '$http', 'firebase_settings', function($scope, angularFire, userService, $http, firebase_settings){

  $scope.updateToken = function(user){
    $scope.myUser.pivotal_token = user.pivotal_token;
  };

  $scope.linkUser = function(){
    userService.setToScope($scope, 'myUser')
    $scope.form_user = {};
  }

  $scope.loadPivotalProjects = function(){

    $http.defaults.headers.common['X-TrackerToken'] = $scope.myUser.pivotal_token;
    $http({method: 'GET', url:'https://www.pivotaltracker.com/services/v5/projects'}).then(function(res) { 
      $scope.myUser.projects = {};
      angular.forEach(res.data, function(value, key){
        $scope.myUser.projects[value.id] = value;
      });
    });
  };
}]);


/// directives

app.directive('projectListing', ['$http', function($http) {

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/projects/_listing.html',
    scope: {
      project : '=project'
    }
  }

}]);

app.directive('storyListing', ['$http', function($http){

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/stories/_listing.html',
    scope: {
      story: '=story'
    }
  }
}]);



// channel controller

app.controller("ProjectChannelController", ['$scope', 'angularFire', 'userService', '$http', 'firebase_settings', '$routeParams', function($scope, angularFire, userService, $http, firebase_settings, $routeParams){
  $scope.project_id = parseInt($routeParams.projectId);
  $scope.search = {};
  $scope.$watch('myUser', function(newValue, oldValue) {
    if(newValue != undefined){
      $scope.loadStories();
    }

  });
  userService.setToScope($scope, 'myUser');

  $scope.loadStories = function(){
    $http({method: 'GET', url:'https://www.pivotaltracker.com/services/v5/projects/'+$scope.project_id+'/stories'}).then(function(res) { 
      $scope.myUser.projects[$scope.project_id].stories = {};
      angular.forEach(res.data, function(value, key){
        $scope.myUser.projects[$scope.project_id].stories[value.id] = value;
      });
      $scope.stories = $scope.myUser.projects[$scope.project_id].stories;
    });
  }
}]);