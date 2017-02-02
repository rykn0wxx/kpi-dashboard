/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive')
      .directive('dimensionalView', dimensionalView);

  /** @ngInject */
  function dimensionalView() {
    return {
      restrict: 'E',
      controller: 'DimensionalViewCtrl',
      templateUrl: 'app/pages/version/executive/dimensionalView/dimensionalView.html'
    };
  } 
})();
