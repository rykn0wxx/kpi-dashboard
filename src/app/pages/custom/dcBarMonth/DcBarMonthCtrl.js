/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom')
      .controller('DcBarMonthCtrl', DcBarMonthPageCtrl);

  /** @ngInject */
  function DcBarMonthPageCtrl($scope, $window, $timeout) {
    var crossfilter = $window.crossfilter;
    var _ = $window._;
    var d3 = $window.d3;
    var dc = $window.dc;
    var $ = $window.jQuery;
    var o = this;
    var wMax = 1359;
    var cMax = 200;
    o.$scope = $scope;

    var chartMonth = dc.barChart('#bar-month');
    $scope.winwidth = 0;
    $scope.clearFilter =  function () {
      $timeout(function () {
        chartMonth.filterAll();
        dc.redrawAll();
      },1);
    }

    var dateFormat = d3.time.format('%m/%d/%Y');
    var data =  $scope.setData;

    var ndx = data;
    var all = ndx.groupAll();
    var dimYear = ndx.dimension(function (d) {
      return d3.time.month(d.month);
    });
    var grpYear = dimYear.group().reduceCount();

    chartMonth
      .elasticY(true)
      .width(650)
      .height(180)
      //.x(d3.scale.ordinal())
      .x(d3.time.scale().domain([new Date('1/1/2015'), new Date("12/1/2016")]))
      .round(d3.time.month.round)
      .xUnits(d3.time.months)
      .brushOn(false)
      .dimension(dimYear)
      .group(grpYear)
      // .barPadding(0.1)
      // .outerPadding(0.05)
      .on('pretransition', function(chart) {
        chart.selectAll('rect.bar').on('click', function (d) {
          console.log(d);
          chart.filter(null)
            .filter(d.data.key)
            .redrawGroup();
        });
      });
    chartMonth.render();
    $scope.$on('$destroy', function () {
      ndx.remove();
      all.dispose();
      grpYear.dispose();
      dimYear.dispose();
    });

    function getDim () {
      $scope.winwidth  = $(window).width();
    };

    $scope.$watch('winwidth', function(n, o) {
      if (n !== o) {
        $timeout(function() {
          var toLarge = n > o;
          var perChange = Math.abs(n-o) / o;
          if (n === wMax) {
            chartMonth.width(200);
          } else if (toLarge && n !==wMax) {
            var nn = cMax + (cMax * perChange);
            nn = (nn >= cMax) ? cMax:nn;
            chartMonth.width(nn);
          } else if (!toLarge && n !== wMax) {
            var nn = cMax - (cMax * perChange);
            nn = (nn <= 150) ? 150:nn;
            chartMonth.width(nn);
          }
          chartMonth.redraw();
        },1);
      }
    }, true);

    $(window).on('resize', function(ev) {
      $scope.$apply(function () {
        $scope.winwidth  = $(window).width();
      });
    });

    getDim();

  }



})();
