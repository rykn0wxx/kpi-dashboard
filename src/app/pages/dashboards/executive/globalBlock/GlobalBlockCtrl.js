/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboards.executive')
    .controller('GlobalBlockCtrl', GlobalBlockPageCtrl);

  /** @ngInject */
  function GlobalBlockPageCtrl ($scope, $window, $rootScope, $timeout, metrics, calcUtil) {
    var o = this;
    o.$scope = $scope;
    o.ndx = $window.crossfilter;
    o._ = $window._;
    o.d3 = $window.d3;
    o.acc = $window.accounting;
    o.$timeout = $timeout;
    o.timeout = null;

    var xDimm = calcUtil.ndx.dimension;
    var grpAdd = calcUtil.ndx.grpAdd;
    var grpRemove = calcUtil.ndx.grpRemove;
    var grpBase = calcUtil.ndx.grpBase;
    var grpAddWithTrend = calcUtil.ndx.grpAddWithTrend;
    var grpRemoveWithTrend = calcUtil.ndx.grpRemoveWithTrend;
    var dFormat = calcUtil.dtx.stdDate;

    $scope.metrics = _.cloneDeep(metrics.executive);
    $scope.regionMetrics = [];
    $scope.currentGlobal = [];

    // create dimensions and groups
    var n = {};
    n.ndx = o.ndx($scope.globalData);
    n.all = n.ndx.groupAll();
    n.dimMonth = n.ndx.dimension(xDimm('repmonth', 'd'));
    n.grpMonth = n.dimMonth.group();

    n.dimRegion = n.ndx.dimension(xDimm('regionName', 's'));
    n.grpRegion = n.dimRegion.group();
    n.fupRegion = n.dimRegion.group().reduce(grpAdd,grpRemove,grpBase);
    n.perRegion = n.grpRegion.reduce(
      function (p, v) {
        var c = dFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c] ||  {};
        ++p[c].count;
        if (_.isUndefined(p[c].init)) {
          p[c] = grpBase();
          p[c].init = true;
        }
        p[c] = grpAdd(p[c], v);
        p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function (p, v) {
        var c = dFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c];
        p[c] = grpRemove(p[c], v);
        p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function () { return {}; }
    );

    n.dimGlobal = n.ndx.dimension(xDimm('global', 's'));
    n.grpGlobal = n.dimGlobal.group();
    n.fupGlobal = n.dimGlobal.group().reduce(grpAdd,grpRemove,grpBase);
    n.perGlobal = n.grpGlobal.reduce(
      function (p, v) {
        var c = dFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c] ||  {};
        ++p[c].count;
        if (_.isUndefined(p[c].init)) {
          p[c] = grpBase();
          p[c].init = true;
        }
        p[c] = grpAdd(p[c], v);
        p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function (p, v) {
        var c = dFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c];
        p[c] = grpRemove(p[c], v);
        p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function () { return {}; }
    );

    $scope.data = o.n = n;

    $scope.trendRegionMonth = _.cloneDeep(n.perRegion.all());
    $scope.trendGlobalMonth = _.cloneDeep(n.perGlobal.all());

    $scope.$watch(function () {
      return $scope.$parent.curMonth;
    }, function (newVal, oldVal, sc) {
      if (newVal !== oldVal) {
        $rootScope.curMonth = $scope.$parent.curMonth;
        sc.vmGlobalBlock.init();
      }
    }, true);

    o.init();
    if ($rootScope.globals.data === undefined) {
      $rootScope.globals.data = $scope.data;
    }
    if ($rootScope.globals.ndx ===  undefined) {
      $rootScope.globals.ndx = $scope.data;
    }
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
    var cm = o.$scope.$parent.curMonth;
    o.clearTimeout();
    o.timeout = o.$timeout(function () {
      o.clearTimeout();
      o.n.dimMonth.filterFunction(function(d) {
        return d.getMonth() === cm.getMonth() && d.getFullYear() === cm.getFullYear();
      });
      o.updateGlobal();
    }, 1);
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
      val.trendGlobal = o.createArrForTrend(o.$scope.trendGlobalMonth[0], val);
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
    var tmpD = o.$scope.$parent.curMonth;
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
    var regData = _.filter(o.$scope.trendRegionMonth, ['key', region])[0];
    return _.at(regData, [strLook])[0];
  };

  GlobalBlockPageCtrl.prototype.prevGlobal = function () {
    var o = this;
    var tmpD = o.$scope.$parent.curMonth;
    var prevMonth = new Date(tmpD);
    prevMonth.setMonth(tmpD.getMonth() - 1);
    return o.$scope.trendGlobalMonth[0].value[prevMonth.yyyymmm()];
  };

  GlobalBlockPageCtrl.$inject = ['$scope', '$window', '$rootScope', '$timeout', 'metrics', 'calcUtil'];

})();
