!(function(){

    /**
     * 判断当前JS环境
     */
    var hasDefine = typeof define === 'function';
    var hasExports = typeof module !== 'undefined' && module.exports;

    var _Format = {

        /**
         * JSON-SCHEMA 原生需要支持的6种format
         */
        'date-time': function( data ){

            // A string instance is valid against this attribute if it is a valid date
            // representation as defined by RFC 3339, section 5.6 [RFC3339].
            // Based on http://stackoverflow.com/questions/11318634/how-to-convert-date-in-rfc-3339-to-the-javascript-date-objectmilliseconds-since
            var getDom = function(month, year) {
                var domTable = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

                if(month == 2) {
                    if((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
                        domTable[month-1] = 29;
                    }
                }

                return(domTable[month-1]);
            };

            var matchDateRegEx = /^([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-4][0-9]|5[0-9]):([0-5][0-9]|60)(\.[0-9]+)?(Z|([+-][01][0-9]|2[0-3]):([0-4][0-9]|5[0-9]))$/;

            try {
                var m = matchDateRegEx.exec(data);
                if(!m) { throw 'failed to match regex'; }
                var year   = +m[1];     // 4DIGIT : Any 4 digits
                var month  = +m[2];     // 2DIGIT : 01-12
                var day    = +m[3];     // 2DIGIT : 01-28, 01-29, 01-30, 01-31
                if(day > getDom(month, year)) { throw 'invalid number of days for month'; }
                var hour   = +m[4];     // 2DIGIT : 00-23
                var minute = +m[5];     // 2DIGIT : 00-59
                var second = +m[6];     // 2DIGIT : 00-58, 00-59, 00-60 based on leap second rules
                var msec   = +m[7];     // 1*DIGIT: (optional)
                var tzHour = +m[8];     // 2DIGIT : 00-23
                var tzMin  = +m[9];     // 2DIGIT : 00-59

                return true;
            }
            catch(e) {
                return false;
            }
        },

        'email': function( data ){

            // A string instance is valid against this attribute if it is a valid Internet
            // email address as defined by RFC 5322, section 3.4.1 [RFC5322]
            try {
                var parts = data.split('@');
                if(!parts || (parts.length != 2)) {
                    throw 'wrong number of @';
                }

                // local-part regex from http://www.regular-expressions.info/email.html
                if(!parts[0].match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")$/)) {
                    throw 'local-part failed validation';
                }

                if(!this.hostname(parts[1])) {
                    throw 'hostname failed validation';
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        'hostname': function( data ){

            // A string instance is valid against this attribute if it is a valid
            // representation for an Internet host name, as defined by
            // RFC 1034, section 3.1 [RFC1034].
            try {
                // Total length not > 255
                if(data.length > 255) { throw 'length too long'; }

                var parts = data.split(".");
                var pidx;
                for(pidx in parts) {
                    var p = parts[pidx];

                    // Leading character [a-z]
                    // Optionally [0-9a-z-] upto 61 times
                    // Trailing character [0-9a-z]
                    if(!p.toLowerCase().match(/^[a-z][0-9a-z-]{0,61}[a-z0-9]$/)) {
                        throw 'invalid label: ' + p
                    }
                }

                return true;
            }
            catch(e) {
                return false;
            }
        },

        'ipv4': function( data ){

            // A string instance is valid against this attribute if it is a valid
            // representation of an IPv4 address according to the "dotted-quad" ABNF
            // syntax as defined in RFC 2673, section 3.2 [RFC2673].
            // dotted-quad      =  decbyte "." decbyte "." decbyte "." decbyte
            // decbyte          =  1*3DIGIT
            // Each number represented by a <decbyte> must be between 0 and 255, inclusive.
            if(!data.match(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
                return false;
            }

            return true;
        },

        'ipv6': function( data ){

            // A string instance is valid against this attribute if it is a valid representation
            // of an IPv6 address as defined in RFC 2373, section 2.2 [RFC2373].

            // Replace :: with 0 sections to get to a basic version
            if(data.match(/::/)) {
                var tgtColon = 7;
                // If we have an IPv4 compat version the target number of : is 6
                if(data.match(/((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
                    tgtColon = 6;
                }

                // Handle :: at beginning/end of data
                if(data.match(/^::/)) {
                    data = data.replace('::', '0::');
                }
                if(data.match(/::$/)) {
                    data = data.replace('::', '::0');
                }

                // Expand ::
                while(data.match(/:/g).length < tgtColon) {
                    data = data.replace('::', ':0::');
                }

                // Replace final ::
                data = data.replace('::', ':0:');
            }

            // The basic version is x:x:x:x:x:x:x:x
            if(data.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/)) {
                return true;
            }

            // The IPv4 compat version x:x:x:x:x:x:d.d.d.d
            if(data.match(/^([0-9a-fA-F]{1,4}:){6}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
                return true;
            }

            return false;
        },

        'uri': function( data ){

            // A string instance is valid against this attribute if it is a valid URI, according to [RFC3986].
            // From http://xml.resource.org/public/rfc/html/rfc3986.html#regexp
            if(data.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/)) {
                return true;
            }

            return false;
        },

        /**
         * 扩展类型
         */
        uuid: function( value ){
            return /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/.test( value );
        },

        /**
         * 11位时间戳
         */
        TIMESTAMP: function( value ){
            return /\d{11}/.test( value );
        },

        // "2013-2-23","2013-4-21 12:12:12","2013.2.23","12-22","12月22日"
        DATE_TIME: function( value ){
            return !isNaN( Date.parse( value ) );
        },

        URL: function( value ){
            return this.uri( value );
        },

        TMALL_DETAIL: function( value ){
            if( this.URL( value ) ){
                return /\/\/detail(\.daily)?\.tmall\.(net|com)\/item\.(html|htm)\??.*[&|\?]{1}id\=\d{11}($|\D+)/i.test( value );
            }
            else {
                return false;
            }
        },

        TAOBAO_DETAIL: function( value ){
            if( this.URL( value ) ){
                return /\/\/item(\.daily)?\.taobao\.(net|com)\/item\.(html|htm)\??.*[&|\?]{1}id\=\d{11}($|\D+)/i.test( value );
            }
            else {
                return false;
            }
        },

        TAOBAO_SHOP: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d]+(\.daily)?\.taobao\.(net|com)/i.test( value );
            }
            else {
                return false;
            }
        },

        TMALL_SHOP: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d]+(\.daily)?\.tmall\.(net|com)(\/view_shop\.(html|htm))?/i.test( value );
            }
            else {
                return false;
            }
        },

        /**
         * 线上天猫域名格式
         */
        H_NAME_TMALL: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d\.]+\.tmall\.com\/?/i.test( value );
            }
            else {
                return false;
            }
        },

        /**
         * 线上淘宝域名格式
         */
        H_NAME_TAOBAO: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d\.]+\.taobao\.com\/?/i.test( value );
            }
            else {
                return false;
            }
        },

        /**
         * 线下天猫域名格式
         */
        H_NAME_TMALL_D: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d\.]+\.daily\.tmall\.net\/?/i.test( value );
            }
            else {
                return false;
            }
        },

        /**
         * 线下淘宝域名格式
         */
        H_NAME_TAOBAO_D: function( value ){
            if( this.URL( value ) ){
                return /\/\/[\w\d\.]+\.daily\.taobao\.net\/?/i.test( value );
            }
            else {
                return false;
            }
        },

        /**
         * 通用金额格式
         */
        CURRENCY: function( value ){
            return /^((([1-9]\d*)|0)(\.\d{1,2})?)$/.test( value );
        },

        /**
         * 无小数点的金额格式
         */
        CURRENCY_NO_DECIMAL: function( value ){
            return /^(([1-9]\d*)|0)$/.test( value );
        },

        /**
         * 有且仅有1个小数点的金额格式
         */
        CURRENCY_ONE_DECIMAL: function( value ){
            return /^((([1-9]\d*)|0)\.\d{1})$/.test( value );
        },

        /**
         * 有且仅有2个小数点的金额格式
         */
        CURRENCY_TWO_DECIMAL: function( value ){
            return /^((([1-9]\d*)|0)\.\d{2})$/.test( value );
        },

        CDN_PIC: function( value ){
            if( this.URL( value ) ){
                return /\/\/.+\.(png|bmp|gif|jpg|jpeg|webp)$/i.test( value );
            }
            else {
                return false;
            }
        },

        CDN_PIC_DATA_URI: function( value ){
            return /^data:image\/(bmp|jpg|gif|png|webp);base64,/i.test( value );
        },

        COLOR: function( value ){
            return true;
        }
    };

    /**
     * 统一的format验证入口，若给定为定义过的format，则默认返回 true
     * @param format
     * @param data
     * @param schema
     * @returns {Boolean}
     */
    var Format = function( format, data, schema ){
        if( !( format in _Format ) ){
            return true;
        }
        else {
            return _Format[ format ]( data, schema );
        }
    };

    /**
     * 将校验方法添加到TV4中
     * @param TV4
     */
    Format.addToTV4 = function( TV4 ){

        if( TV4 ){
            var formatName;
            for( formatName in _Format ){
                (function( name ){
                    TV4.addFormat( name, function( data, schema ){
                        var ret = _Format[ name ]( data, schema );
                        if( !ret ){

                            return '不匹配格式 ' + name + ' 的要求';
                        }
                        else {
                            return null;
                        }
                    });
                })(formatName);
            }
        }
    };

    /**
     * 获取所有定义的format
     * @returns {Array}
     */
    Format.getAllFormats = function(){
        var formats = [];
        var format;
        for( format in _Format ){
            formats.push( format );
        }
        return formats;
    };

    /**
     * 根据不同的JS环境输出内容
     */
    if( hasExports ){
        module.exports = Format;
    }
    else if( hasDefine ){
        define(function(){
            return Format;
        });
    }
    else {
        this.JsonSchemaFormat = Format;
    }

})();