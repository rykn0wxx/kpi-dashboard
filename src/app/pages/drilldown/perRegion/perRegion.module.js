/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown.perRegion', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('drilldown.perRegion', {
      url: '/{region}',
      name: 'drilldownRegion',
      templateUrl: 'app/pages/drilldown/perRegion/perRegion.html',
      title: 'Regional',
      controller: 'PerRegionCtrl',
      controllerAs: 'vmPerRegion',
      sidebarMeta: {
        order: 200
      }
    });
  }

})();
