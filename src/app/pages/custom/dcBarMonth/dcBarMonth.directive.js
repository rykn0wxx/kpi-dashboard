/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom')
      .directive('dcBarMonth', dcBarMonthDirective);

  /** @ngInject */
  function dcBarMonthDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        setData: '='
      },
      controller: 'DcBarMonthCtrl',
      templateUrl: 'app/pages/custom/dcBarMonth/dcBarMonth.tmpl.html'
    };
  }
})();
