/**
 * @author rykn0wxx
 * created on 01 02 2017
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme')
    .factory('csmMedia', csmMediaFactory);

  /** @ngInject */
  function csmMediaFactory($rootScope, $window) {
    var queries = {};
    var mqls = {};
    var results = {};
    var normalizeCache = {};
    var kConstant = {
      MEDIA: {
        'xs'        : '(max-width: 599px)'                         ,
        'gt-xs'     : '(min-width: 600px)'                         ,
        'sm'        : '(min-width: 600px) and (max-width: 959px)'  ,
        'gt-sm'     : '(min-width: 960px)'                         ,
        'md'        : '(min-width: 960px) and (max-width: 1279px)' ,
        'gt-md'     : '(min-width: 1280px)'                        ,
        'lg'        : '(min-width: 1280px) and (max-width: 1919px)',
        'gt-lg'     : '(min-width: 1920px)'                        ,
        'xl'        : '(min-width: 1920px)'                        ,
        'landscape' : '(orientation: landscape)'                   ,
        'portrait'  : '(orientation: portrait)'                    ,
        'print' : 'print'
      },
      MEDIA_PRIORITY: [
        'xl',
        'gt-lg',
        'lg',
        'gt-md',
        'md',
        'gt-sm',
        'sm',
        'gt-xs',
        'xs',
        'landscape',
        'portrait',
        'print'
      ]
    };

    csmMedia.getResponsiveAttribute = getResponsiveAttribute;
    csmMedia.getQuery = getQuery;
    csmMedia.watchResponsiveAttributes = watchResponsiveAttributes;

    return csmMedia;

    function csmMedia(query) {
      var validated = queries[query];
      if (angular.isUndefined(validated)) {
        validated = queries[query] = validate(query);
      }

      var result = results[validated];
      if (angular.isUndefined(result)) {
        result = add(validated);
      }

      return result;
    }

    function validate(query) {
      return kConstant.MEDIA[query] ||
             ((query.charAt(0) !== '(') ? ('(' + query + ')') : query);
    }

    function add(query) {
      var result = mqls[query];
      if ( !result ) {
        result = mqls[query] = $window.matchMedia(query);
      }

      result.addListener(onQueryChange);
      return (results[result.media] = !!result.matches);
    }

    function onQueryChange(query) {
      $rootScope.$evalAsync(function() {
        results[query.media] = !!query.matches;
      });
    }

    function getQuery(name) {
      return mqls[name];
    }

    function getResponsiveAttribute(attrs, attrName) {
      for (var i = 0; i < kConstant.MEDIA_PRIORITY.length; i++) {
        var mediaName = kConstant.MEDIA_PRIORITY[i];
        if (!mqls[queries[mediaName]].matches) {
          continue;
        }

        var normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
        if (attrs[normalizedName]) {
          return attrs[normalizedName];
        }
      }

      // fallback on unprefixed
      return attrs[getNormalizedName(attrs, attrName)];
    }

    function watchResponsiveAttributes(attrNames, attrs, watchFn) {
      var unwatchFns = [];
      attrNames.forEach(function(attrName) {
        var normalizedName = getNormalizedName(attrs, attrName);
        if (angular.isDefined(attrs[normalizedName])) {
          unwatchFns.push(
              attrs.$observe(normalizedName, angular.bind(void 0, watchFn, null)));
        }

        for (var mediaName in $mdConstant.MEDIA) {
          normalizedName = getNormalizedName(attrs, attrName + '-' + mediaName);
          if (angular.isDefined(attrs[normalizedName])) {
            unwatchFns.push(
                attrs.$observe(normalizedName, angular.bind(void 0, watchFn, mediaName)));
          }
        }
      });

      return function unwatch() {
        unwatchFns.forEach(function(fn) { fn(); })
      };
    }

    // Improves performance dramatically
    function getNormalizedName(attrs, attrName) {
      return normalizeCache[attrName] ||
          (normalizeCache[attrName] = attrs.$normalize(attrName));
    }
  }

})();
