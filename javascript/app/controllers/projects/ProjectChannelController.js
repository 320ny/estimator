app.controller("ProjectChannelController", ['$scope', 'angularFire', 'userService', '$http', 'firebase_settings', '$routeParams', 'angularFireCollection', function($scope, angularFire, userService, $http, firebase_settings, $routeParams, angularFireCollection){
  $scope.project_id = parseInt($routeParams.projectId);
  $scope.project = {};
  var firebase_channel = new Firebase(firebase_settings.baseUrl+"projects/"+$scope.project_id);
  angularFire(firebase_channel, $scope, 'project');
  $scope.project.stories = {};
  $scope.project.messages = [];
  $scope.$watch('myUser', function(newValue, oldValue) {
    if(newValue != undefined){
      $scope.loadStories();
    }

  });
  userService.setToScope($scope, 'myUser');

  $scope.loadStories = function(){

    $http({method: 'GET', url:'https://www.pivotaltracker.com/services/v5/projects/'+$scope.project_id+'/stories'}).then(function(res) { 
      angular.forEach(res.data, function(value, key){
        $scope.project.stories[value.id] = value;
      });
    });
  }

  $scope.addMessage = function(e) {
    if (e.keyCode != 13) return;
    $scope.project.messages.push({from: $scope.myUser.email, body: $scope.msg});
    $scope.msg = "";
  }
}]);