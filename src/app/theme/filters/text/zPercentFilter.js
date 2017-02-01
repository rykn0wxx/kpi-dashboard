/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('zPercent', toPercent);

  /** @ngInject */
  function toPercent() {
    var _ = window._;
    return function(input) {
      return  angular.isNumber(input) ? _.round(_.multiply(input, 100),2) + '%' : input;
    };
  }

})();
