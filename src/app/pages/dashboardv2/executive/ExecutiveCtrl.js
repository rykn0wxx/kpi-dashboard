/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboardv2.executive')
  .controller('Dash2ExecutiveCtrl', Dash2ExecutivePageCtrl);

  /** @ngInject */
  function Dash2ExecutivePageCtrl ($scope, $window, collection, $rootScope) {
    var _ = $window._;
    var o = this;
    o.$scope = $scope;
    $scope.collection = collection;

    var dmMonths = collection.dc.getDimension('dimMonth').group().reduceCount().all();
    $scope.curMonth = (_.isUndefined($rootScope.globals.filterMonth)) ? _.max(_.map(dmMonths, 'key')) : $rootScope.globals.filterMonth;

    $scope.datePicker = {
      date : {
        startDate: null,
        endDate: null,
        mode: 'month'
      }
    };
    $scope.toOpen = toOpen;
    $scope.opened = false;
    $scope.format = 'yyyy MMM';
    $scope.options = {
      maxMode: 'month',
      minMode: 'month',
      mode: 'month',
    };
    function toOpen () {
      $scope.opened = true;
    }
  }

})();
