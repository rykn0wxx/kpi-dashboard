/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom')
      .controller('DcPieQuarterCtrl', DcPieQuarterPageCtrl);

  /** @ngInject */
  function DcPieQuarterPageCtrl($scope, $window, $timeout) {
    var crossfilter = $window.crossfilter;
    var _ = $window._;
    var d3 = $window.d3;
    var dc = $window.dc;
    var $ = $window.jQuery;
    var o = this;
    var wMax = 1359;
    var cMax = 200;
    o.$scope = $scope;

    var chartQuarter = dc.pieChart('#pie-quarter');
    $scope.winwidth = 0;
    $scope.clearFilter =  function () {
      $timeout(function () {
        chartQuarter.filterAll();
        dc.redrawAll();
      },1);
    }

    var dateFormat = d3.time.format('%m/%d/%Y');
    var data =  $scope.setData;

    var ndx = data;
    var all = ndx.groupAll();
    var dimYear = ndx.dimension(function (d) {
      var month = d.dd.getMonth();
      if (month <= 2) {
        return 'Q1';
      } else if (month > 2 && month <= 5) {
        return 'Q2';
      } else if (month > 5 && month <= 8) {
        return 'Q3';
      } else {
        return 'Q4';
      }
    });
    var grpYear = dimYear.group().reduceCount();

    chartQuarter
      .width(180)
      .height(180)
      .radius(80)
      .innerRadius(30)
      .dimension(dimYear)
      .group(grpYear)
      .label(function (d) {
        if (chartQuarter.hasFilter() && !chartQuarter.hasFilter(d.key)) {
          return d.key + '(0%)';
        }
        var label = d.key;
        if (all.value()) {
          label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
        }
        return label;
      });
    chartQuarter.render();
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
            chartQuarter.width(200);
          } else if (toLarge && n !==wMax) {
            var nn = cMax + (cMax * perChange);
            nn = (nn >= cMax) ? cMax:nn;
            chartQuarter.width(nn);
          } else if (!toLarge && n !== wMax) {
            var nn = cMax - (cMax * perChange);
            nn = (nn <= 150) ? 150:nn;
            chartQuarter.width(nn);
          }
          chartQuarter.redraw();
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
