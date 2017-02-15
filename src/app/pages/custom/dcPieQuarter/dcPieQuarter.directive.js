/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom')
      .directive('dcPieQuarter', dcPieQuarterDirective);

  /** @ngInject */
  function dcPieQuarterDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        setData: '='
      },
      controller: 'DcPieQuarterCtrl',
      templateUrl: 'app/pages/custom/dcPieQuarter/dcPieQuarter.tmpl.html'
    };
  }
})();
