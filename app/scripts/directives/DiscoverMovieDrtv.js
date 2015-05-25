(function(){
  'use strict';
  var directives = angular.module('cmApp.directives');

  directives.directive('DiscoverMovieDrtv',
    function($window){
      return {
        restrict: 'E',
        transclude: true,
        template: '<article></article>',
        scope:{
          movieQuestion: '=movieQuestion'
        },
        replace: true,
        link: function mapLink (scope, element, attrs) {

          element.addClass('discover-movie-question');

          scope.$watch('movieQuestion', function(newVal, oldVal) {
            var val = oldVal;

            if(newVal){
              val = newVal;
            }

            if(val){
              var html = '';

              html += ''
                + '<h1>'
                + val.title
                + '</h1>';

              console.log(html);

              element[0].innerHTML = html;
            }
          });
        }
      };
    }
  );
})();