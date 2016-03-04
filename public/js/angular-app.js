
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
            .setPrefix('fourtify');

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
                url: "/confirmation/:from",
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


    .controller('IndexCtrl', function ($scope, $state, $stateParams) {
        $scope.begin = function(){
            $state.go("information", {from:"home"}, {location:false});
        }

    })

    .controller('InformationCtrl', function ($scope, $state, $stateParams) {
        if($stateParams.from != "home" && $stateParams.from != "confirmation"){
            $state.go("home");
        }

        $scope.error = null;
        $scope.checkInformation = function(){
            $scope.error = null;
            if(!$scope.fname){
                $scope.error = "First Name required!";
            }
            else if(!$scope.lname){
                $scope.error = "Last Name required!";
            }
            else if(!$scope.phone){
                $scope.error = "Phone required!";
            }
            else if(!$scope.email){
                $scope.error = "Email required!";
            }


            if(!$scope.error){
                //@todo this is hard coded validation, in reality we would connect to the api and see if appointment exists
                if($scope.fname == "none"){
                    $state.go("confirmation", {from:"information"}, {location:false});
                }
                else
                    $state.go("apptNotFound", {from:"information"}, {location:false});
                }

            }
    })


    .controller('ConfirmationCtrl', function ($scope, $state, $stateParams) {
        if($stateParams.from != "information"){
            $state.go("home");
        }

        $scope.goBack = function(){
            $state.go("information", {from:"confirmation"}, {location:false});
        };

        $scope.confirm = function(){
            $state.go("waiver", {from:"confirmation"}, {location:false});
        };

    })

    .controller('WaiverCtrl', function ($scope, $state, $stateParams) {
        if($stateParams.from != "confirmation"){
            $state.go("home");
        }

        $scope.confirmed = function(){
            $state.go("confirmed", {from:"waiver"}, {location:false});
        }

    })
    .controller('ApptNotFoundCtrl', function ($scope, $state, $stateParams) {
        if($stateParams.from != "information"){
            $state.go("home");
        }
        $scope.someoneElse = function(){
            $state.go("confirmed", {from:"apptNotFound"}, {location:false});
        }

        $scope.receptionist = function(){
            $state.go("confirmed", {from:"apptNotFound"}, {location:false});
        }
    })

