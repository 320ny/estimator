
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
        redirectTo: "/"
      });
  }]);
