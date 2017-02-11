/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown.perKpi', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('drilldown.perKpi', {
      url: '/{kpi}',
      name: 'drilldownKpi',
      templateUrl: 'app/pages/drilldown/perKpi/perKpi.html',
      title: 'K P I',
      controller: 'PerKpiCtrl',
      controllerAs: 'vmPerKpi',
      sidebarMeta: {
        order: 150
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
