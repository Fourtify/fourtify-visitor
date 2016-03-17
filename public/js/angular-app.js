
angular.module('fourtifyApp', ["oc.lazyLoad", 'ui.router', 'ngAnimate', 'LocalStorageModule'])

    .run(
    [          '$rootScope', '$state', '$stateParams',
        function ($rootScope,   $state,   $stateParams) {

            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your applications.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])

    .config(function($locationProvider, $stateProvider, localStorageServiceProvider){
        $locationProvider.html5Mode(true);

        localStorageServiceProvider
            .setPrefix('fourtify').setStorageType('localStorage');

        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "/templates/index",
                controller: "IndexCtrl"
            })
            .state('information', {
                url: "/information/:from",
                templateUrl: "/templates/information",
                controller: "InformationCtrl"
            })
            .state('confirmation', {
                url: "/confirmation/:from/:",
                templateUrl: "/templates/confirmation",
                controller: "ConfirmationCtrl"
            })
            .state('waiver', {
                url: "/waiver/:from",
                templateUrl: "/templates/waiver",
                controller: "WaiverCtrl"
            })
            .state('confirmed', {
                url: "/confirmed/:from",
                templateUrl: "/templates/confirmed"
            })
            .state('apptNotFound', {
                url: "/apptNotFound/:from",
                templateUrl: "/templates/apptNotFound",
                controller: "ApptNotFoundCtrl"
            })

            /*.state('example', {
                abstract: true,
                url: "/example",
                templateUrl: "/templates/example",
                controller: ExampleCtrl"
            })*/

    })


    .controller('MainCtrl', function ($scope, $state, $rootScope) {


    })


    .controller('IndexCtrl', function ($scope, $state, $stateParams, SettingsService) {
        $scope.begin = function(){
            $state.go("information", {from:"home"}, {location:false});
        }

        $scope.settings = {};

        SettingsService.getSettings(
            {},
            //success function
            function(data) {
                $scope.clearMessages();
                if(data._logo){
                    $scope.settings.logo = data._logo;
                }
            },
            //error function
            function(data, status) {
                $scope.clearMessages();
                $scope.err = data;
            }
        );

        $scope.clearMessages = function() {
            $scope.err = null;
            $scope.pending = null;
            $scope.success = null;
        }


    })

    .controller('InformationCtrl', function ($scope, $state, $stateParams, FourtifyService, localStorageService, $rootScope) {
        if($stateParams.from != "home" && $stateParams.from != "confirmation"){
            $state.go("home");
        }

        $scope.error = null;
        $scope.checkInformation = function() {

            console.log("in checkInfo")
            $scope.error = null;
            if (!$scope.fname) {
                $scope.error = "First Name required!";
            }
            else if (!$scope.lname) {
                $scope.error = "Last Name required!";
            }
            else if (!$scope.phone) {
                $scope.error = "Phone number format is incorrect.";
            }
            else if (!$scope.email) {
                $scope.error = "Email format is incorrect.";
            }

            console.log("after checkInfo")
            if (!$scope.error) {
                FourtifyService.getVisitor({
                    /*name: {
                        first: $scope.fname,
                        last: $scope.lname
                    },*/
                    email: $scope.email
                }, function (data) {
                    if(data.length > 0){
                        FourtifyService.getAppointment({
                            visitor: data[0]._id
                        }, function (data2) {
                            if(data.length > 0){
                                $rootScope.visitor = data[0];
                                $rootScope.appt = data2[0];
                                if($rootScope.appt._start){
                                    $rootScope.appt._start = moment($rootScope.appt._start).format("dddd, h:mm a");
                                }
                                if($rootScope.appt._end){
                                    $rootScope.appt._end = moment($rootScope.appt._end).format("dddd, h:mm a");
                                }
                                $state.go("confirmation", {from:"information"}, {location:false});
                            }
                            else{
                                $state.go("apptNotFound", {from:"information"}, {location:false});
                            }
                        }, function (data, status) {
                            $state.go("apptNotFound", {from:"information"}, {location:false});
                        });
                    }
                    else{
                        $state.go("apptNotFound", {from:"information"}, {location:false});
                    }
                }, function (data, status) {
                    $state.go("apptNotFound", {from:"information"}, {location:false});
                });

                //@todo this is hard coded validation, in reality we would connect to the api and see if appointment exists
                /*if($scope.fname == "none"){
                 //$state.go("confirmation", {from:"information"}, {location:false});
                 }
                 else
                 //$state.go("apptNotFound", {from:"information"}, {location:false});
                 }*/

            }
        }
    })


    .controller('ConfirmationCtrl', function ($scope, $state, $stateParams, localStorageService, $rootScope) {
        if($stateParams.from != "information"){
            $state.go("home");
        }

        $scope.appt = $rootScope.appt;
        $scope.visitor = $rootScope.visitor;

        $scope.goBack = function(){
            $state.go("information", {from:"confirmation"}, {location:false});
        };

        $scope.confirm = function(){
            $state.go("waiver", {from:"confirmation"}, {location:false});
        };

    })

    .controller('WaiverCtrl', function ($scope, $state, $stateParams, $rootScope, FourtifyService) {
        if($stateParams.from != "confirmation"){
            $state.go("home");
        }

        $scope.confirmed = function(){
            FourtifyService.addToQueue({
                visitor: $rootScope.visitor._id,
                appointment: $rootScope.appt._id,
                position: 1
            }, function(data){
                // Success
            }, function(data, status){
                // Error
            });

            $state.go("confirmed", {from:"waiver"}, {location:false});

        }

    })
    .controller('ApptNotFoundCtrl', function ($scope, $state, $stateParams) {
        if($stateParams.from != "information"){
            $state.go("home");
        }
        $scope.someoneElse = function(){
            $state.go("information", {from:"apptNotFound"}, {location:false});
        }

        $scope.receptionist = function(){
            $state.go("confirmed", {from:"apptNotFound"}, {location:false});
        }
    })

    .service('SettingsService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                updateSettings: function( updateObj, success, error) {
                    var req = {
                        method: 'PUT',
                        url: '/settings',
                        data: updateObj
                    };
                    this.apiCall(req, success, error);
                },
                getSettings: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/settings',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                apiCall: function(req, success, error) {
                    req.headers = {url: req.url};
                    req.url = "/api";
                    $http(req).success(function(data) {
                        success(data);
                    }).error(function(data, status) {
                        error(data, status);
                    });
                }
            };
        }
    ])

    .service('FourtifyService', [
        '$http',
        function ($http, $rootScope, $window) {
            return {
                getVisitor: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/visitors',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                getAppointment: function(params, success, error) {
                    var req = {
                        method: 'GET',
                        url: '/appointments',
                        params: params
                    };
                    this.apiCall(req, success, error);
                },
                addToQueue: function(params, success, error) {
                    var req = {
                        method: 'POST',
                        url: '/queue',
                        data: params
                    };
                    this.apiCall(req, success, error);
                },
                apiCall: function(req, success, error) {
                    req.headers = {url: req.url};
                    req.url = "/api";
                    $http(req).success(function(data) {
                        success(data);
                    }).error(function(data, status) {
                        error(data, status);
                    });
                }
            };
        }
    ]);


