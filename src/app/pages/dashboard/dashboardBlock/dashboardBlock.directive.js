/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .directive('dashboardBlock', dashboardBlock);

  /** @ngInject */
  function dashboardBlock () {
    return {
      restrict: 'E',
      controller: 'DashboardBlockCtrl',
      templateUrl: 'app/pages/dashboard/dashboardBlock/dashboardBlock.html',
      controllerAs: 'vmdashboardCtrl'
    };
  }
})();
