/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboardv2.executive', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig ($stateProvider) {
    $stateProvider
      .state('dashboardv2.executive', {
        url: '/executive',
        name: 'executive',
        templateUrl : 'app/pages/dashboardv2/executive/executive.html',
        title: 'Executive',
        controller: 'Dash2ExecutiveCtrl',
        controllerAs: 'vmDash2ExecutiveCtrl',
        sidebarMeta: {
          order: 251
        },
        resolve: {
          collection: function(dataService) {
            return dataService;
          }
        }
      });
  }

})();
