/**
 * @author rykn0wxx
 * created on 01 02 2017
 */

(function () {
  'use strict';

  angular.module('BlurAdmin.theme.restangular', ['restangular'], function(RestangularProvider) {
    RestangularProvider.setDefaultHeaders({
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      cache: true
    });
    RestangularProvider.setBaseUrl('http://localhost:3000');
  })
  .factory('resties', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id : 'id'
      });
    });
  }])
  .service('deService', function() {
    this.called = function () {
      console.log('deService called');
    };
    return this;
  });
})();

//
  // angular.module('BlurAdmin.theme')
  // .factory('resties', ['Restangular', function(Restangular) {
  //   return Restangular.withConfig(function (RestangularConfigurer) {
  //     RestangularConfigurer.setRestangularFields({
  //       id : 'id'
  //     });
  //   });
  // }]);
//   .factory('cmRest', ['resties', function(resties) {
//     return resties;
//   }])
//   .provider('appData', AppDataFunction);
//
//   function AppDataFunction () {
//     var ndx = window.crossfilter;
//     var _ = window._;
//     var d3 = window.d3;
//     var acc = window.accounting;
//
//     var Configurer = {};
//     Configurer.init = function (object, config) {
//       object.configuration = config;
//
//       config.ndx = ndx;
//       config._ = _;
//       config.d3 = d3;
//       config.acc = acc;
//
//     };
//     var globalConfiguration = {};
//     Configurer.init(this, globalConfiguration);
//
//     this.$get = ['$http', '$q', 'resties', '$window', function ($h, $q, resties, $w) {
//
//
//       function createServiceForConfigurer (config) {
//
//         var ndx = $w.crossfilter;
//         var _ = $w._;
//         var d3 = $w.d3;
//         var acc = $w.accounting;
//
//         var service = {};
//
//         var pClient = resties.all('clients').getList();
//         var pRegion = resties.all('regions').getList();
//         var pData = resties.all('rawexecs').getList();
//         var pCollections = getCollections();
//
//         var ndx = {
//           dimension: function (val, typ) {
//             var typer = {
//               d: function (d) { return dateFormat.parse(d[val]); },
//               n: function (d) { return _.number(d[val]); },
//               s: function (d) { return  '' + d[val]; }
//             };
//             return typer[typ];
//           },
//           grpAdd: function grpAdd (p, v) {
//             ++p.count;
//             p.ebit += +v.ebitDollar;
//             p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
//             p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
//             p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;
//
//             p.revenue += +v.revenueDollar;
//             p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
//             p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
//             p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;
//
//             p.ebitPercent = (p.ebit/p.revenue) * 100;
//             p.ebitPercentScore = p.ebitScore / p.revenueScore;
//
//             p.expense = p.revenue - p.ebit;
//             p.avgExpense = p.expense / p.count;
//
//             p.tktVolume += +v.ticketVolume;
//             p.avgTktVolume = p.tktVolume / p.count;
//
//             p.tktFte += +v.fte;
//             p.avgTktFte = p.tktFte / p.count;
//
//             p.iph = p.tktVolume/p.tktFte;
//
//             p.costPerTkt = p.expense / p.tktVolume;
//             p.ebitPerTkt = p.ebit / p.tktVolume;
//             p.revPerHead = p.revenue / p.tktFte;
//             return p;
//           },
//           grpRemove: function (p, v) {
//             --p.count;
//             p.ebit -= +v.ebitDollar;
//             p.ebitMin = Math.min(p.ebitMin, v.ebitDollar);
//             p.ebitMax = Math.max(p.ebitMax, v.ebitDollar);
//             p.ebitScore = Math.round((( v.ebitDollar - p.ebitMin) / (p.ebitMax - p.ebitMin))*100) / 100;
//
//             p.revenue -= +v.revenueDollar;
//             p.revenueMin = Math.min(p.revenueMin, v.revenueDollar);
//             p.revenueMax = Math.max(p.revenueMax, v.revenueDollar);
//             p.revenueScore = Math.round((( v.revenueDollar - p.revenueMin) / (p.revenueMax - p.revenueMin))*100) / 100;
//
//             p.ebitPercent = (p.ebit/p.revenue) * 100;
//             p.ebitPercentScore = p.ebitScore / p.revenueScore;
//
//             p.expense = p.revenue - p.ebit;
//             p.avgExpense = p.expense / p.count;
//
//             p.tktVolume -= +v.ticketVolume;
//             p.avgTktVolume = p.tktVolume / p.count;
//
//             p.tktFte -= +v.fte;
//             p.avgTktFte = p.tktFte / p.count;
//
//             p.iph = p.tktVolume / p.tktFte;
//
//             p.costPerTkt = p.expense / p.tktVolume;
//             p.ebitPerTkt = p.ebit / p.tktVolume;
//             p.revPerHead = p.revenue / p.tktFte;
//             return p;
//           },
//           grpBase: function () {
//             return {
//               count: 0,
//               ebit: 0,
//               ebitMin: 0,
//               ebitMax: 0,
//               ebitScore: 0,
//
//               revenue: 0,
//               revenueMin: 0,
//               revenueMax: 0,
//               revenueScore: 0,
//
//               ebitPercent: 0,
//               ebitPercentScore: 0,
//
//               expense: 0,
//               avgExpense: 0,
//
//               tktVolume: 0,
//               avgTktVolume: 0,
//
//               tktFte: 0,
//               avgTktFte: 0,
//
//               iph: 0,
//
//               costPerTkt: 0,
//               ebitPerTkt: 0,
//               revPerHead: 0
//             };
//           },
//           grpAddWithTrend: function (dteGrp) {
//             var o = this;
//             return function (p, v) {
//               var c = dateFormat.parse(v[dteGrp]).yyyymmm();
//               p[c] = p[c] ||  {};
//
//               ++p[c].count;
//               if (_.isUndefined(p[c].init)) {
//                 p[c] =grpBase();
//                 p[c].init = true;
//               }
//               p[c] = o.grpAdd(p[c], v);
//               return p;
//             };
//           },
//           grpRemoveWithTrend: function (dteGrp) {
//             var o = this;
//             return function (p, v) {
//               var c = dFormat.parse(v[dteGrp]).yyyymmm();
//               p[c] = p[c];
//               p[c] = o.grpRemove(p[c], v);
//               return p;
//             };
//           }
//         };
//
//         function getCollections () {
//           var coll = $q.all({
//             zClient:pClient,
//             zRegion:pRegion,
//             zData:pData
//           }).then(function (data) {
//             return data;
//           });
//           return coll;
//         }
//
//         function processCollection (collection) {
//           var tmpId = null;
//           var df = d3.time.format('%m/%d/%Y');
//           _.map(collection.zData, function (val, ind) {
//             tmpId = _.filter(collection.zClient, ['id', val.clientId])[0].regionId;
//             val.clientName = _.filter(collection.zClient, ['id', val.clientId])[0].code;
//             val.regionName = _.filter(collection.zRegion, ['id', tmpId])[0].name;
//             val.global = 'global';
//             val.zDate = df.parse(val.repmonth);
//           });
//           return this;
//         }
//
//         service.ndx = ndx(service.processCollection);
//
//         Configurer.init(service, config);
//
//         getCollections().then(function(data) {
//           service.pCollections = data;
//         });
//
//         service.processCollection = _.bind(processCollection, service);
//
//
//
//         return service;
//       }
//       return createServiceForConfigurer(globalConfiguration);
//     }];
//   }
//   // .provider('applData', [function (resties, $w, $q) {
//   //   var ndx = $w.crossfilter;
//   //   var _ = $q._;
//   //   var d3 = $w.d3;
//   //   var acc = $w.accounting;
//   //   var pClient = resties.all('clients').getList();
//   //   var pRegion = resties.all('regions').getList();
//   //   var pData = resties.all('rawexecs').getList();
//   //   var appService = {};
//   //
//   //   function getCollections () {
//   //     var coll = $q.all({
//   //       zClient:pClient,
//   //       zRegion:pRegion,
//   //       zData:pData
//   //     }).then(function (data) {
//   //       return data;
//   //     });
//   //   }
//   //
//   //   function processCollections (collection) {
//   //     console.log(collection);
//   //   }
//   //
//   //   appService.getCollections = _.bind(getCollections, appService);
//   //   appService.processCollections = _.bind(processCollections, appService);
//   //
//   //
//   //   // this.allData = function (collection) {
//   //   //   var tmpId = null;
//   //   //   var df = d3.time.format('%m/%d/%Y');
//   //   //   _.map(collection.zData, function (val, ind) {
//   //   //     tmpId = _.filter(collection.zClient, ['id', val.clientId])[0].regionId;
//   //   //     val.clientName = _.filter(collection.zClient, ['id', val.clientId])[0].code;
//   //   //     val.regionName = _.filter(collection.zRegion, ['id', tmpId])[0].name;
//   //   //     val.global = 'global';
//   //   //     val.zDate = df.parse(val.repmonth);
//   //   //   });
//   //   // }
//   //
//   //   return appService;
//   // }]);
// })();
