
app.controller('ProjectIndexController', ['$scope', '$location', 'angularFire', 'userService', 'projectService', '$http', 'firebase_settings', function($scope, $location, angularFire, userService, projectService, $http, firebase_settings){

  $scope.projects={};
  projectService.init(firebase_settings.baseUrl+'projects/')
  projectService.setToScope($scope, 'projects');

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
        $scope.myUser.projects[value.id] = {name: value.name, id: value.id};
        $scope.projects[value.id] = {name: value.name, id: value.id};
      });
    });
  };
}]);
