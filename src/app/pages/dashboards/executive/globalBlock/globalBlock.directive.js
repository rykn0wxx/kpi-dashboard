/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards.executive')
    .directive('globalBlock', globalBlockDirective);

  /** @ngInject */
  function globalBlockDirective () {
    return {
      restrict: 'E',
      scope: {
        globalData: '='
      },
      controller: 'GlobalBlockCtrl',
      templateUrl: 'app/pages/dashboards/executive/globalBlock/globalBlock.tmpl.html',
      controllerAs: 'vmGlobalBlock'
    };
  }
})();
