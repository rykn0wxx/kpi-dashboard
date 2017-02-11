/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .directive('jqSpark', JqSparkDirective);

  /** @ngInject */

  function JqSparkDirective($timeout, $window) {
    var $ = $window.jQuery;
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        data: '='
      },
      link: function (scope, elem, attr, ngModel) {
        var o = this;
        o.timeout = null;
        o.$timeout = $timeout;

        var opts = {
          height: '70',
          barWidth: 15,
          barSpacing: 5,
          barColor: '#3366ce',
          negBarColor: '#undefined ',
          zeroColor: '#'
        };
        opts.type = attr.type || 'bar';

        scope.$watch('data', function (nV, nO, sC) {
          if (nV !==  nO) {
            render();
          }
        });

        scope.$watch(attr.opts, function (nV, nO, sC) {
          if (nV !==  nO ) {
            render();
          }
          
        });

        var clsOut = function () {
          if (o.timeout) {
            o.$timeout.cancel(o.timeout);
            o.timeout = null;
          }
        };

        var render = function () {
          var model;
          if (attr.opts) {
            angular.extend(opts, angular.fromJson(attr.opts));
          }
          // angular.isString(ngModel.$viewValue) ?
          //   model = ngModel.$viewValue.replace(/(^,)|(,$)/g, '') :
          //   model = ngModel.$viewValue;
          model = angular.isString(ngModel.$viewValue) ?
            ngModel.$viewValue.replace(/(^,)|(,$)/g, '') : ngModel.$viewValue;

          var data = angular.isArray(model) ? model : model.split(',');
          o.timeout = o.$timeout(function () {
            $(elem).sparkline(data, opts);
          }, 300, false);
        };
      }
    };
  }

  JqSparkDirective.$inject = ['$timeout', '$window'];

})();
