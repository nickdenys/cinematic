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
    var userListDetailId = null;
    var userMovieRatings = [];
    var userHistory = [];

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
          url: API + '/sync/watchlist',
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
              showNotification(1, "Successfully added item to your watchlist");
            }, function(obj){
              console.log('error', obj);
              showNotification(2, "Something went wrong. Try refreshing the page.");
            });
        } else {
          console.log('No token found');
          return false;
        }
      },
      removeItemFromWatchlist:function(item){

        var req = {
          method: 'POST',
          url: API + '/sync/watchlist/remove',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if (item) {
          var data = null;

          // Movie
          if (item.type == "movie") {
            data = [{
              'ids': {'imdb': item.movie.ids.imdb}
            }];
            req.data = {movies: data};
          }
          // Show
          else if (item.type == "show") {
            data = [{
              'ids': {'imdb': item.show.ids.imdb}
            }];
            req.data = {shows: data};
          }
          // Season
          else if (item.type == "season") {
            data = [{
              'ids': {'imdb': item.show.ids.imdb},
              'seasons': [{'number': item.season.number}]
            }];
            req.data = {shows: data};
          }
          // Episode
          else if (item.type == "episode") {
            data = [{
              'ids': {'imdb': item.show.ids.imdb},
              'seasons': [{'number': item.episode.season, 'episodes': [{'number': item.episode.number}]}]
            }];
            req.data = {shows: data};
          }

          if (TOKEN) {
            return $http(req).
              then(function (obj) {
                showNotification(1, "Successfully removed item from your watchlist");
              }, function (obj) {
                console.log('error', obj);
                showNotification(2, "Something went wrong. Try refreshing the page.");
              });
          } else {
            console.log('No token found');
            return false;
          }
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
              console.log("Fetched list detail for", id);
              userListDetail = response.data;
              userListDetailId = id;
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
      getUserListDetailId:function(){
        return userListDetailId;
      },
      removeItemFromCustomList:function(list, item) {

        var req = {
          method: 'POST',
          url: API + '/users/me/lists/' + list + '/items/remove',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'trakt-api-version': TRAKT_VERSION,
            'trakt-api-key': CLIENT_ID
          }
        };

        if (item) {
          var data = null;

          // Movie
          if(item.type == "movie"){
            data = [{
              'ids': { 'imdb': item.movie.ids.imdb }
            }];
            req.data = {movies: data};
          }
          // Show
          else if(item.type == "show"){
            data = [{
              'ids': { 'imdb': item.show.ids.imdb }
            }];
            req.data = {shows: data};
          }
          // Season
          else if (item.type == "season"){
            data = [{
              'ids': { 'imdb': item.show.ids.imdb },
              'seasons': [{ 'number': item.season.number }]
            }];
            req.data = {shows: data};
          }
          // Episode
          else if(item.type == "episode"){
            data = [{
              'ids': { 'imdb': item.show.ids.imdb },
              'seasons': [{ 'number': item.episode.season, 'episodes':[{ 'number': item.episode.number }] }]
            }];
            req.data = {shows: data};
          }

          if(TOKEN){
            return $http(req).
              then(function(response){
                showNotification(1, "Successfully removed item from list");
                return true;
              }, function(error){
                console.log("Error", error);
                showNotification(2, "Something went wrong");
                return false;
              });
          } else {
            console.log("No token found");
            return false;
          }
        }
      },
      addItemToCustomList:function(id, list){
        var data =
        {
          'movies':
            [{ 'ids': { 'imdb': id } }]
        };

        var req = {
          method: 'POST',
          url: API + '/users/me/lists/' + list + '/items',
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
              console.log('success', response);
            }, function(response){
              console.log('error', response);
            });
        } else {
          console.log('No token found');
          return false;
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
              showNotification(1, "Successfully added rating");
            }, function(obj){
              console.log('error', obj);
              showNotification(2, "Something went wrong. Try refreshing the page.");
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
                showNotification(1, "Successfully removed rating");
                return true;
              }, function(error){
                console.log("Error", error);
                showNotification(2, "Something went wrong. Try refreshing the page.");
              });
          } else {
            console.log("No token found");
            return false;
          }
        }

      },

      checkInMovie:function(id){

        if(id) {
          var data = {
            'ids': { 'imdb': id }
          };

          var req = {
            method: 'POST',
            url: API + '/checkin',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + TOKEN,
              'trakt-api-version': TRAKT_VERSION,
              'trakt-api-key': CLIENT_ID
            },
            data: {movie: data}
          };

          if(TOKEN){
            return $http(req).
              then(function(response){
                showNotification(1, "You are now watching " + response.data.movie.title);
              }, function(error){
                console.log("Error", error);
                if (error.status == 409){
                  showNotification(4, "You are already watching something else!");
                } else {
                  showNotification(2, "Something went wrong. Try refreshing the page.");
                }
              });
          } else {
            console.log("No token found");
            return false;
          }
        }
      },

      fetchHistory:function(){
        var req = {
          method: 'GET',
          url: API + '/sync/history',
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
              console.log("Fetched history");
              userHistory = response.data;
            }, function(error){
              return error;
            });
        } else {
          console.log('No token found');
          return false;
        }
      },
      getHistory:function(){
        return userHistory;
      }

    };

  }]);
})();