/**
 * @author rykn0wxx
 * created on 31 01 2016
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .constant('toTitleCase', toTitleCase)
    .filter('toTitleCase', toTitleCaseFilter);

  /** @ngInject */
  function toTitleCase(string) {
    var out = string.replace(/^\s*/, '');  // strip leading spaces
    out = out.replace(/^[a-z]|[^\s][A-Z]/g, function(str, offset) {
      if (offset === 0) {
        return str.toUpperCase();
      } else {
        return str.substr(0, 1) + ' ' + str.substr(1).toUpperCase();
      }
    });

    return out;
  }
  function toTitleCaseFilter() {
    return function(input) {
      return toTitleCase(input);
    };
  }

})();
