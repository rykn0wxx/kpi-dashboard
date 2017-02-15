/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboardv2.executive')
    .directive('globalBlock', globalBlockDirective);

  /** @ngInject */
  function globalBlockDirective () {
    return {
      restrict: 'E',
      scope: {
        globalData: '=',
        monthFilter: '='
      },
      controller: 'GlobalBlockCtrl',
      templateUrl: 'app/pages/dashboardv2/executive/globalBlock/globalBlock.tmpl.html',
      controllerAs: 'vmGlobalBlock'
    };
  }
})();
