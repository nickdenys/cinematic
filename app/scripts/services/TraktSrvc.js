(function(){
  'use strict';

  var services = angular.module('cmApp.services');

  services.factory('cmApp.services.TraktSrvc', ['$http','$q', function($http, $q){

    /*------------------------------------*\
        #DATA
    \*------------------------------------*/

    var API = 'https://api-v2launch.trakt.tv';
    var CLIENT_ID = '6aa065a776b54ddc441dbee1f8f50ab27a33521e152fe8f859c02cbc1bcffadc';
    var TRAKT_VERSION = '2';
    var TOKEN = null;
    //if (!data)
      //var data = {};
    var watchlistMovies = [];


    /*------------------------------------*\
        #TRAKT
    \*------------------------------------*/

    return{
      saveToken:function(data){
        TOKEN = data;
      },
      getToken:function(){
        return TOKEN;
      },

      fetchMovieWatchlist:function(){
        var req = {
          method: 'GET',
          url: API + '/sync/watchlist/movies',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if (TOKEN) {
          $http(req).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log(status, "Fetched movies");
              var results = data;

              // Filter imdb ID's
              watchlistMovies = [];
              for (var movie in results){
                if(results.hasOwnProperty(movie)){
                  var obj = results[movie];
                  for (var prop in obj) {
                    if(obj.hasOwnProperty(prop)){
                      if(prop === "movie") {
                        watchlistMovies.push(obj[prop].ids.imdb);
                      }
                    }
                  }
                }
              }
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              console.log(data, status);
            });
        } else {
          console.log('no token found!');
        }
      },
      getMovieWatchlist:function(){
        if(watchlistMovies){
          return watchlistMovies;
        }
        else{
          return "watchlist is empty!";
        }
      },

      addMovieToWatchlist:function(imdb_id){
        var movie = {
          'ids': {
            'imdb': imdb_id
          }
        };
        var movies = [movie];

        var req = {
          method: 'POST',
          url: API + '/sync/watchlist',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          },
          data: { movies: movies }
        };

        sendData(req);

        // Add movie to offline array
        watchlistMovies.push(imdb_id);
      },
      removeMovieFromWatchlist:function(imdb_id){
        var movie = {
          'ids': {
            'imdb': imdb_id
          }
        };
        var movies = [movie];

        var req = {
          method: 'POST',
          url: API + '/sync/watchlist/remove',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          },
          data: { movies: movies }
        };

        sendData(req);

        // Remove movie from offline array
        var index = watchlistMovies.indexOf(imdb_id);
        if (index > -1){
          watchlistMovies.splice(index, 1);
        }
      }
    };



    /*------------------------------------*\
        #HELPERS
    \*------------------------------------*/

    function sendData(req){
      if (TOKEN) {
        $http(req).
          success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(status, "updated");
          }).
          error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(status, "error");
          });
      } else {
        console.log('no token found!');
      }
    }

  }]);
})();