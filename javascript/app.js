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

// filters

app.filter('toArray', function() {
    return function(input) {
        return _.toArray(input);
    }
}).filter('split', function() {
    return function(input,delim) {
        return input.split(delim);
    };
});

/// directives

app.directive('preventDefault',[
    function() {
        return function($scope,$el,$attrs) {
            var evt = $attrs.preventDefault || 'click';
            $el.bind(evt,function(e) {
                e.preventDefault();
            });
        }
    }
]);

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

// app.directive('storyListing', ['$http', function($http){

//   return {
//     restrict: 'E',
//     replace: true,
//     templateUrl: 'views/stories/_listing.html',
//     controller: 'StoryController',
//     scope: {
//       story: '=story'
//     }
//   }
// }]);
