/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';
  angular.module('BlurAdmin.pages.rest', [])
  .config(routeConfig);

  /** @ngInject */
  function routeConfig ($stateProvider) {
    $stateProvider
      .state('rest', {
        url: '/rest',
        templateUrl: 'app/pages/rest/rest.html',
        name: 'restdemo',
        title: 'Rest',
        sidebarMeta: {
          icon: 'ion-grid',
          order: 200
        },
        controller: 'RestCtrl',
        controllerAs: 'vmRest'
      })
      .state('rest.one', {
        url: '/one',
        templateUrl: 'app/pages/rest/restone/restone.html',
        name: 'restone',
        title: 'RestOne',
        controller: 'RestOneCtrl',
        controllerAs: 'vmRestOne'
      });
  }

})();
//   angular.module('BlurAdmin.rest', [])
//   .config(['$stateProvider', function ($stateProvider) {
//     $stateProvider
//       .state('demo', {
//         url: '/demo',
//         template: '<h3>Demo</demo>',
//         title: 'Demo',
//         sidebarMeta: {
//           icon: 'ion-android-laptop',
//           order: 200
//         },
//         controller: 'DemoCtrl',
//         controllerAs: 'vmDemo'
//       });
//   }])
//   .controller('DemoCtrl', ['$scope', function ($s) {
//     var o = this;
//     o.$s = $s;
//
//   }]);
// })();
// //
// // (function () {
// //   'use strict';
// //
// //   angular.module('BlurAdmin.rest', ['restangular'])
// //     .config(['RestangularProvider', '$stateProvider', function (resty, ngStates) {
// //       //resty.setBaseUrl('http://172.19.7.36:3000');
// //       resty.setDefaultHeaders({
// //         'Accept': 'application/vnd.api+json',
// //         'Content-Type': 'application/vnd.api+json',
// //         cache: true
// //       });
// //       resty.setBaseUrl('http://localhost:3000');
// //       ngStates
// //       .state('demo', {
// //         url: '/demo',
// //         template : '<h4>demo</h4>',
// //         title: 'Demo',
// //         sidebarMeta: {
// //           icon: 'ion-android-laptop',
// //           order: 200
// //         },
// //         controller: 'DemoCtrl',
// //         controllerAs: 'vmDemo'
// //       });
// //     }])
// //     .factory('MainRest', ['Restangular', function(Restangular) {
// //       return Restangular.withConfig(function (RestangularConfigurer) {
// //         RestangularConfigurer.setRestangularFields({
// //           id : 'id'
// //         });
// //       });
// //     }])
// //     .factory('DemoRest', ['MainRest', function (MainRest) {
// //       console.log(MainRest.all());
// //       return MainRest.service('clients');
// //     }])
// //     .controller('DemoCtrl', ['$scope', 'DemoRest', function ($s, de) {
// //       var o = this;
// //       o.$s = $s;
// //       o.demo = de;
// //       console.log(de.getList());
// //     }]);
// // })();
