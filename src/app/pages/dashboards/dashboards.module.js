/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards', [
    'BlurAdmin.pages.dashboards.executive'
  ])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('dashboards', {
      url: '/dashboards',
      name: 'dashboards',
      template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
      abstract: true,
      title: 'Dashboard',
      sidebarMeta: {
        icon: 'ion-android-laptop',
        order: 0
      }
    });
  }

})();
