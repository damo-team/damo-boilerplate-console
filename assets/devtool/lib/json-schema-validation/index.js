var TV4 = require( 'tv4' );
var JSONSchemaFormat = require( '../json-schema-format' );
var _ = require( 'lodash' );

JSONSchemaFormat.addToTV4( TV4 );

/**
 * 校验
 * @param {JSON} data
 * @param {JSON} schema
 * @param next
 */
var Validator = function( data, schema, next ){

    if( !data || !schema ){
        next( new Error( 'data and schema is required' ) );
    }
    else {
        var result = TV4.validate( data, schema );

        if( result ){
            next( null, {
                result: true
            });
        }
        else {
            var validateRet = {
                result: false
            };

            var error = TV4.error;
            var errorType = getErrorType( error.code );
            var errorMessage = 'Error: [' + errorType + '] ' + error.message + ' at data path: \'' + (error.dataPath ? error.dataPath : 'ROOT') +
                '\', by schema at path: \'' + error.schemaPath + '\';';

            validateRet.error = error;
            validateRet.errorType = errorType;
            validateRet.message = errorMessage;
            next( null, validateRet );
        }
    }
};

/**
 * 根据TV4的错误代码，返回错误的类型
 * @param code
 * @returns {*}
 */
function getErrorType( code ){
    var errorType;
    _.each( TV4.errorCodes, function( value, key ){
        if( value == code ){
            errorType = key;
        }
    });

    return errorType;
}


module.exports = Validator;
