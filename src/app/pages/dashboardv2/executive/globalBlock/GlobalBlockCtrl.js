/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboardv2.executive')
    .controller('GlobalBlockCtrl', GlobalBlockPageCtrl);

  /** @ngInject */
  function GlobalBlockPageCtrl ($scope, $window, $rootScope, $timeout, metrics, calcUtil, ds) {
    var o = this;
    var n = this;
    o.$scope = $scope;
    o.ndx = $window.crossfilter;
    o._ = $window._;
    o.d3 = $window.d3;
    o.acc = $window.accounting;
    o.ds = ds;
    o.$timeout = $timeout;
    o.timeout = null;


    var dFormat = calcUtil.dtx.stdDate;

    $scope.metrics = _.cloneDeep(metrics.executive);
    $scope.regionMetrics = [];
    $scope.currentGlobal = [];
    $scope.zRegion = 'asd';

    // n.all = ds.all;
    // n.dimMonth = ds.dimMonth;
    // n.dimRegion = $scope.globalData.dc.getDimension('dimRegion');
    // n.dimGlobal = $scope.globalData.dc.getDimension('dimGlobal');
    // n.grpMonth = $scope.globalData.dc.getGroup('grpMonth');
    // n.grpRegion = $scope.globalData.getGroup('grpRegion');
    // n.grpGlobal = $scope.globalData.getGroup('grpGlobal');
    // n.oneGlobal = $scope.globalData.getGroup('oneGlobal');
    // n.oneRegion = $scope.globalData.getGroup('oneRegion');

    n.trendGlobal = _.cloneDeep(ds.perGlobal.all());
    n.trendRegion = _.cloneDeep(ds.perRegion.all());

    $scope.zData = ds.oneRegion.all();
    $scope.$watch('monthFilter', function (nVal, oVal, sc) {
      if (_.isDate(nVal) && !_.isUndefined(nVal)) {
        $timeout(function() {
        $scope.$apply(function () {
          ds.dc.addFilter('dimMonth', function(d) {
            return d.getMonth() === $scope.monthFilter.getMonth() && d.getFullYear() === $scope.monthFilter.getFullYear();
          });
          o.init();
        });
        },100);

      }
    });

  }

  GlobalBlockPageCtrl.prototype.clearTimeout = function () {
    var o = this;
    if (o.timeout) {
      o.$timeout.cancel(o.timeout);
      o.timeout = null;
    }
  };

  // 1
  GlobalBlockPageCtrl.prototype.init = function () {
    var o = this;
    o.$scope.currentGlobal = o.ds.oneGlobal.all()[0];
    o.$scope.regionMetrics = o.ds.oneRegion.all();
    var prevGlobal = o.prevGlobal();
    o.clearTimeout();
    o.timeout = o.$timeout(function () {
      o.clearTimeout();
      o.updateMetricModel(prevGlobal);
    }, 100);
  };

  //2
  GlobalBlockPageCtrl.prototype.updateGlobal = function () {
    var o = this;
    o.$scope.currentGlobal = o.n.fupGlobal.all()[0];
    o.$scope.regionMetrics = o.n.fupRegion.all();
    o.renderApply();
  };

  //3
  GlobalBlockPageCtrl.prototype.renderApply = function () {
    var o = this;
    o.clearTimeout();
    o.timeout = o.$timeout(function () {
      o.clearTimeout();
      var gPref = o.prevGlobal();
      o.updateMetricModel(gPref);
    }, 100);
  };

  GlobalBlockPageCtrl.prototype.updateMetricModel = function (prevPerf) {
    var o = this;
    _.map(o.$scope.metrics, function(val) {
      if (val.format === 'formatMoney') {
        val.global = o.acc.formatMoney(o.$scope.currentGlobal.value[val.field], '$', val.precision);
      } else {
        val.global = o.acc.formatNumber(o.$scope.currentGlobal.value[val.field], val.precision, ',') + val.misc;
      }
      val.indicator = (prevPerf[val.field] > o.$scope.currentGlobal.value[val.field]) ? 'fa-arrow-down slideInDown color-red-light':'fa-arrow-up slideInUp color-lime-dark';
      val.trendGlobal = o.createArrForTrend(o.trendGlobal[0], val);
      val.regions = o.groupRegionPerMetric(o.$scope.regionMetrics, val);
    });
    return o.$scope.metrics;
  };

  GlobalBlockPageCtrl.prototype.createArrForTrend = function (uObj, uVal) {
    var result = [];
    _.filter(uObj.value, function(v,i) {
    	result.push(v[uVal.field] < 1 ? _.round(v[uVal.field],3) : _.round(v[uVal.field],0));
    });
    return result;
  };

  GlobalBlockPageCtrl.prototype.groupRegionPerMetric = function (uObj, uVal) {
    var o = this;
    var result = {};
    var tmpD = o.$scope.monthFilter;
    var prevMonth = new Date(tmpD);
    prevMonth.setMonth(tmpD.getMonth() - 1);

    _.forEach(uObj, function(val, i) {
      var prevData = o.prevRegion(val.key, prevMonth.yyyymmm(), uVal.field);

      if (uVal.format === 'formatMoney') {
        result[val.key] = [o.acc.formatMoney(val.value[uVal.field], '$', uVal.precision), _.gt(val.value[uVal.field], prevData)];
      } else {
        result[val.key] = [o.acc.formatNumber(val.value[uVal.field], uVal.precision, ',') + uVal.misc, _.gt(val.value[uVal.field], prevData)];
      }
    });
    return result;
  };

  GlobalBlockPageCtrl.prototype.prevRegion = function (region, prevMonth, metric) {
    var o = this;
    var strLook = 'value.' + prevMonth + '.' + metric;
    var regData = _.filter(o.trendRegion, ['key', region])[0];
    return _.at(regData, [strLook])[0];
  };

  GlobalBlockPageCtrl.prototype.prevGlobal = function () {
    var o = this;
    var tmpD = o.$scope.monthFilter;
    var prevMonth = new Date(tmpD);
    prevMonth.setMonth(tmpD.getMonth() - 1);
    return o.trendGlobal[0].value[prevMonth.yyyymmm()];
  };

  GlobalBlockPageCtrl.$inject = ['$scope', '$window', '$rootScope', '$timeout', 'metrics', 'calcUtil', 'dataService'];

})();
