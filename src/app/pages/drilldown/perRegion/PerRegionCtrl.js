/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown.perRegion')
  .controller('PerRegionCtrl', PerRegionPageCtrl);

  function PerRegionPageCtrl ($scope, $stateParams) {
    var o = this;
    o.$scope = $scope;
    console.log($stateParams);
  }

  PerRegionPageCtrl.$inject = ['$scope', '$stateParams'];

})();
