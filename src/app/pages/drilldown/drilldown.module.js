/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown', [
    'BlurAdmin.pages.drilldown.perKpi',
    'BlurAdmin.pages.drilldown.perRegion'
  ])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('drilldown', {
      url: '/drilldown',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      name: 'drilldown',
      title: 'Drilldown',
      sidebarMeta: {
        icon: 'ion-cube',
        order: 100
      }
    });
  }

})();
