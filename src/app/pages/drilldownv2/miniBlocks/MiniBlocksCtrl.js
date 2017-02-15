/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldownv2')
    .controller('MiniBlocksCtrl', MiniBlocksPageCtrl);

  /** @ngInject */
  function MiniBlocksPageCtrl ($scope, $window, ds, metrics, calcUtil, $timeout, $rootScope) {
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

    var icons = ['fa-recycle','fa-eraser','fa-file-movie-o','fa-bar-chart-o','fa-camera-retro','fa-table','fa-coffee','fa-flag','fa-life-ring','fa-ban','fa-mobile-phone','fa-bookmark-o','fa-wheelchair','fa-thumbs-up','fa-keyboard-o','fa-expand','fa-weixin','fa-leanpub','fa-quote-left','fa-bicycle'];
    var regions = ['APAC','EMEA','North America','LATAM'];

    var dFormat = calcUtil.dtx.stdDate;

    $scope.monthFilter = $rootScope.globals.filterMonth;
    $scope.metrics = _.cloneDeep(metrics.executive);
    $scope.regionMetrics = [];
    $scope.currentGlobal = [];
    $scope.inBoxInfo = [];

    $scope.sellKpi = ($scope.selKpi.length === 0) ? 'revenue' : $scope.selKpi.metric;

    n.trendGlobal = _.cloneDeep(ds.perGlobal.all());
    n.trendRegion = _.cloneDeep(ds.perRegion.all());

    $scope.zRegion = ds.oneRegion.all();
    $scope.$watch(function () {
      return $rootScope.globals.filterMonth;
    }, function (nVal, oVal) {
      refreshVisual();
    });

    $scope.zBuildSeries = function (region) {
      $scope.upctrl.$scope.addSeries(region);
    };

    $scope.$watch('selKpi', function (nVal, oVal) {
      if (nVal !== oVal) {
        refreshVisual();
      }
    });

    function refreshVisual () {
      $scope.toanimate = true;
      o.clearTimeout();
      o.timeout = o.$timeout(function() {
        o.clearTimeout();
        $scope.$apply(function () {
          ds.dc.addFilter('dimMonth', function(d) {
            return d.getMonth() === $scope.monthFilter.getMonth() && d.getFullYear() === $scope.monthFilter.getFullYear();
          });
          o.init();
          o.$scope.toanimate = false;
        });
      },100);
    }
  }

  MiniBlocksPageCtrl.prototype.init = function () {
    var o = this;
    o.$scope.currentGlobal = o.ds.oneGlobal.all()[0];
    o.$scope.regionMetrics = o.ds.oneRegion.all();
    var prevGlobal = o.prevGlobal();
    //o.updateMetricModel(prevGlobal);
    o.clearTimeout();
    o.timeout = o.$timeout(function () {
      o.clearTimeout();
      o.updateMetricModel(prevGlobal);
      o.updateInbox();
    }, 100);
  };

  MiniBlocksPageCtrl.prototype.updateInbox = function () {
    var o = this;
    o.$scope.inBoxInfo = [];
    var metObj = _.filter(o.$scope.metrics, ['metric', o.$scope.selKpi.metric])[0];
    _.forEach(metObj.regions, function(val, ind) {
      var tmp = {
        name: ind,
        data: val[0],
        icon: (val[1]) ? 'ion-arrow-up-c' : 'ion-arrow-down-c'
      };
      o.$scope.inBoxInfo.push(tmp);
    });
  };

  MiniBlocksPageCtrl.prototype.prevGlobal = function () {
    var o = this;
    var tmpD = o.$scope.monthFilter;
    var prevMonth = new Date(tmpD);
    prevMonth.setMonth(tmpD.getMonth() - 1);
    return o.trendGlobal[0].value[prevMonth.yyyymmm()];
  };

  MiniBlocksPageCtrl.prototype.updateMetricModel = function (prevPerf) {
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

  MiniBlocksPageCtrl.prototype.groupRegionPerMetric = function (uObj, uVal) {
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

  MiniBlocksPageCtrl.prototype.prevRegion = function (region, prevMonth, metric) {
    var o = this;
    var strLook = 'value.' + prevMonth + '.' + metric;
    var regData = _.filter(o.trendRegion, ['key', region])[0];
    return _.at(regData, [strLook])[0];
  };

  MiniBlocksPageCtrl.prototype.createArrForTrend = function (uObj, uVal) {
    var result = [];
    _.filter(uObj.value, function(v,i) {
    	result.push(v[uVal.field] < 1 ? _.round(v[uVal.field],3) : _.round(v[uVal.field],0));
    });
    return result;
  };

  MiniBlocksPageCtrl.prototype.clearTimeout = function () {
    var o = this;
    if (o.timeout) {
      o.$timeout.cancel(o.timeout);
      o.timeout = null;
    }
  };

  MiniBlocksPageCtrl.$inject = ['$scope', '$window', 'dataService', 'metrics', 'calcUtil', '$timeout', '$rootScope'];

})();
