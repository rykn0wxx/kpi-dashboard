
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.datacube', ['restangular', 'ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns',  'ui.grid.grouping', 'ui.grid.pagination' ])
  .config(['RestangularProvider', function (ngRest) {
    ngRest.setDefaultHeaders({
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      cache: true
    });
    ngRest.setBaseUrl('http://172.19.7.36:3000');
    //ngRest.setBaseUrl('http://localhost:3000');
  }])
  .factory('restFactory', ['Restangular', function (ngRest) {
    return ngRest.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id : 'id'
      });
    });
  }])
  .provider('Datacube', [function () {
    var ndx = window.crossfilter;
    var _ = window._;
    var d3 = window.d3;

  	var maincube = {};
    maincube.init = function (object, config) {

      object.configuration = config;

      config.shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      config.ndx = null;

      config.sourceData = config.sourceData || [];

      config.dimensions = config.dimensions || [];

      config.activeGroup = config.activeGroup || [];

      config.activeFilters = config.activeFilters || [];

      Date.prototype.yyyymmm = function () {
        var yyyy = this.getFullYear().toString(),
          mm = (this.getMonth()).toString();
        return yyyy + '-' + config.shortMonth[mm];
      };

      Date.prototype.y2m3 = function () {
        var yyyy = this.getFullYear().toString(),
          mm = (this.getMonth()).toString();
        return yyyy.slice(2) + '-' + config.shortMonth[mm];
      };

      var BaseX = function () {};
      BaseX.prototype.init = function (baseConfig) {
        this.config = baseConfig;
        return this;
      };

      config.baseFactoryCreator = BaseX;
    };

    var globalConfiguration = {};

    maincube.init(this, globalConfiguration);

  	// Method for instantiating
  	this.$get = ['restFactory', '$q', '$timeout', function (restFactory, $q, $t) {
  		function createServiceConfig (config) {
  		  var service = {};
        var dateFormat = d3.time.format('%m/%d/%Y');
        var baseFactory = new config.baseFactoryCreator();
        baseFactory.init(config);

        // data types
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

        // converting data to crossfilter
        function createNdx (data) {
          if (config.ndx !== null) {
            config.ndx.remove();
          }
          config.sourceData = data.plain();
          config.ndx = ndx(data.plain());
          return config;
        }

        // getting data and converting it to crossfilter
        function getData (path) {
          if (!path) {
            return [];
          }
          var defer = $q.defer();
          restFactory.all(path).getList().then(function(dta) {
            defer.resolve(createNdx(dta));
          });
          return defer.promise;
        }

        // helper to check data type
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

        // reduce add function
        function grpAdd (p, v) {
          ++p.count;
          p.ebit += +v.ebit;
          p.ebitMin = Math.min(p.ebitMin, v.ebit);
          p.ebitMax = Math.max(p.ebitMax, v.ebit);
          p.ebitScore = Math.round((( v.ebit - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

          p.revenue += +v.revenue;
          p.revenueMin = Math.min(p.revenueMin, v.revenue);
          p.revenueMax = Math.max(p.revenueMax, v.revenue);
          p.revenueScore = Math.round((( v.revenue - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

          p.ebitPercent = (p.ebit/p.revenue) * 100;
          p.ebitPercentScore = p.ebitScore / p.revenueScore;

          p.expense = p.revenue - p.ebit;
          p.avgExpense = p.expense / p.count;

          p.tktVolume += +v.ticket;
          p.avgTktVolume = p.tktVolume / p.count;

          p.tktFte += +v.fte;
          p.avgTktFte = p.tktFte / p.count;

          p.iph = p.tktVolume/p.tktFte;

          p.costPerTkt = p.expense / p.tktVolume;
          p.ebitPerTkt = p.ebit / p.tktVolume;
          p.revPerHead = p.revenue / p.tktFte;
          return p;
        }

        // reduce remove function
        function grpRemove (p, v) {
          --p.count;
          p.ebit -= +v.ebit;
          p.ebitMin = Math.min(p.ebitMin, v.ebit);
          p.ebitMax = Math.max(p.ebitMax, v.ebit);
          p.ebitScore = Math.round((( v.ebit - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;

          p.revenue -= +v.revenue;
          p.revenueMin = Math.min(p.revenueMin, v.revenue);
          p.revenueMax = Math.max(p.revenueMax, v.revenue);
          p.revenueScore = Math.round((( v.revenue - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;

          p.ebitPercent = (p.ebit/p.revenue) * 100;
          p.ebitPercentScore = p.ebitScore / p.revenueScore;

          p.expense = p.revenue - p.ebit;
          p.avgExpense = p.expense / p.count;

          p.tktVolume -= +v.ticket;
          p.avgTktVolume = p.tktVolume / p.count;

          p.tktFte -= +v.fte;
          p.avgTktFte = p.tktFte / p.count;

          p.iph = p.tktVolume / p.tktFte;

          p.costPerTkt = p.expense / p.tktVolume;
          p.ebitPerTkt = p.ebit / p.tktVolume;
          p.revPerHead = p.revenue / p.tktFte;
          return p;
        }

        // reduce base
        function grpBase () {
          return {
            count: 0,
            ebit: 0,
            ebitMin: 0,
            ebitMax: 0,
            ebitScore: 0,

            revenue: 0,
            revenueMin: 0,
            revenueMax: 0,
            revenueScore: 0,

            ebitPercent: 0,
            ebitPercentScore: 0,

            expense: 0,
            avgExpense: 0,

            tktVolume: 0,
            avgTktVolume: 0,

            tktFte: 0,
            avgTktFte: 0,

            iph: 0,

            costPerTkt: 0,
            ebitPerTkt: 0,
            revPerHead: 0
          }
        }

        // add dimension
        function addDimension (dimName, dimFld, dimType) {
          var dimCreator = function (val, typ) {
            var typer = {
              d: function (d) { return dateFormat.parse(d[val]); },
              n: function (d) { return _.number(d[val]); },
              s: function (d) { return  '' + d[val]; }
            };
            return typer[typ];
          };
          var dim = config.ndx.dimension(dimCreator(dimFld, dimType));
          config.dimensions.push({
            name: dimName,
            fld: dimFld,
            dimension: dim
          });
          return dim;
        }

        function addFilter (dimName, filterFn) {
          var dName = _.filter(config.dimensions, ['name', dimName])[0].dimension;
          dName.filterFunction(filterFn);
          if (!_.includes(config.activeFilters, dimName)) {
            config.activeFilters.push(dimName);
          }
          return config;
        }

        function addGroup (grpName, grpFunc) {
          config.activeGroup.push({
            name: grpName,
            group: grpFunc
          });
          return grpFunc;
        }

        function getDimension (dimName) {
          return _.filter(config.dimensions, ['name', dimName])[0].dimension;
        }

        function getGroup (grpName) {
          return _.filter(config.activeGroup, ['name', grpName])[0].group;
        }

        maincube.init(service, config);

        service.createNdx = _.bind(createNdx, service);
        service.getData = _.bind(getData, service);
        service.detectDataType = _.bind(detectDataType, service);
        service.grpAdd = _.bind(grpAdd, service);
        service.grpRemove = _.bind(grpRemove, service);
        service.grpBase = _.bind(grpBase, service);
        service.addDimension = _.bind(addDimension, service);
        service.addFilter = _.bind(addFilter, service);
        service.addGroup = _.bind(addGroup, service);
        service.getGroup = _.bind(getGroup, service);
        service.getDimension = _.bind(getDimension, service);


        return service;
  		}
      return createServiceConfig(globalConfiguration);
  	}];
  }])
  .service('dataService', ['Datacube', '$window', function (dc, $w) {
    var o = this;
    var ndx = $w.crossfilter;
    var d3 = $w.d3;
    var dFormat = d3.time.format('%m/%d/%Y');
    function isolatedVal (obj) {
      var tmpX = ndx(obj);
      var dGlb = tmpX.dimension(function(d) {return d.global;});
      var dReg = tmpX.dimension(function(d) {return d.region_name;});
      // var dCli = tmpX.dimension(function(d) {return d.client_name;});
      o.perGlobal = dGlb.group().reduce(
        function (p, v) {
          var c = dFormat.parse(v.repmonth).yyyymmm();
          p[c] = p[c] ||  {};
          ++p[c].count;
          if (_.isUndefined(p[c].init)) {
            p[c] = dc.grpBase();
            p[c].init = true;
          }
          p[c] = dc.grpAdd(p[c], v);
          p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
          return p;
        },
        function (p, v) {
          var c = dFormat.parse(v.repmonth).yyyymmm();
          p[c] = p[c];
          --p[c].count;
          p[c] = dc.grpRemove(p[c], v);
          p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
          return p;
        },
        function () { return {}; }
      );
      o.perRegion = dReg.group().reduce(
        function (p, v) {
          var c = dFormat.parse(v.repmonth).yyyymmm();
          p[c] = p[c] ||  {};
          ++p[c].count;
          if (_.isUndefined(p[c].init)) {
            p[c] = dc.grpBase();
            p[c].init = true;
          }
          p[c] = dc.grpAdd(p[c], v);
          p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
          return p;
        },
        function (p, v) {
          var c = dFormat.parse(v.repmonth).yyyymmm();
          p[c] = p[c];
          --p[c].count;
          p[c] = dc.grpRemove(p[c], v);
          p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
          return p;
        },
        function () { return {}; }
      );
      // o.perClient = dCli.group().reduce(
      //   function (p, v) {
      //     var c = dFormat.parse(v.repmonth).yyyymmm();
      //     p[c] = p[c] ||  {};
      //     ++p[c].count;
      //     if (_.isUndefined(p[c].init)) {
      //       p[c] = dc.grpBase();
      //       p[c].init = true;
      //     }
      //     p[c] = dc.grpAdd(p[c], v);
      //     p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
      //     return p;
      //   },
      //   function (p, v) {
      //     var c = dFormat.parse(v.repmonth).yyyymmm();
      //     p[c] = p[c];
      //     --p[c].count;
      //     p[c] = dc.grpRemove(p[c], v);
      //     p[c].orderMonth = _.sum([dFormat.parse(v.repmonth).getFullYear(), dFormat.parse(v.repmonth).getMonth()]);
      //     return p;
      //   },
      //   function () { return {}; }
      // );
    }
    dc.getData('executives').then(function (dd) {
      o.source = dd.sourceData;
      o.all = dc.addGroup('all', dd.ndx.groupAll());
      o.dimMonth = dc.addDimension('dimMonth', 'repmonth', 'd');
      o.grpMonth = dc.addGroup('grpMonth', o.dimMonth.group());

      o.dimRegion = dc.addDimension('dimRegion', 'region_name', 's');
      o.grpRegion = dc.addGroup('grpRegion', o.dimRegion.group());
      o.oneRegion = dc.addGroup('oneRegion', o.dimRegion.group().reduce(dc.grpAdd, dc.grpRemove, dc.grpBase));

      o.dimGlobal = dc.addDimension('dimGlobal', 'global', 's');
      o.grpGlobal = dc.addGroup('grpGlobal', o.dimGlobal.group());
      o.oneGlobal = dc.addGroup('oneGlobal', o.dimGlobal.group().reduce(dc.grpAdd, dc.grpRemove, dc.grpBase));

      o.dimClient = dc.addDimension('dimClient', 'client_name', 's');
      o.grpClient = dc.addGroup('grpClient', o.dimClient.group());
      o.oneClient = dc.addGroup('oneClient', o.dimClient.group().reduce(dc.grpAdd, dc.grpRemove, dc.grpBase));

      isolatedVal(dd.sourceData);
    });
    o.dc = dc;
  }])
  .run(['dataService', function (dataService) {
    console.log(dataService);
  }]);

})();
