/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown')
    .directive('miniBlock', miniBlockDirective);

  /** @ngInject */
  function miniBlockDirective () {
    return {
      restrict: 'E',
      scope: {
        globalData: '='
      },
      controller: 'MiniBlockCtrl',
      templateUrl: 'app/pages/drilldown/perKpi/miniBlock/miniBlock.tmpl.html'
    };
  }

})();
