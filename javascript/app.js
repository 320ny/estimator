var app = angular.module("estimator", ["firebase"]);

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
registerFirebaseService('projectService'); // create projectService instance


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
