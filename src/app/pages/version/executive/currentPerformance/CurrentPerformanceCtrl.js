/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive')
      .controller('CurrentPerformanceCtrl', CurrentPerformanceCtrl);

  /** @ngInject */
  function CurrentPerformanceCtrl($scope, $timeout, $window, $filter, baConfig, baUtil, urlUtil) {
    var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
    var ndx = $window.crossfilter;
    var _ = $window._;
    var d3 = $window.d3;
    var o = this;
    o.$scope = $scope;
    $scope.charts = [];
    var zData = $scope.$resolve.collection.zData;
    var zClient = $scope.$resolve.collection.zClient;
    var zRegion = $scope.$resolve.collection.zRegion;

    var metrics = [
      {
        name: 'revenue',
        type: 'zCurrency',
        sub: 'revenueScore'
      },
      {
        name: 'ebitPercent',
        type: 'zPercent',
        sub: 'ebitPercentScore'
      },
      {
        name: 'iph',
        type: 'zNumber',
        sub: 'avgTktVolume'
      },
      {
        name: 'costPerTkt',
        type: 'currency',
        sub: 'tktVolume'
      },
      {
        name: 'ebitPerTkt',
        type: 'currency',
        sub: 'ebitMin'
      },
      {
        name: 'revPerHead',
        type: 'currency',
        sub: 'avgTktFte'
      }
    ];

    var tmpId = null;
    _.map(zData, function (val, ind) {
      tmpId = _.filter(zClient, ['id', val.clientId])[0].regionId;
      val.clientName = _.filter(zClient, ['id', val.clientId])[0].code;
      val.regionName = _.filter(zRegion, ['id', tmpId])[0].name;
      val.global = 'global';
    });

    var n = $scope.n = {};
    n.ndx = ndx(zData);
    n.dimMonth = n.ndx.dimension(function (d) {return d.repmonth;});
    n.global = n.ndx.dimension(function (d) {return d.global;});
    n.dimRegion = n.ndx.dimension(function (d) {return d.regionName;});
    n.dimClient = n.ndx.dimension(function (d) {return d.clientName;});
    n.perRegion = n.dimRegion.group().reduce(grpAdd,grpRemove,grpBase);
    n.perMonth = n.dimMonth.group().reduce(grpAdd,grpRemove,grpBase);
    n.perGlobal = n.global.group().reduce(grpAdd,grpRemove,grpBase);
    n.perClient = n.dimClient.group().reduce(grpAdd,grpRemove,grpBase);
    updateValues();

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function loadPieCharts() {
      $('.chart').each(function () {
        var chart = $(this);
        chart.easyPieChart({
          easing: 'easeOutBounce',
          onStep: function (from, to, percent) {
            $(this.el).find('.percent').text(Math.round(percent));
          },
          barColor: chart.attr('rel'),
          trackColor: 'rgba(0,0,0,0)',
          size: 84,
          scaleLength: 0,
          animation: 2000,
          lineWidth: 9,
          lineCap: 'round',
        });
      });

      $('.refresh-data').on('click', function () {
        updatePieCharts();
      });
    }

    function updatePieCharts() {
      $('.pie-charts .chart').each(function(index, chart) {
        $(chart).data('easyPieChart').update(getRandomArbitrary(55, 90));
      });
    }

    function updateValues () {
      $scope.charts = [];
      _.forEach(metrics, function(v, i) {
      	var tmp = {
          icon: null,
          color: pieColor,
          description: _.startCase(v.name),
      		type: v.type,
          sub: {name: v.sub, data: _.round(_.at(n.perGlobal.all()[0].value, v.sub)[0],2)},
      		stats: $filter(v.type)(_.at(n.perGlobal.all()[0].value, v.name)[0]),
      		regions: {}
      	}
        var ztmp = {
          regData: [],
          regLabel: []
        };
      	_.forEach(n.perRegion.all(), function(val, ind) {
          ztmp.regLabel.push(val.key);
          ztmp.regData.push(_.round(_.at(val.value, v.name)[0],2));
      	});
        tmp.regions.data = ztmp.regData;
        tmp.regions.label = ztmp.regLabel;
      	$scope.charts.push(tmp);
        $scope.zGlobal = n.perGlobal.all();
      });
      // $timeout(function () {
      //   $scope.$apply(function() {
      //     loadPieCharts();
      //     updatePieCharts();
      //   });
      // }, 1000);
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

    $scope.$watch('opened', function(nVal, oVal, sc) {
      if (!nVal && sc.dt) {
        var prevVal = new Date(sc.dt);
        $timeout(function() {
          sc.$apply(function () {
            sc.n.dimMonth.filterFunction(function (d) {
              return sc.dt.getMonth() === d.getMonth() && sc.dt.getFullYear() === d.getFullYear();
            });
            updateValues();
          });
        },10);
      }
    }, true);
    $scope.ch = {
      labels : ['aaa','bbb','ccc','ddd','eee'],
      data : [1,2,3,4,3],
      options: {
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }]
        },
        tooltips: {
          //enabled: true
          custom: customTp
        }
      }
    };

    function customTp (tooltip) {
      var tooltipEl = document.getElementById('chartjs-tooltip');
      if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = "<table></table>"
				document.body.appendChild(tooltipEl);
			}
      // Hide if no tooltip
			if (tooltip.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}
      // Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltip.yAlign) {
				tooltipEl.classList.add(tooltip.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}
      function getBody(bodyItem) {
				return bodyItem.lines;
			}
      // Set Text
			if (tooltip.body) {
				var titleLines = tooltip.title || [];
				var bodyLines = tooltip.body.map(getBody);
				var innerHtml = '<thead>';
				titleLines.forEach(function(title) {
					innerHtml += '<tr><th>' + title + '</th></tr>';
				});
				innerHtml += '</thead><tbody>';
				bodyLines.forEach(function(body, i) {
					var colors = tooltip.labelColors[i];
					var style = 'background:' + colors.backgroundColor;
					style += '; border-color:' + colors.borderColor;
					style += '; border-width: 2px';
					var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
					innerHtml += '<tr><td>' + span + body + '</td></tr>';
				});
				innerHtml += '</tbody>';
				var tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}
      var position = this._chart.canvas.getBoundingClientRect();
			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.left = position.left + tooltip.caretX + 'px';
			tooltipEl.style.top = position.top + tooltip.caretY + 'px';
			tooltipEl.style.fontFamily = tooltip._fontFamily;
			tooltipEl.style.fontSize = tooltip.fontSize;
			tooltipEl.style.fontStyle = tooltip._fontStyle;
			tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
    }
  }


  angular.module('BlurAdmin.pages.version.executive')
        .service('dashboardPieChart', dashboardPieChart);

    /** @ngInject */
    function dashboardPieChart() {

    }
})();
