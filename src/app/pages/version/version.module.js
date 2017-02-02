/**
 * @author k.danovsky
 * created on 12.01.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.version', [
    'BlurAdmin.pages.version.executive'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('trending', {
          url: '/trending',
          template : '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
          abstract: true,
          title: 'Trending',
          sidebarMeta: {
            icon: 'ion-android-laptop',
            order: 200,
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
