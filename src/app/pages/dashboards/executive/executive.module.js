/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards.executive', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('dashboards.executive', {
      url: '/dashboards/executive',
      name: 'dashboardExecutive',
      templateUrl: 'app/pages/dashboards/executive/executive.html',
      title: 'Executive',
      controller: 'ExecutiveCtrl',
      controllerAs: 'vmExecutive',
      sidebarMeta: {
        order: 100
      },
      resolve: {
        collection: function ($rootScope, $q, DataProvider) {
          if ($rootScope.globals.data === undefined) {
            var pClient = DataProvider.retrieveData('clients');
            var pRegion = DataProvider.retrieveData('regions');
            var pData = DataProvider.retrieveData('rawexecs', true);
            var mycollection = $q.all({
              zClient:pClient,
              zRegion:pRegion,
              zData:pData
            }).then(function (data) {
              return data;
            });

            return mycollection;
          } else {
            return $rootScope.globals.data;
          }
        }
      }
    });
  }

})();
