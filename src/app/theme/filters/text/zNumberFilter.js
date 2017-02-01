/**
 * @author rykn0wxx
 * created on 31 01 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .filter('zNumber', toNumber);

  /** @ngInject */
  function toNumber() {
    var _ = window._;
    return function(input) {
      return  angular.isNumber(input) ? _.round(input): input;
    };
  }

})();
