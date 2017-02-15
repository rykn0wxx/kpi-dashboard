/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldownv2.perKpi')
  .controller('DrillV2KpiCtrl', DrillKpiPageCtrl);

  function DrillKpiPageCtrl ($scope, $window, $rootScope, $stateParams, ds, $mdSidenav, $timeout, metrics) {
    var o = this;
    o.$scope = $scope;
    var dc = $window.dc;
    var d3 = $window.d3;
    var crossfilter = $window.crossfilter;

    var dateFormat = d3.time.format('%m/%d/%Y');

    $scope.kpiSelected = ($stateParams.kpi.length === 0) ? _.filter(metrics.executive, ['field', 'revenue'])[0] : _.filter(metrics.executive, ['field', $stateParams.kpi])[0];

    var dmMonths = ds.dc.getDimension('dimMonth').group().reduceCount().all();
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

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      }
    }

    var forRegion = _.cloneDeep(ds.perRegion.all());
    var forGlobal = _.cloneDeep(ds.perGlobal.all());

    $scope.metrics = metrics.executive;
    var dataSeries = function (glb) {
      var sel = _.filter(forRegion, ['key', glb])[0];
      return (sel === undefined) ? forGlobal[0] : sel;
    };

    var dataMetrics = function (metric) {
      var sel = _.filter(metrics.executive, ['field', metric])[0];
      return (sel === undefined) ? _.filter(metrics.executive, ['field', 'revenue'])[0] : sel;
    };

    function updateSeries (isGlobal, metric) {
      var categories = [];
      var data = [];
      var series = [];
      var selSeries = dataSeries(isGlobal);
      var selMet = dataMetrics(metric);
      _.forEach(selSeries.value, function(val, key) {
        categories.push(key);
        data.push(val[selMet.field]);
      });
      series.push({
        id: 'csm' + _.lowerCase(selSeries.key),
        name: _.upperCase(selSeries.key),
        data: data
      });
      return {categories: categories, series: series, kpi: selMet};
    }

    function createRegionSeries (name) {
      var data = [];
      var baseSeries = dataSeries(name);
      _.forEach(baseSeries.value, function(val, key) {
        data.push([key, val[$scope.kpiSelected.field]]);
      });
      $scope.chartConfig.series.push({
        name: name,
        id: 'csm' + _.lowerCase(name),
        data: data,
        type: 'spline'
      });
    }

    $scope.buildSeries = function (isGlobal, metric) {
      var data = updateSeries(isGlobal, metric);
      var sd = $mdSidenav('right').isOpen();
      $scope.chartConfig.series = data.series;
      $scope.chartConfig.xAxis.categories = data.categories;
      $scope.chartConfig.title.text = data.kpi.metric;
      if (sd) {
        $mdSidenav('right').toggle();
      }
      $timeout(function() {
        $scope.kpiSelected = data.kpi;
      },1000);
    };

    $scope.addSeries = function (region) {
      var chSeries = $scope.chartConfig.series;
      var idSeries = _.filter(chSeries, ['id', 'csm' + _.lowerCase(region)])[0];
      if (idSeries !== undefined) {
        _.remove(chSeries, function(n) {
          return n.id === idSeries.id;
        });
      } else {
        createRegionSeries(region);
      }
    };

    $scope.altSeries = updateSeries(true, $scope.kpiSelected.field);

    $scope.chartSeries = [
      {"name": "Some data", "data": [1, 2, 4, 7, 3]},
      {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
      {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
      {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
    ];

    $timeout(function() {
      $scope.chartConfig.series = $scope.altSeries.series;
      $scope.chartConfig.xAxis.categories = $scope.altSeries.categories;
    },100);

    $scope.chartConfig = {
      options: {
        chart: {
          type: 'column'
        },
        plotOptions: {
          series: {
            stacking: ''
          }
        }
      },
      xAxis: {
        categories: null
      },
      series: $scope.chartSeries,
      title: {
        text: null
      },
      credits: {
        enabled: true
      },
      loading: false,
      size: {},
      func: function (chart) {
        $timeout(function() {
          chart.reflow();
        },200);
      }
    };


    // Add on
    var xx = crossfilter(ds.dc.configuration.sourceData);
    var dRegions = xx.dimension(function(d) {return d.region_name;});
    var gRegions = dRegions.group().reduce(ds.dc.grpAdd, ds.dc.grpRemove, ds.dc.grpBase);
    var dClients = xx.dimension(function(d) {return d.client_name;});
    //var gClients = dClients.group().reduce(ds.dc.grpAdd, ds.dc.grpRemove, ds.dc.grpBase);
    var gClients = dClients.group().reduce(
      function (p, v) {
        var c = dateFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c] ||  {};
        ++p[c].count;
        if (_.isUndefined(p[c].init)) {
          p[c] = ds.dc.grpBase();
          p[c].init = true;
        }
        p[c] = ds.dc.grpAdd(p[c], v);
        p[c].orderMonth = _.sum([dateFormat.parse(v.repmonth).getFullYear(), dateFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function (p, v) {
        var c = dateFormat.parse(v.repmonth).yyyymmm();
        p[c] = p[c];
        --p[c].count;
        p[c] = ds.dc.grpRemove(p[c], v);
        p[c].orderMonth = _.sum([dateFormat.parse(v.repmonth).getFullYear(), dateFormat.parse(v.repmonth).getMonth()]);
        return p;
      },
      function () { return {}; }
    );
    $scope.$watch('kpiSelected', function(nn, oo) {
      console.log(nn, oo);
    }, true);
    var regionPie = dc.pieChart('#regionPie');
    regionPie
      .width(300)
      .height(300)
      .dimension(dRegions)
      .group(gRegions)
      .valueAccessor(function(d) {
        return +d.value[$scope.kpiSelected.field];
      })
      .innerRadius(50);
    regionPie.render();
    console.log(gClients.all());


  }

  DrillKpiPageCtrl.$inject = ['$scope', '$window', '$rootScope', '$stateParams', 'dataService', '$mdSidenav', '$timeout', 'metrics'];

})();
