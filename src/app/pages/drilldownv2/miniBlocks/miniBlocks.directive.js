/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldownv2')
    .directive('miniBlocks', miniBlocksDirective);

  /** @ngInject */
  function miniBlocksDirective () {
    return {
      restrict: 'E',
      scope: {
        selKpi: '=',
        monthFilter: '=',
        upctrl: '='
      },
      controller: 'MiniBlocksCtrl as vmMiniBlocks',
      templateUrl: 'app/pages/drilldownv2/miniBlocks/miniBlocks.tmpl.html'
    };
  }

})();
