/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom')
      .directive('dcPieYear', dcPieYearDirective);

  /** @ngInject */
  function dcPieYearDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        setData: '='
      },
      controller: 'DcPieYearCtrl',
      templateUrl: 'app/pages/custom/dcPieYear/dcPieYear.tmpl.html'
    };
  }
})();
