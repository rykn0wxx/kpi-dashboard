/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards.executive')
    .directive('globalBlock2', globalBlockDirective);

  /** @ngInject */
  function globalBlockDirective () {
    return {
      restrict: 'E',
      scope: {
        globalData: '='
      },
      controller: 'GlobalBlock2Ctrl',
      templateUrl: 'app/pages/dashboards/executive/globalBlock/globalBlock.tmpl.html',
      controllerAs: 'vmGlobalBlock2'
    };
  }
})();
