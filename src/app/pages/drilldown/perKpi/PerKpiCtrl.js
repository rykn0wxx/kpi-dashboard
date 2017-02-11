/**
 * @author rykn0wxx
 * created on 03 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.pages.drilldown.perKpi')
  .controller('PerKpiCtrl', PerKpiPageCtrl);

  function PerKpiPageCtrl ($scope, $window, $rootScope, $timeout, metrics, calcUtil, $stateParams) {
    var o = this;
    o.$scope = $scope;

    $scope.metricsTableData = [
        {
          image: 'app/browsers/chrome.svg',
          browser: 'Google Chrome',
          visits: '10,392',
          isVisitsUp: true,
          purchases: '4,214',
          isPurchasesUp: true,
          percent: '45%',
          isPercentUp: true
        },
        {
          image: 'app/browsers/firefox.svg',
          browser: 'Mozilla Firefox',
          visits: '7,873',
          isVisitsUp: true,
          purchases: '3,031',
          isPurchasesUp: false,
          percent: '28%',
          isPercentUp: true
        },
        {
          image: 'app/browsers/ie.svg',
          browser: 'Internet Explorer',
          visits: '5,890',
          isVisitsUp: false,
          purchases: '2,102',
          isPurchasesUp: false,
          percent: '17%',
          isPercentUp: false
        },
        {
          image: 'app/browsers/safari.svg',
          browser: 'Safari',
          visits: '4,001',
          isVisitsUp: false,
          purchases: '1,001',
          isPurchasesUp: false,
          percent: '14%',
          isPercentUp: true
        },
        {
          image: 'app/browsers/opera.svg',
          browser: 'Opera',
          visits: '1,833',
          isVisitsUp: true,
          purchases: '83',
          isPurchasesUp: true,
          percent: '5%',
          isPercentUp: false
        }
      ];

  }

  // PerKpiPageCtrl.$inject = ['$scope', '$stateParams'];

})();
