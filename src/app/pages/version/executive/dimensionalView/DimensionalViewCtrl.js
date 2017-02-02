/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive')
      .controller('DimensionalViewCtrl', DimensionalViewCtrl);

  /** @ngInject */
  function DimensionalViewCtrl($scope, $timeout, $window) {
    var _ = $window._;
    var dc = $window.dc
    var data = _.cloneDeep($scope.n.ndx);

    var dMonth = data.dimension(function(d) {return d.repmonth;});
    var dGlobal = data.dimension(function (d) {return d.global;});
    var dRegion = data.dimension(function (d) {return d.regionName;});
    var gRegion = dRegion.group();
    var revRegion = dRegion.group().reduceSum(function(d){return +d.revenueDollar;});
    var ebiMonth = dMonth.group().reduceSum(function(d){return +d.ebitDollar;});
    var mRegion = gRegion.reduce(
      function(p, v) {
        ++p.count;
        p.revenueDollar += +v.revenueDollar;
        p.ebitDollar += +v.ebitDollar;
        p.total += (v.revenueDollar + (v.revenueDollar - v.ebitDollar)) / 2;
        p.avg = Math.round(p.total / p.count);
        return p;
      },
      function(p, v) {
        --p.count;
        p.revenueDollar -= +v.revenueDollar;
        p.ebitDollar -= +v.ebitDollar;
        p.total -= (v.revenueDollar + (v.revenueDollar - v.ebitDollar)) / 2;
        p.avg = p.count ? Math.round(p.total / p.count) : 0;
        return p;
      },
      function(p, v) {
        return {count:0,revenueDollar:0,ebitDollar:0,total:0,avg:0};
      }
    );
    var orBarChrt = dc.barChart('#ordinal-bar-chart');
    var volumeChart = dc.barChart('#monthly-volume-chart');
    var moveChart = dc.lineChart('#monthly-move-chart');
    orBarChrt
      .width(500)
      .height(150)
      .dimension(dRegion)
      .group(revRegion)
      .elasticY(true)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal);

    moveChart
      .renderArea(true)
      .width(990)
      .height(200)
      .transitionDuration(1000)
      .margins({top: 30, right: 50, bottom: 25, left: 40})
      .dimension(dMonth)
      .mouseZoomable(false)
      .rangeChart(volumeChart)
      .x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2017, 11, 31)]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
      .brushOn(false)
      .group(revRegion, 'Monthly Index Average')
      .valueAccessor(function (d) {
        return d.value.revenueDollar;
      });

      volumeChart
        .width(990) /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
        .height(40)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(dMonth)
        .group(ebiMonth)
        .centerBar(true)
        .gap(1)
        .x(d3.time.scale().domain([new Date(2015, 0, 1), new Date(2017, 11, 31)]))
        .round(d3.time.month.round)
        .alwaysUseRounding(true)
        .xUnits(d3.time.months);
    orBarChrt.render();
    volumeChart.render();
    moveChart.render();

  }
})();
