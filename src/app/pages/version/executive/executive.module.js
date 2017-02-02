/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version.executive', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('trending.executive', {
        url: '/executive',
        templateUrl: 'app/pages/version/executive/executive.html',
        title: 'Executive',
        sidebarMeta: {
          order: 0,
        },
        resolve: {
          collection: function (urlUtil, $q) {
            var pClient = urlUtil.getJson('clients');
            var pRegion = urlUtil.getJson('regions');
            var pData = urlUtil.getJson('rawexecs');
            var mycollection = $q.all({
              zClient:pClient,
              zRegion:pRegion,
              zData:pData
            }).then(function (data) {
              return data;
            });
            return mycollection;
          }
        }
      })
      .state('trending.executive.kpi', {
        url: '/{type}',
        templateUrl: 'app/pages/version/executive/currentPerformance/currentKpi.html',
        controller: 'CurrentKpiCtrl',
        title: 'KPI'
      });
  }

})();
