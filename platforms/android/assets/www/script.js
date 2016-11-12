// script.js

    // create the module and name it app
        // also include ngRoute for all our routing needs

(function(){
    var app = angular.module('myApp', ['ngRoute']);

    // configure our routes
    app.config(function($routeProvider) {
        $routeProvider

            // ruta para index
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            // ruta para guia monumentos
            .when('/guide', {
                templateUrl : 'pages/guide.html',
                controller  : 'guideController'
            })
            // ruta para guia leyendas
            .when('/legends', {
                templateUrl : 'pages/legends.html',
                controller  : 'legendController'
            })

            // ruta para guía museos
            .when('/museums', {
                templateUrl : 'pages/museums.html',
                controller  : 'museumController'
            })

            // ruta para guía festivales
            .when('/festivals', {
                templateUrl : 'pages/festivals.html',
                controller  : 'festivalesController'
            })

            // ruta para pagina de monumento
            .when('/monument/:monumentId', {
                templateUrl : 'pages/monument.html',
                controller  : 'monumentController'
            })

            // ruta para pagina de leyenda
            .when('/legends/:legendId', {
                templateUrl : 'pages/leyenda.html',
                controller  : 'leyendaController'
            })

            // ruta para pagina de museo
            .when('/museums/:museumId', {
                templateUrl : 'pages/museo.html',
                controller  : 'museoController'
            })

            // ruta para pagina de festival
            .when('/festivals/:festivalId', {
                templateUrl : 'pages/festival.html',
                controller  : 'festivalController'
            });
    });

    // create the controller and inject Angular's $scope
    //pagina de inicio
    app.controller('mainController', function($scope,$http) {
        var scripturl = 'https://mysguide.herokuapp.com/monumentos/json';

        $http({
          method: 'GET',
          url: scripturl
        }).then(function successCallback(response) {

            var locations=response.data.monumentos;
            console.log(response.data.monumentos);

                  var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                  };

                  function success(pos) {

                    var googlePos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
                    console.log("Google Pos: "+googlePos);
                    var casa = new google.maps.LatLng(locations[5].Latitud, locations[5].Longitud);
                    console.log("Casa: "+casa);
                    // var monument=new google.maps.LatLng(locations[3].Latitud,locations[3].Longitud);
                    // console.log("monument: "+ monument);

                    for (var i=0; i< locations.length; i++){
                      var monument=new google.maps.LatLng(locations[i].Latitud,locations[i].Longitud);
                      if (google.maps.geometry.spherical.computeDistanceBetween(googlePos, monument) <= 300){

                        //Granted Permission for Push notifications
                        cordova.plugins.notification.local.hasPermission(function (granted) {
                            //console.log('Permission has been granted: ' + granted);
                        });

                        cordova.plugins.notification.local.registerPermission(function (granted) {
                            //console.log('Permission has been registered: ' + granted);
                        });

                        //Generate a push notification
                        cordova.plugins.notification.local.schedule({
                          title: "Atención : "+locations[i].Nombre+" cerca !",
                          message: "Pulsa para ver más información"
                        });

                        //Redirecting push to the information
                        var urlId=locations[i]._id;
                        var url="#monument/"+urlId;
                        cordova.plugins.notification.local.on("click", function (notification, state) {
                          window.location = url;
                        }, this);


                    }
                  }//fin for locations
                  //
                  };

                  function error(err) {
                    console.warn('ERROR(' + err.code + '): ' + err.message);
                  };

                  navigator.geolocation.getCurrentPosition(success, error, options);

          }, function errorCallback(response) {

            console.log('ERROR!!!');
          });

    });

    //página de guide
    app.controller('guideController', function($scope,$http) {
      var myurl = 'https://mysguide.herokuapp.com/monumentos/json';
      $scope.monumentos=[];
      $http({
        method: 'GET',
        url: myurl
      }).then(function successCallback(response) {

          $scope.monumentos=response.data.monumentos;
          console.log(response.data.monumentos);

        }, function errorCallback(response) {

          console.log('ERROR!!!');
        });
    });


    //página de monument
    app.controller('monumentController', function($scope,$http,$routeParams) {

        var idMonument = $routeParams.monumentId;
        var urlMonument = 'https://mysguide.herokuapp.com/monumentos/'+idMonument+'/json';
        console.log(urlMonument);
        $scope.infoMonumento = [];
        $http({
          method: 'GET',
          url: urlMonument
        }).then(function successCallback(response) {

            $scope.infoMonumento=response.data;
            console.log(response.data);

          }, function errorCallback(response) {

            console.log('ERROR!!!');
          });
      });


    //página de leyenda
    app.controller('legendController', function($scope,$http) {

      var urlLegend = 'https://mysguide.herokuapp.com/leyendas/json';
      $scope.leyendas=[];
      $http({
        method: 'GET',
        url: urlLegend
      }).then(function successCallback(response) {

          $scope.leyendas=response.data.leyendas;
          console.log(response.data.leyendas);

        }, function errorCallback(response) {

          console.log('ERROR!!!');
        });

    });

    //página de leyenda
    app.controller('leyendaController', function($scope,$http,$routeParams) {

        console.log("en leyendaController");
        var idLeyenda = $routeParams.legendId;
        var urlLeyenda = 'https://mysguide.herokuapp.com/leyendas/'+idLeyenda+'/json';
        console.log(urlLeyenda);
        $scope.infoLeyenda = [];
        $http({
          method: 'GET',
          url: urlLeyenda
        }).then(function successCallback(response) {

            $scope.infoLeyenda=response.data;
            console.log(response.data);

          }, function errorCallback(response) {

            console.log('ERROR!!!');
          });
      });

    //página de  lista museo
    app.controller('museumController', function($scope,$http) {

      var urlMuseum = 'https://mysguide.herokuapp.com/museos/json';
      $scope.museos=[];
      $http({
        method: 'GET',
        url: urlMuseum
      }).then(function successCallback(response) {

          $scope.museos=response.data.museos;
          console.log(response.data.museos);

        }, function errorCallback(response) {

          console.log('ERROR!!!');
        });

    });

    //página de museo
    app.controller('museoController', function($scope,$http,$routeParams) {

        console.log("en museoController");
        var idMuseo = $routeParams.museumId;
        var urlMuseo = 'https://mysguide.herokuapp.com/museos/'+idMuseo+'/json';
        console.log(urlMuseo);
        $scope.infoMuseo = [];
        $http({
          method: 'GET',
          url: urlMuseo
        }).then(function successCallback(response) {

            $scope.infoMuseo=response.data;
            console.log(response.data);

          }, function errorCallback(response) {

            console.log('ERROR!!!');
          });
      });
    //página de guia de festivales
    app.controller('festivalesController', function($scope,$http) {

      var urlFestival = 'https://mysguide.herokuapp.com/festivales/json';
      $scope.festivales=[];
      $http({
        method: 'GET',
        url: urlFestival
      }).then(function successCallback(response) {

          $scope.festivales=response.data.festivales;
          console.log(response.data.festivales);

        }, function errorCallback(response) {

          console.log('ERROR!!!');
        });

    });

    //página de festival
    app.controller('festivalController', function($scope,$http,$routeParams) {

        console.log("en festivalController");
        var idFestival = $routeParams.festivalId;
        var urlFestival = 'https://mysguide.herokuapp.com/festivales/'+idFestival+'/json';
        console.log(urlFestival);
        $scope.infoFestival = [];
        $http({
          method: 'GET',
          url: urlFestival
        }).then(function successCallback(response) {

            $scope.infoFestival=response.data;
            console.log(response.data);

          }, function errorCallback(response) {

            console.log('ERROR!!!');
          });
      });

})();
