/**
 * Created by weijian.ywj on 17/5/16.
 */
'use strict';

const helper = require('../json-schema-helper');
const isPlainObject = require('lodash.isplainobject');
const union = require('lodash.union');

function getLocalRef( schema, refPath ){
  return helper.getChunkByPath( schema, refPath );
}

function handleRequired( schema1, schema2){
  if (schema1.hasOwnProperty('required') || schema2.hasOwnProperty('required')) {
    return union(schema1.required || [], schema2.required || []);
  } else {
    return null;
  }
}

function localRefFilter(schema, refs) {
  if (schema.hasOwnProperty('definitions')) {
    Object.keys(schema.definitions).forEach(key => {
      let path = '#/definitions/' + key;

      if (!refs.hasOwnProperty(path)) {
        refs[path] = JSON.parse(JSON.stringify(schema.definitions[key]));
      }
    });
  }
}

function recurJSON( json, parentPath, refs, _parentRefs, parseRef = false) {

  parentPath = parentPath || '#';
  let parentRef = [];

  Object.assign(parentRef, _parentRefs);


  let schema = helper.getChunkByPath(json, parentPath);

  if(Array.isArray( schema ) || isPlainObject( schema ) ){
    Object.keys(schema).forEach((key) => {
      let value = schema[key];
      var currentKey = parentPath + '/' + key;

      if( key === '$ref'
        && helper.ifKeyword( currentKey )
        && typeof value === 'string') {

        if (parseRef && parentRef.indexOf(value) > -1) { // 依次解析 ref 时,是否存在循环引用的情况
          throw new Error( '存在循环引用' );
        }

        if (refs.hasOwnProperty(value)) { // refs 中是否含有所指引用
          parentRef.push(value);
          let required = handleRequired(schema, refs[value]);
          json = helper.setChunkByPath(json, parentPath, refs[value]);

          if (required !== null) {
            json = helper.setChunkByPath(json, parentPath + '/required', required);
          }

          if (parseRef) {
            recurJSON( json, parentPath, refs, parentRef, parseRef);
          }
        }

      } else if(currentKey.indexOf('#/definitions') === -1 &&
        (Array.isArray( value ) || isPlainObject( value )) ){
        recurJSON( json, currentKey, refs, parentRef, parseRef);
      }

    });
  }
  else {
    throw new Error( '只接受Array或者Object类型JSON对象' );
  }
}

module.exports = function parser(_schema, _refs = {}) {
  let schema = JSON.parse(JSON.stringify(_schema));
  let refsStr = JSON.stringify(_refs);

  // let refs = JSON.parse(refsStr);
  let parsedRefs = JSON.parse(refsStr);

  localRefFilter(schema, parsedRefs);

  let _parsedRefs = JSON.parse(JSON.stringify(parsedRefs));

  Object.keys(parsedRefs).forEach(key => {
    recurJSON(parsedRefs[key], '#', _parsedRefs, [], true);
  });

  let definitionsKeys = null;

  if (schema.hasOwnProperty('definitions') && typeof schema.definitions === 'object') {
    definitionsKeys = Object.keys(schema.definitions);

    delete schema.definitions;
  }

  recurJSON(schema, '#', parsedRefs, []);

  if (definitionsKeys !== null && definitionsKeys.length > 0) {
    schema.definitions = definitionsKeys.reduce((pre, key) => {
      pre[key] = parsedRefs['#/definitions/' + key];
      return pre;
    }, {});
  }

  return schema;
};
