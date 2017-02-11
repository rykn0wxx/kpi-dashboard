/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'ngCookies',
    'chart.js',
    'angularCharts',
    'restangular',


    'BlurAdmin.pages.dashboards',
    'BlurAdmin.pages.drilldown',
    'BlurAdmin.pages.rest'

  ])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, ChartJsProvider, baConfigProvider, DataProviderProvider) {
    $urlRouterProvider.otherwise('/dashboards');

    DataProviderProvider
      .setBaseUrl('http://localhost:3000')
      //.setBaseUrl('http://172.19.7.36:3000')
      //.setEnv('dist');
      .setEnv('dev');

    var layoutColors = baConfigProvider.colors;
    ChartJsProvider.setOptions({
      chartColors: [
        layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default, layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight
      ],
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      scale: {
        gridLines: {
          color: layoutColors.border
        },
        scaleLabel: {
          display: false
        }
      }
    });
    ChartJsProvider.setOptions('Line', {
      datasetFill: false
    });
    ChartJsProvider.setOptions('bar', {
      tooltips: {
        enabled: false
      }
    });

  }

})();
