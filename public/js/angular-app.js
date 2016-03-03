
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
                url: "/information",
                templateUrl: "/templates/information",
                controller: "InformationCtrl"
            })
            .state('confirmation', {
                url: "/confirmation",
                templateUrl: "/templates/confirmation",
                controller: "ConfirmationCtrl"
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


    .controller('IndexCtrl', function ($scope, $state) {
        console.log("im in indexctrl: "+ $scope);

    })

    .controller('InformationCtrl', function ($scope, $state) {
        console.log("im in informationCtrl: "+$scope)
    })

/*
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
    */
    .controller('ConfirmationCtrl', function ($scope, $state) {

        console.log("im in confirmationCtrl: "+ $scope.firstName);
        console.log("im in confirmationCtrl: "+ $scope.lastName);


    })

