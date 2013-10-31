app.controller('AuthController', ['$scope','$location','angularFire','angularFireAuth', 'userService', 'firebase_settings', function($scope, $location, angularFire, angularFireAuth, userService, firebase_settings){
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
        userService.init(firebase_settings.baseUrl+"users/"+user.id)
        userService.setToScope($scope, 'myUser');
        if($scope.myUser == undefined){
          $scope.myUser = user;
        }
        $location.path("#/projects");
    });

    $scope.$on("angularFireAuth:logout", function(evt) {
      $location.path("#");
    });
    $scope.$on("angularFireAuth:error", function(evt, err) {
      console.log(err);
    });

}]);