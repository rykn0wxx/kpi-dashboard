/**
 * @author rykn0wxx
 * created on 15 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.custom', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
			.state('custom', {
				url: '/custom',
				templateUrl: 'app/pages/custom/custom.html',
				title: 'Custom View',
				sidebarMeta: {
					icon: 'ion-android-laptop',
					order: 1000,
				},
        resolve: {
          collection: function (restFactory, $q) {
            var defer = $q.defer();
            restFactory.all('executives').getList().then(function(dta) {
              defer.resolve(dta.plain());
            });
            return defer.promise;
          }
        },
        controller: function customCtrl ($scope, $window, collection) {
          var ndx = $window.crossfilter;
          var _ = $window._;
          var d3 = $window.d3;
          var data = collection
          var dateFormat = d3.time.format('%m/%d/%Y');
          _.map(data, function (row, ind) {
            row.id = ind;
            row.dd = dateFormat.parse(row.repmonth);
            row.month = d3.time.month(row.dd);
            row.year = d3.time.year(row.dd).getFullYear();
          });
          $scope.collection = ndx(data);
        }
			});
  }

})();
