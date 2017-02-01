/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('DashboardBlockCtrl', DashboardBlockCtrl);

  /** @ngInject */
  function DashboardBlockCtrl ($scope, $window, $filter) {
    var o = this;
    o.$scope = $scope;
    var ndx = $window.crossfilter;
    var _ = $window._;
    var d3 = $window.d3;
    $scope.widgetObj = [];
    $scope.metrics = {
      'revenue':'zCurrency',
      'ebitPercent':'zPercent',
      'iph':'zNumber',
      'costPerTkt':'currency',
      'ebitPerTkt':'currency',
      'revPerHead':'currency'
    };
    var zData = $scope.$resolve.collection.zData;
    var zClient = $scope.$resolve.collection.zClient;
    var zRegion = $scope.$resolve.collection.zRegion;
    var tmpId = null;
    _.map(zData, function (val, ind) {
      tmpId = _.filter(zClient, ['id', val.clientId])[0].regionId;
      val.clientName = _.filter(zClient, ['id', val.clientId])[0].code;
      val.regionName = _.filter(zRegion, ['id', tmpId])[0].name;
      val.global = 'global';
    });
    var n = {};
    n.ndx = ndx(zData);
    n.dimMonth = n.ndx.dimension(function (d) {return d.repmonth;});
    n.global = n.ndx.dimension(function (d) {return d.global;});
    n.dimRegion = n.ndx.dimension(function (d) {return d.regionName;});
    n.dimClient = n.ndx.dimension(function (d) {return d.clientName;});
    n.perRegion = n.dimRegion.group().reduce(grpAdd,grpRemove,grpBase);
    n.perMonth = n.dimMonth.group().reduce(grpAdd,grpRemove,grpBase);
    n.perGlobal = n.global.group().reduce(grpAdd,grpRemove,grpBase);
    n.perClient = n.dimClient.group().reduce(grpAdd,grpRemove,grpBase);
    o.n = n;
    _.forEach($scope.metrics, function(v, i) {
    	var tmp = {
    		metric: i,
    		type: v,
    		global: $filter(v)(_.at(n.perGlobal.all()[0].value, i)[0]),
    		regions: []
    	}
    	_.forEach(n.perRegion.all(), function(val, ind) {
    		var ztmp = {};
        ztmp.name = val.key;
        ztmp.value = $filter(v)(_.at(val.value, i)[0]);
    		tmp.regions.push(ztmp);
    	});
    	$scope.widgetObj.push(tmp);
      $scope.zGlobal = n.perGlobal.all();
    });
    $scope.perClients = n.perClient.all();
    $scope.perRegion = n.perRegion.all();
  }


  function grpAdd (p, v) {
    ++p.count;
    p.ebit += +v.ebitDollar;
    p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
    p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
    p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

    p.revenue += +v.revenueDollar;
    p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
    p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
    p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

    p.ebitPercent = p.ebit/p.revenue;
    p.ebitPercentScore = p.ebitScore / p.revenueScore;

    p.expense = p.revenue - p.ebit;
    p.avgExpense = p.expense / p.count;

    p.tktVolume += +v.ticketVolume;
    p.avgTktVolume = p.tktVolume / p.count;

    p.tktFte += +v.fte;
    p.avgTktFte = p.tktFte / p.count;

    p.iph = p.tktVolume/p.tktFte;

    p.costPerTkt = p.expense / p.tktVolume;
    p.ebitPerTkt = p.ebit / p.tktVolume;
    p.revPerHead = p.revenue / p.tktFte;
    return p;
  };

  function grpRemove (p, v) {
    --p.count;
    p.ebit -= +v.ebitDollar;
    p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
    p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
    p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

    p.revenue -= +v.revenueDollar;
    p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
    p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
    p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

    p.ebitPercent = p.ebit/p.revenue;
    p.ebitPercentScore = p.ebitScore / p.revenueScore;

    p.expense = p.revenue - p.ebit;
    p.avgExpense = p.expense / p.count;

    p.tktVolume -= +v.ticketVolume;
    p.avgTktVolume = p.tktVolume / p.count;

    p.tktFte -= +v.fte;
    p.avgTktFte = p.tktFte / p.count;

    p.iph = p.tktVolume/p.tktFte;

    p.costPerTkt = p.expense / p.tktVolume;
    p.ebitPerTkt = p.ebit / p.tktVolume;
    p.revPerHead = p.revenue / p.tktFte;
    return p;
  }

  function grpBase () {
    return {
      count: 0,
      ebit: 0,
      ebitMin: 0,
      ebitMax: 0,
      ebitScore: 0,

      revenue: 0,
      revenueMin: 0,
      revenueMax: 0,
      revenueScore: 0,

      ebitPercent: 0,
      ebitPercentScore: 0,

      expense: 0,
      avgExpense: 0,

      tktVolume: 0,
      avgTktVolume: 0,

      tktFte: 0,
      avgTktFte: 0,

      iph: 0,

      costPerTkt: 0,
      ebitPerTkt: 0,
      revPerHead: 0
    }
  }
})();
