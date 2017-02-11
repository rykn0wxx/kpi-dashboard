/**
 * @author rykn0wxx
 * created on 06 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
  .provider('DataProvider', DataProviderFunction);

  function DataProviderFunction () {
    var _ = window._;
    var d3 = window.d3;
    var ndx = window.crossfilter;

    var Configurer = {};
    Configurer.init = function (object, config) {
      object.configuration = config;

      // Setting for base url
      config.baseUrl = _.isUndefined(config.baseUrl) ? '/' : config.baseUrl;
      object.setBaseUrl = function(newBaseUrl) {
  			config.baseUrl = /\/$/.test(newBaseUrl) ?
  			newBaseUrl.substring(0, newBaseUrl.length-1) : newBaseUrl;
  			return this;
  		};

      // Config for working env
      var defEnv = ['env', 'dist', 'prod'];
      config.env = 'dev';
      object.setEnv = function (newEnv) {
        if (!_.isUndefined(newEnv)) {
          config.env = _.includes(defEnv, newEnv.toLowerCase()) ?
          config.env = newEnv.toLowerCase() : config.env;
          return this;
        }
      }

      // Config for month names
      config.shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    };

    var globalConfiguration = {};

    Configurer.init(this, globalConfiguration);

    this.$get = ['$http', '$q', function ($h, $q) {

      function createServiceForConfigurer (config) {
        var service = {};
        var apiPath = 'localhost:3000';

        var apiDataTypes = [
          function (valToCheck) {
            return (!_.isNaN(_.toNumber(valToCheck))) ? 'numeric' : null;
          },
          function (valToCheck) {
            var tdate = Date.parse(valToCheck);
            return ('Invalid Date' === tdate || null === tdate || isNaN(tdate) || valToCheck.length < 5 || undefined === valToCheck.length ) ? null : 'date';
          },
          function (valToCheck) {
            return (_.isString(valToCheck) || _.isNaN(_.toNumber(valToCheck))) ? 'string' : null;
          }
        ];

        Date.prototype.yyyymmm = function () {
  				var yyyy = this.getFullYear().toString(),
  					mm = (this.getMonth()).toString();
  				return yyyy + '-' + config.shortMonth[mm];
  			};

        function detectDataType (dataToCheck) {
          var o;
          _.forEach(apiDataTypes, function (val) {
            var tmp = val(dataToCheck);
            if (!_.isNull(tmp)) {
              o = tmp;
            }
          });
          return o;
        }

        function simpleDataCleaner (dataArray, toClean) {
          if (!dataArray) { return []; }
          _.map(dataArray, function(v, i) {
            _.map(v, function (val, key) {

              if (toClean) {
                var dType = detectDataType(val);
                if (dType === 'date') {
                  val = '' + val.toDateString();
                } else if (dType === 'numeric') {
                  val = +_.toNumber(val);
                }
              }
              if (_.camelCase(key) !== key) {
                v[_.camelCase(key)] = val;
                delete v[key];
              } else {
                v[key] = val;
              }
            });
          });
          return dataArray;
        }

        function retrieveData (uriRoute, toClean) {
          if (!uriRoute) {
            return [];
          }
          var defer = $q.defer();
          d3.json(config.baseUrl + '/' + uriRoute)
            .header('Accept', 'application/vnd.api+json')
            .header('Content-Type', 'application/vnd.api+json')
            .get(function (error, response) {
              defer.resolve(simpleDataCleaner(response, toClean));
            });
          return defer.promise;
        }

        function initSrvce () {
          console.log('run initSrvce');
          var pClient = retrieveData('clients');
          var pRegion = retrieveData('regions');
          var pData = retrieveData('rawexecs', true);
          var coll = $q.all({
            zClient:pClient,
            zRegion:pRegion,
            zData:pData
          }).then(function (data) {
            return data;
          });
          return coll;
        }

        function mapData (objData) {
          var tmpId = null;
          var df = d3.time.format('%m/%d/%Y');
          _.map(objData.zData, function (val, ind) {
            tmpId = _.filter(objData.zClient, ['id', val.clientId])[0].regionId;
            val.clientName = _.filter(objData.zClient, ['id', val.clientId])[0].code;
            val.regionName = _.filter(objData.zRegion, ['id', tmpId])[0].name;
            val.global = 'global';
            val.zDate = df.parse(val.repmonth);
          });
          return objData;
        }
        initSrvce().then(function (data) {
          service.appData = mapData(data);
          console.log(service);
        });

        Configurer.init(service, config);

        service.retrieveData = _.bind(retrieveData, service);

        return service;

      }

      return createServiceForConfigurer(globalConfiguration);

    }];

  }

})();
