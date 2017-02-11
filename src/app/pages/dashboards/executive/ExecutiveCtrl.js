/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards.executive')
  .controller('ExecutiveCtrl', ExecutivePageCtrl);

  /** @ngInject */
  function ExecutivePageCtrl ($scope, $window, collection, $timeout, metrics, calcUtil, $rootScope) {

    var o = this;
    o.$scope = $scope;
    var ndx = $window.crossfilter;
    var _ = $window._;
    var d3 = $window.d3;
    var acc = $window.accounting;

    var tmpId = null;
    var latestMonth = 0;
    var df = d3.time.format('%m/%d/%Y');
    _.map(collection.zData, function (val, ind) {
      tmpId = _.filter(collection.zClient, ['id', val.clientId])[0].regionId;
      val.clientName = _.filter(collection.zClient, ['id', val.clientId])[0].code;
      val.regionName = _.filter(collection.zRegion, ['id', tmpId])[0].name;
      val.global = 'global';
      val.zDate = df.parse(val.repmonth);
      latestMonth = _.max([latestMonth, val.zDate]);
    });

    $scope.zData = collection.zData;
    $scope.curMonth = latestMonth;

    if ($rootScope.globals.data === undefined) {
      $rootScope.globals.data = collection.zData;
    }

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

    $scope.$watch('opened', function(nVal, oVal, sc) {
      if (!nVal && !sc.curMonth && nVal !== oVal) {
        var prevVal = new Date(sc.curMonth);
        $rootScope.curMonth = new Date(sc.curMonth);
        renderXfilter();
      }
    }, true);

    function toOpen () {
      $scope.opened = true;
    }

    function groupRegionPerMetric (uObj, uVal) {
      var result = {};
      var tmpVal = 0;
      _.forEach(uObj, function(val, i) {
        if (uVal.format === 'formatMoney') {
          result[val.key] = acc.formatMoney(val.value[uVal.field], '$', uVal.precision);
        } else {
          result[val.key] = acc.formatNumber(val.value[uVal.field], uVal.precision, ',') + uVal.misc;
        }
      });
      return result;
    }
    function createArrForTrend (uObj, uVal) {
      var result = [];
      _.filter(uObj.value, function(v,i) {
      	result.push(v[uVal.field] < 1 ? _.round(v[uVal.field],3) : _.round(v[uVal.field],0));
      });
      return result;
    }
  }


})();
