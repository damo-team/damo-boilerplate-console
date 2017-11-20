'use strict';

var JSONSchemaHelper = require('json-schema-helper');
var _ = require('lodash');

/**
 * 递归地遍历一个JSON对象
 * @param {Array|Object} json
 * @param {Function} [iterator] 迭代器 iterator( path, value )
 */
function recurJSON(json, iterator) {

  iterator = iterator || function() {
    };

  if (_.isArray(json) || _.isPlainObject(json)) {
    _.forEach(json, function(value, key) {

      var currentKey = '#/' + key;

      iterator(key, value, currentKey);

      if (_.isArray(value) || _.isPlainObject(value)) {
        recurJSON(value, iterator, currentKey);
      }
    });
  }
  else {
    throw new Error('只接受Array或者Object类型JSON对象');
  }
}

/**
 * 对schema 进行解析，若遇到命名空间类型的$ref则进行收集
 * @param schema
 */
function NSRef(schema) {

  var refs = [];

  // 递归遍历JSON的路径
  recurJSON(schema, function(key, value, path) {

    // 若为$ref，并且是命名空间形式，且确实为关键词
    if (key === '$ref' && /[^\/@]+\/[^\/@]+(@[\d\.]+)?/.test(value) && JSONSchemaHelper.ifKeyword(path)) {
      refs.push(value.split('/')[1]);
    }
  });

  return refs;
}

module.exports = NSRef;
