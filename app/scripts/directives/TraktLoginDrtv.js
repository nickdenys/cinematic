(function(){
  'use strict';
  var directives = angular.module('cmApp.directives');

  directives.directive('traktAuth', ['cmApp.services.TraktSrvc', '$window', function(TraktSrvc, $window){
      return {
        restrict: 'E',
        templateUrl: 'scripts/directives/views/UserOptions.html',
        replace: true,
        link: function (scope) {

          scope.isUserLoggedIn = false;

          // Fired when the view is initializing and user has a non-expired auth token in the local session storage.
          scope.$on('oauth:authorized', function(event, token) {
            if (!scope.isUserLoggedIn){
              console.log('The user is authorized', token.access_token);
              TraktSrvc.saveToken(token.access_token);
              scope.isUserLoggedIn = true;
            }
          });

          // Fired when the user has completed the login flow, and authorized the third party app.
          scope.$on('oauth:login', function(event, token) {
            console.log('Authorized third party app with token', token.access_token);
            TraktSrvc.saveToken(token.access_token);
            scope.isUserLoggedIn = true;
          });

          scope.$on('oauth:logout', function(event) {
            TraktSrvc.saveToken(null);
            scope.isUserLoggedIn = false;

            // TODO: Wait for redirect bugfix from oauth-ng
            // https://github.com/andreareginato/oauth-ng/issues/86
            setTimeout(function(){
              $window.location.href = "/";
            }, 110);
          });

          scope.$on('oauth:denied', function(event) {
            console.log('The user did not authorize the third party app');
          });

          scope.$on('oauth:expired', function(event) {
            console.log('The access token is expired. Please refresh.');
          });

          scope.$on('oauth:profile', function(event, profile) {
            console.log('User profile data retrieved: ', profile);
          });


        }
      };
    }]
  );
})();