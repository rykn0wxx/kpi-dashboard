/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboardv2', [
    'BlurAdmin.pages.dashboardv2.executive'
  ])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig ($stateProvider) {
    $stateProvider
      .state('dashboardv2', {
        url: '/dashboardv2',
        name: 'dashboardv2',
        template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
        abstract: true,
        title: 'Dashboard',
        sidebarMeta: {
          icon: 'ion-earth',
          order: 150
        }
      });
  }

})();
