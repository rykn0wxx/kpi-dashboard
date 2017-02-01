/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('zCurrency', toCurrency);

  /** @ngInject */
  function toCurrency($filter) {
    var _ = window._;
    return function(input) {
      return  angular.isNumber(input) ? $filter('currency')(_.round(input),'$',0): input;
    };
  }

})();
