(function(){
  'use strict';
  var directives = angular.module('cmApp.directives');

  directives.directive('starRating', function(){
      return {
        restrict: 'A',
        template: ''
          + '<ul class="rating" ng-mouseleave="hoverOut()">'
            + '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)" ng-mouseover="hoverIn($index)">'
              + '<i class="fa fa-heart fa-lg"></i>'
            + '</li>'
          + '</ul>',
        scope: {
          previewRatingValue: '=',
          ratingValue : '=',
          max : '=',
          onRatingSelected : '&',
          onRatingHovered: '&'
        },
        link: function (scope, elem, attrs) {

          var updateStars = function(){
            scope.stars = [];
            for ( var i = 0; i < scope.max; i++) {
              scope.stars.push({
                filled : i < scope.ratingValue
              });
            }
          };

          var updateStarsPreview = function(){
            if (scope.previewRatingValue > -1){
              scope.stars = [];
              for ( var i = 0; i < scope.max; i++) {
                scope.stars.push({
                  filled : i < scope.previewRatingValue
                });
              }
            }
          };

          scope.toggle = function(index) {
            scope.ratingValue = index + 1;
            scope.onRatingSelected({
              rating : index + 1
            });
          };

          scope.hoverIn = function(index) {
            scope.previewRatingValue = index + 1;
            if (scope.ratingValue != scope.previewRatingValue) {
              scope.onRatingHovered({
                rating: index + 1
              });
            } else {
              scope.onRatingHovered({
                rating: "Unrate"
              });
            }
          };

          scope.hoverOut = function() {
            updateStars();
            scope.onRatingHovered({
              rating: 0
            });
          };

          scope.$watch('ratingValue',
            function(oldVal, newVal) {
              if (newVal) {
                updateStars();
              }
            }
          );

          scope.$watch('previewRatingValue',
            function(oldVal, newVal) {
              if (oldVal) {
                updateStarsPreview();
              }
            }
          );

        }
      };
    }
  );
})();