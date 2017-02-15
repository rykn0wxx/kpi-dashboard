/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldownv2', [
    'BlurAdmin.pages.drilldownv2.perKpi'
  ])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('drilldown2', {
      url: '/drilldown2',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      name: 'drilldown2',
      title: 'Trending',
      sidebarMeta: {
        icon: 'ion-ios-speedometer-outline',
        order: 200
      },
      resolve: {
        dataSource: function (dataService) {
          return dataService;
        }
      }
    });
  }

})();
