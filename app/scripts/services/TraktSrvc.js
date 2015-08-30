(function(){
  'use strict';

  var services = angular.module('cmApp.services');

  services.factory('cmApp.services.TraktSrvc', ['$http', function($http){

    /*------------------------------------*\
        #DATA
    \*------------------------------------*/

    var API = 'https://api-v2launch.trakt.tv';
    var CLIENT_ID = '6aa065a776b54ddc441dbee1f8f50ab27a33521e152fe8f859c02cbc1bcffadc';
    var TRAKT_VERSION = '2';
    var TOKEN = null;

    var watchlistMoviesById = [];
    var watchlistMovies = {};
    var userLists = [];
    var userListDetail = [];
    var userMovieRatings = [];

    /*------------------------------------*\
        #FUNCTIONS
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

        if(TOKEN){

          return $http(req).
            then(function(response){
              watchlistMovies = response.data;
              // Filter imdb ID's in seperate array
              watchlistMoviesById = [];
              for (var movie in watchlistMovies){
                if(watchlistMovies.hasOwnProperty(movie)){
                  var obj = watchlistMovies[movie];
                  for (var prop in obj) {
                    if(obj.hasOwnProperty(prop)){
                      if(prop === "movie") {
                        watchlistMoviesById.push(obj[prop].ids.imdb);
                      }
                    }
                  }
                }
              }
            }, function(error){
              return error;
            });

        } else {
          console.log('No token found');
          return false;
        }
      },
      getMovieWatchlistById:function(){
        if(watchlistMoviesById){
          return watchlistMoviesById;
        }
      },
      getMovieWatchlist:function(){
        return watchlistMovies;
      },
      addMovieToWatchlist:function(imdb_id){

        var movies =
          [{
            'ids': { 'imdb': imdb_id }
          }];

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

        if(TOKEN){
          return $http(req).
            then(function(obj){
              console.log('success', obj);
            }, function(obj){
              console.log('error', obj);
            });
        } else {
          console.log('No token found');
          return false;
        }
      },
      removeMovieFromWatchlist:function(imdb_id){

        var movies =
          [{
            'ids': { 'imdb': imdb_id }
          }];

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

        if(TOKEN){
          return $http(req).
            then(function(obj){
              console.log('success', obj);
            }, function(obj){
              console.log('error', obj);
            });
        } else {
          console.log('No token found');
          return false;
        }
      },

      fetchUserLists:function(){

        var req = {
          method: 'GET',
          url: API + '/users/me/lists',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if(TOKEN){
          return $http(req).
            then(function(response){
              console.log("Fetched lists");
              userLists = response.data;
            }, function(error){
              return error;
            });
        } else {
          console.log('No token found');
          return false;
        }
      },
      getUserLists:function(){
        return userLists;
      },
      fetchUserListDetail:function(id){

        var req = {
          method: 'GET',
          url: API + '/users/me/lists/' + id + '/items',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if(TOKEN){
          return $http(req).
            then(function(response){
              console.log("Fetched list detail");
              userListDetail = response.data;
            }, function(error){
              return error;
            });
        } else {
          console.log('No token found');
          return false;
        }

      },
      getUserListDetail:function(){
        return userListDetail;
      },
      removeMovieFromCustomList:function(list, item) {

        if (item.movie) {
          var movies = [{
            'ids': { 'imdb': item.movie.ids.imdb }
          }];

          var req = {
            method: 'POST',
            url: API + '/users/me/lists/' + list + '/items/remove',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + TOKEN,
              'trakt-api-version': TRAKT_VERSION,
              'trakt-api-key': CLIENT_ID
            },
            data: {movies: movies}
          };

          if(TOKEN){
            return $http(req).
              then(function(response){
                console.log("Removed item from list");
                return true;
              }, function(error){
                console.log("Error", error);
                return false;
              });
          } else {
            console.log("No token found");
            return false;
          }
        }
      },

      addRatingToMovie:function(id, rating){

        var data =
          {
            'movies':
              [
                {
                  'ids': { 'imdb': id },
                  'rating': rating
                }
              ]
          };

        var req = {
          method: 'POST',
          url: API + '/sync/ratings',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          },
          data: data
        };

        if(TOKEN){
          return $http(req).
            then(function(obj){
              console.log('success', obj);
            }, function(obj){
              console.log('error', obj);
            });
        } else {
          console.log('No token found');
          return false;
        }


      },
      fetchMovieRatings:function(){
        var req = {
          method: 'GET',
          url: API + '/sync/ratings/movies',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if(TOKEN){
          return $http(req).
            then(function(response){
              userMovieRatings = response.data;
            }, function(error){
              return error;
            });
        } else {
          console.log('No token found');
          return false;
        }
      },
      getMovieRatings:function(){
        return userMovieRatings;
      },
      removeMovieRating:function(id){

        if (id) {
          var data =
          {
            'movies':[{
              'ids': { 'imdb': id }
            }]
          };

          var req = {
            method: 'POST',
            url: API + '/sync/ratings/remove',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + TOKEN,
              'trakt-api-version': TRAKT_VERSION,
              'trakt-api-key': CLIENT_ID
            },
            data: data
          };

          if(TOKEN){
            return $http(req).
              then(function(response){
                console.log("Removed rating from " + id);
                return true;
              }, function(error){
                console.log("Error", error);
                return false;
              });
          } else {
            console.log("No token found");
            return false;
          }
        }

      }

    };

  }]);
})();