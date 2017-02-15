/**
 * @author rykn0wxx
 * created on 06 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .factory('urlUtil', urlUtilFactory);

  /** @ngInject */
  function urlUtilFactory ($q, $http, $window) {
    var d3 = $window.d3;
    var _ = $window._;
    var envCons = {
      dev: 'localhost:3000',
      own: '172.19.7.101:3000',
      dst: '172.19.7.36:3000'
    }; 

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

      getJson : function getJsonFunc (fle, en) {
        if (_.isUndefined(fle)) {
  				return [];
  			}

        var defer = $q.defer();
        var selEnv = en ? envCons[en] : envCons.dev;

        $http({
          method: 'GET',
          url: 'http://' + selEnv + '/' + fle,
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
