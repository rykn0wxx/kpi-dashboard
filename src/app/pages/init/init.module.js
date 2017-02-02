/**
 * @author rykn0wxx
 * created on 01 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.init', [
    'ngCookies'
  ])
    .config(routeConfig)
    .run(runConfig)
    .controller('InitPageCtrl', InitPageCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('init', {
        url: '/init',
        templateUrl: 'app/pages/init/init.html',
        controller: 'InitPageCtrl',
        title: 'Configuration'
      });
  }

  function runConfig ($rootScope, $location, $cookies, $http, $state) {
    $rootScope.globals = $cookies.get('globals') || {};
    $rootScope.globals.isLogedIn = false;

    if (!$rootScope.globals.currentUser) {
      //$location.path('/init');
    }


    $rootScope.$on('$locationChangeStart', function (event, next, current) {
			if ($location.path() !== '/init' && !$rootScope.globals.currentUser) {
				///$location.path('/init');
			}
		});

    $rootScope.$on('$stateChangeStart', function (ev, toState, toParams, fromState, fromParams) {
			if (toState.url !== '/init' && !$rootScope.globals.currentUser) {
				//$state.go('/init');
			}
		});

    $rootScope.globals = {
      isLoggedIn : true,
      currentUser: true
    };


  }

  function InitPageCtrl ($scope, $rootScope, $cookieStore, $http, $state, $q, $timeout, $location) {
    $scope.apistatus = 'offline';
    $scope.apipath = 'localhost:3000';
    $scope.curUser = null;
    $scope.conCon = function () {
      checkConn().then(function (res) {
        $scope.apistatus = res.status === 200 ? 'online':'offline';
        angular.element('.box-mail').addClass('issent');
        $timeout(function () {
          if (res.status === 200) {
            $rootScope.globals = {
              isLoggedIn : true,
              currentUser: true
            };
            $scope.curUser = $rootScope.globals.currentUser;
            $location.path('/dashboard');
          } else {
            angular.element('.box-mail').removeClass('issent');
          }
        }, 1800);
      });
    };

    function checkConn () {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: 'http://' + $scope.apipath + '/regions',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }).then(function (resp) {
        defer.resolve(resp);
      });
      return defer.promise;
    }
  }
})();
