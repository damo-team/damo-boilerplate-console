/**
 * format 数据模拟，只支持 json-schema-format 中定义的format，以保持一致性
 */

'use strict';
var MockJS = require( 'mockjs' );
var MockRandom = MockJS.Random;
var CDN_PICS = require( './MOCK_DATA/cdn_pics' );
var UUID = require( 'node-uuid' );

var FormatMocker = function( format, schema, customFormatMock){
  var result = undefined;
  switch( format ){
    case 'date-time': {
      result = MockRandom.datetime('yyyy-MM-ddTHH:mm:ss') + '.' + MockRandom.integer( 10, 100 ) + 'Z';
      break;
    }
    case 'email': {
      result = MockRandom.email();
      break;
    }
    case 'hostname': {
      result = MockRandom.domain();
      break;
    }
    case 'ipv4': {
      result = MockRandom.ip();
      break;
    }
    case 'ipv6': {
      break;
    }
    case 'uri': {
      result = MockRandom.url();
      break;
    }
    case 'DATE_TIME': {
      result = MockRandom.datetime();
      break;
    }
    case 'TIMESTAMP': {
      result = Date.now() + MockRandom.integer( -864000000, +864000000);
      break;
    }
    case 'URL': {
      result = MockRandom.url();
      break;
    }
    case 'TMALL_DETAIL': {
      result = '//detail.tmall.com/item.htm?id=' + MockRandom.integer( 10000000000, 99999999999 );
      break;
    }
    case 'TAOBAO_DETAIL': {
      result = '//item.taobao.com/item.htm?id=' + MockRandom.integer( 10000000000, 99999999999 );
      break;
    }
    case 'TMALL_SHOP': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.tmall.com';
      break;
    }
    case 'TAOBAO_SHOP': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.taobao.com';
      break;
    }
    case 'uuid': {
      result = UUID.v1();
      break;
    }
    case 'H_NAME_TMALL': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.tmall.com';
      break;
    }
    case 'H_NAME_TAOBAO': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.taobao.com';
      break;
    }
    case 'H_NAME_TMALL_D': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.daily.tmall.net';
      break;
    }
    case 'H_NAME_TAOBAO_D': {
      result = '//' + MockRandom.string( 'lower', 4, 10 ) + '.daily.taobao.net';
      break;
    }
    case 'CURRENCY': {
      result = MockRandom.float( 0, 99999, 0, 2 );
      break;
    }
    case 'CURRENCY_NO_DECIMAL': {
      result = MockRandom.float( 0, 99999, 0, 0 );
      break;
    }
    case 'CURRENCY_ONE_DECIMAL': {
      result = MockRandom.float( 0, 99999, 1, 1 );
      break;
    }
    case 'CURRENCY_TWO_DECIMAL': {
      result = MockRandom.float( 0, 99999, 2, 2 );
      break;
    }
    case 'CDN_PIC': {
      result = CDN_PICS[ MockRandom.integer( 0, CDN_PICS.length -1 ) ];
      break;
    }
    default:
      if (customFormatMock.hasOwnProperty(format)) {
        var customFormat = customFormatMock[format];
        var formatMockIndex = MockRandom.integer(0, customFormat.length - 1);
        var selectedMock = customFormat[formatMockIndex];
        var strLen = selectedMock.length;

        if (schema.hasOwnProperty('maxLength') && strLen > schema.maxLength) {
          strLen = schema.maxLength;
        }


        result =  selectedMock.substring(0, strLen);
      }
      break;
  }
  return result;
};

module.exports = FormatMocker;
