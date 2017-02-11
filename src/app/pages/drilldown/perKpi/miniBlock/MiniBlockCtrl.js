/**
 * @author rykn0wxx
 * created on 03 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown')
    .controller('MiniBlockCtrl', MiniBlockPageCtrl);

  /** @ngInject */
  function MiniBlockPageCtrl ($scope, $window, $rootScope, $timeout, $stateParams) {
    var _ = $window._;
    var icons = ['fa-recycle','fa-eraser','fa-file-movie-o','fa-bar-chart-o','fa-camera-retro','fa-table','fa-coffee','fa-flag','fa-life-ring','fa-ban','fa-mobile-phone','fa-bookmark-o','fa-wheelchair','fa-thumbs-up','fa-keyboard-o','fa-expand','fa-weixin','fa-leanpub','fa-quote-left','fa-bicycle'];
    var regions = ['APAC','EMEA','North America','LATAM'];
    $scope.forInfoBox = [];
    $scope.state = $stateParams;

    // Gen random data for region
    var cloneIcons = _.cloneDeep(icons);
    _.forEach(regions, function (region) {
      var tmp = _.sample(cloneIcons);
      $scope.forInfoBox.push({
        name: region,
        data: _.random(10,1000),
        icon: tmp
      });
      _.remove(cloneIcons, function(v) { return v === tmp; });
    });

    $scope.curMonth = $rootScope.curMonth;


  }

})();
