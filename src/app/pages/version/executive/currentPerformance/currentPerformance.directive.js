/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive')
      .directive('currentPerformance', currentPerformance);

  /** @ngInject */
  function currentPerformance() {
    return {
      restrict: 'E',
      controller: 'CurrentPerformanceCtrl',
      templateUrl: 'app/pages/version/executive/currentPerformance/currentPerformance.html'
    };
  }
})();
