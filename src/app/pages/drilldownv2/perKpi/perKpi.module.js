/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldownv2.perKpi', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('drilldown2.perKpi', {
      url: '/{kpi}',
      name: 'drilldownv2Kpi',
      templateUrl: 'app/pages/drilldownv2/perKpi/perKpi.html',
      title: 'Executive',
      controller: 'DrillV2KpiCtrl',
      controllerAs: 'vmDrillv2Kpi',
      sidebarMeta: {
        order: 301
      }
    });
  }

})();
