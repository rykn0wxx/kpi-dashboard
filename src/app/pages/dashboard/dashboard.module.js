/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        template: '<div ui-view="" autoscroll="true" autoscroll-body-top="></div>',
        title: 'Executive KPI',
        sidebarMeta: {
          icon: 'ion-android-home',
          order: 0
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
      });
  }

})();
