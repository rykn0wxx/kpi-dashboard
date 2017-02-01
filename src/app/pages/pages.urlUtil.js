/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages')
    .factory('urlUtil', urlUtilFactory);

  /** @ngInject */
  function urlUtilFactory ($q, $http, $window) {
    var d3 = $window.d3;
    var _ = $window._;

    function cleanData (respObj) {
      var convData = [];
      var tmpMonth = new Date();
      _.forEach(respObj, function(val, ind) {
        var tmp = {};
        _.map(val, function(v, k) {
          if (k.indexOf('month') !== -1) {
            tmpMonth = new Date(((v - (25567+1))*86400*1000)-72000000);
            tmp[_.camelCase(k)] = d3.time.month(tmpMonth);
          } else {
            tmp[_.camelCase(k)] = v;
          }
        });
        convData.push(tmp);
			});
      // _.forEach(convData, function(val, ind) {
      //   var tmpMonth = new Date(((val.repmonth-(25567+1))*86400*1000)-72000000);
			// 	val.repmonth = d3.time.month(tmpMonth);
			// });
      return convData;
    }

    return {

      getJson : function getJsonFunc (fileName) {
        if (_.isUndefined(fileName)) {
  				return [];
  			}

        var defer = $q.defer();

        $http({
          method: 'GET',
          url: 'http://localhost:3000/' + fileName,
          headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          }
        }).then(function (resp) {
          defer.resolve(cleanData(resp.data));
        });

        return defer.promise;
      }
    };

  }
})();
