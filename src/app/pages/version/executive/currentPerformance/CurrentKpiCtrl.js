/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive')
      .controller('CurrentKpiCtrl', CurrentKpiCtrl);

  function CurrentKpiCtrl ($scope, $window, $stateParams) {
    var _ = $window._;
    var kNdx = $scope.$parent.n;
    var sParm = _.camelCase($stateParams.type.replace(' ',''));
    $scope.perKpi = {
      data: [],
      label: []
    };
    $scope.kpiName = $stateParams.type;
    var metrics = [
      {
        name: 'revenue',
        type: 'zCurrency',
        value: 'revenueDollar'
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

    _.forEach(kNdx.perMonth.all(), function(val, key) {
      $scope.perKpi.label.push(val.key.getFullYear() + '-' + val.key.toDateString().split(' ')[1]);
      $scope.perKpi.data.push(val.value[sParm]);
    });

    $scope.perKpi.options = {
      fill: false,
      backgroundColor: 'rgba(151, 187, 205, 0.1)',
      scales: {
        yAxes: [
          {
            fill: false,
            ticks: {
              callback: function (val, ind, vals) {
                var numFormat = _.filter(metrics, ['name', sParm])[0];
                if (_.lowerCase(numFormat.type).indexOf('percent') !== -1) {
                  return val.toPrecision(2) + '%';
                } else if (_.lowerCase(numFormat.type).indexOf('currency') !== -1) {
                  return '$' + val.toPrecision(2);
                } else {
                  return val.toString();
                }
              },
              beginAtZero: true
            }
          }
        ],
        xAxes: [
          {
            fill: false
          }
        ]
      }
    };
  }

})();
