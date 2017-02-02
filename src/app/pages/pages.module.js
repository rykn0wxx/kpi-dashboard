/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',
    'chart.js',

    'BlurAdmin.pages.init',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.version'
  ])
      .config(routeConfig).config(chartJsConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/dashboard');
  }
  function chartJsConfig (ChartJsProvider, baConfigProvider) {
    var layoutColors = baConfigProvider.colors;
    ChartJsProvider.setOptions({
      // chartColors: [
      //   layoutColors.primary, layoutColors.danger, layoutColors.warning, layoutColors.success, layoutColors.info, layoutColors.default, layoutColors.primaryDark, layoutColors.successDark, layoutColors.warningLight, layoutColors.successLight, layoutColors.primaryLight
      // ],
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
    ChartJsProvider.setOptions('line', {
      datasetFill: false
    });
    ChartJsProvider.setOptions('bar', {
      tooltips: {
        enabled: false
      }
    });
  }

})();
