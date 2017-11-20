/**
 * datamocker
 * @author neekey <ni184775761@gmail.com>
 */

var _ = require('lodash');
var Mockjs = require('mockjs');
var MockRandom = Mockjs.Random;
var FormatMocker = require('./format');
/**
 * 使用空格作为间隔符, 更加符合商品标题
 * @author songchen
 * @date 2015/09/22
 */
var TitleStringMockData = require('./MOCK_DATA/title_string').join(' ');

var DataMocker = function (schema, customFormatMock) {
    if (typeof customFormatMock !== 'object' || customFormatMock === null) {
      customFormatMock = {};
    }

    return Mockers._mocker(schema, customFormatMock);
};

// todo 支持 正则 到随机数据的生成

var Mockers = {
    _parseAllOf: function (schema) {
        var self = this;
        //将allOf属性解析至schema

        if (schema.allOf) {
            //遍历allOf数组中的约束，基于allOf的继承关系,外层覆盖内层
            _.forEach(schema.allOf, function (_schema) {

                //如果allOf约束中又包含allOf,先解析allOf,在包含约束
                if (_schema.allOf) {
                    self._parseAllOf(_schema);
                }

                //先将required合并掉,避免合并allOf时, required字段被覆盖掉
                if (_schema.required) {
                    schema.required = _.union(schema.required, _schema.required);
                }

                schema = _.defaultsDeep(schema, _schema);

            });

            //删除allOf
            delete schema.allOf;
        }

    },
    _mocker: function (schema, customFormatMock) {
        /**
         * schema未定义时返回undefined
         */
        if (!schema) return undefined;

        /**
         * 若为allOf, anyOf, oneOf, not之类 也先处理掉
         * 这个步骤应该是对schema进行的修改, 所以一定要在mock开始前先处理掉.
         */

        if (schema.allOf) {
            this._parseAllOf(schema);
        }

        if (schema.anyOf || schema.oneOf || schema.not) {

        }

        /**
         * 如果schema描述包含default, 则对default值处理后输出
         * @author 颂晨
         * @date 2015/09/22
         */
        if (schema.default !== undefined) {
            // 有枚举值
            if (schema.enum && schema.enum.length > 0) {
                for (var i = 0; i < schema.enum.length; i++) {
                    // 命中
                    // 此处没有使用严格相等，是因为目前的default字段全都是string类型，而enum中的数据是包含各种数据类型的
                    if (schema.enum[i] == schema.default) {
                        return schema.enum[i];
                    }
                }
            } else {
                // 根据字段类型设置对应默认值
                switch (schema.type) {
                    case 'string' :
                        return '' + schema.default;
                        break;
                    case 'integer' :
                        // 整数
                        if (/^-?\d+$/.test(schema.default)) {
                            return parseInt(schema.default);
                        }
                        break;
                    case 'number' :
                        // 数字
                        if (/^(-?\d+)(\.?\d+)?$/.test(schema.default)) {
                            return parseFloat(schema.default);
                        }
                        break;
                    case 'boolean' :
                        if (schema.default === 'true') {
                            return true;
                        }
                        if (schema.default === 'false') {
                            return false;
                        }
                        return !!schema.default;
                        break;
                    case 'null' :
                        return null
                        break;
                }
            }
        }

        /**
         * 制定性越强的关键词越先被执行，mocker不处理 $ref，$ref的获取和组装应该在将schema传递给mocker之前进行
         * todo 处理行内的$ref
         * @weijian.ywj 个人觉得没必要在 mock 对 $ref 进行解析,没有解析的 $ref 应为无效引用,应忽略
         */
        if (schema.enum && schema.enum.length > 0) {
            return schema.enum[_.random(0, schema.enum.length - 1)];
        }

        /**
         * 若存在format，则交给对应format mocker 处理
         */
        if (schema.format) {
            var formatRet = FormatMocker(schema.format, schema, customFormatMock);

            // 若该format是没有定义过的，则不会返回任何值，则无视
            if (formatRet !== undefined) {
                return formatRet;
            }
        }

        /**
         * 若存在 x-format 则进行mockjs的语法进行模拟
         */
        if (schema['x-format']) {
            return this.XFormatMocker(schema['x-format']);
        }

        /**
         * 目前仅支持一种type的情况
         */
        var type = schema.type;

        if (_.isArray(type)) {
            type = type[0];
        }

        return this[type + 'Mocker'] ? this[type + 'Mocker'](schema, customFormatMock) : undefined;
    },

    /**
     * x-format 模拟，
     * @param xFormat mock的模拟表达式
     * @returns {*}
     * @constructor
     */
    _XFormatMocker: function (xFormat) {
        var data = null;
        try {
            data = Mockjs.mock(xFormat);
        }
        catch (e) {
            data = '对x-format进行mockjs数据模拟出错，请检查表达式是否正确';
        }

        return data;
    },

    /**
     * 针对 x-format 规则作适配处理
     * @param xFormat mock的模拟表达式
     * @returns {*}
     */
    XFormatMocker: function (xFormat) {

        // 布尔值字符串化
        if (xFormat === '@boolean()') {
            return this._XFormatMocker(xFormat).toString();
        }

        var matches = xFormat.match(/^@image\((\s*'.*?'\s*)?,(?:\s*'(.*?)'\s*)?/);

        // 符合 @image 规则定义 http://gitlab.alibaba-inc.com/river/spec/blob/master/JSON-Schema-Extension.md#image
        if (matches) {

            // 匹配尺寸
            if (matches[1]) {

                // 匹配格式
                if (matches[2]) {

                    var formats = matches[2].split('|');
                    var idx = Math.floor(Math.random() * formats.length);

                    return this._XFormatMocker('@image(' + matches[1] + ')') + '.' + _.trim(formats[idx]);
                } else {
                    return this._XFormatMocker('@image(' + matches[1] + ')');
                }
            } else {
                return this._XFormatMocker('@image()');
            }
        } else {
            return this._XFormatMocker(xFormat);
        }
    },

    objectMocker: function (schema, customFormatMock) {
        var ret = {};
        var self = this;

        /** 检查关键词，先仅仅对 properties, required 进行支持
         * maxProperties
         * minProperties
         * additionalProperties, properties and patternProperties
         * dependences
         */
        if (schema.properties) {

            _.forEach(schema.properties, function (value, key) {

                var doMock = true;

                //如果required存在,并且key不在required数组中,则有一定的可能性不会mock.
                if (schema.required && _.indexOf(schema.required, key) === -1) {
                    //大约90%的可能性不mock这个key
                    doMock = _.random(1, 10) > 9;
                }

                if (doMock)
                    ret[key] = self._mocker(value, customFormatMock);
            });

        }

        return ret;
    },

    arrayMocker: function (schema, customFormatMock) {
        var ret = [];
        var self = this;

        /**
         * 检查关键词，先仅仅对 items 和 maxItems 和 minItems 进行支持
         * additionalItems and items
         * maxItems
         * minItems
         * uniqueItems
         */

        // 若为数组
        if (_.isArray(schema.items)) {
            _.each(schema.items, function (item) {
                ret.push(self._mocker(item, customFormatMock));
            });
        }
        // 若为对象
        else {
            //简化原来的逻辑
            //如果min不存在,设置min为比max小的随机数和设置min为1,似乎没什么差别,所以就默认设置成1.max总不可能比1小吧??
            var min = schema.minItems || 1;

            //如果没定义maxItems,在min和min+4之间随机生成max好了.
            var max = schema.maxItems || MockRandom.integer(min, min + 4);

            var size = _.random(min, max);
            _.times(size, function () {
                ret.push(self._mocker(schema.items, customFormatMock));
            });
        }

        return ret;
    },

    stringMocker: function (schema) {

        /**
         * 先仅仅对maxLength，和minLength进行支持
         * maxLength
         * minLength
         * enum
         * pattern
         * @type {string}
         */
        var ret = null;

        //跟数据相同的处理逻辑: 最小就是1个字,最大值比最小值多100个字
        //var min = schema.minLength || 1;
        /**
         * 改为最少5个字
         * @author songchen
         * @date 2015/09/22
         */
        var min = schema.minLength || 5;
        var max = schema.maxLength || MockRandom.integer(min, min + 100);

        var strLen = MockRandom.integer(min, max);

        //var beginIndex = MockRandom.integer(0, TitleStringMockData.length - 1 - strLen);
        //ret = TitleStringMockData.substring(beginIndex, beginIndex + strLen);
        /**
         * 修改标题生成逻辑, 从空格处开始截取，生成的标题更加符合商品标题
         * @author songchen
         * @date 2015/09/22
         */
        var beginSearchIndex = MockRandom.integer(0, TitleStringMockData.length - 1 - strLen - 50);
        var beginSplitIndex = TitleStringMockData.indexOf(' ', beginSearchIndex) + 1;
        ret = TitleStringMockData.substring(beginSplitIndex, beginSplitIndex + strLen);

        return ret;
    },

    /**
     * 最多保留数字的多少位小数
     * @param number
     * @param len
     * @private
     */
    _toFloat: function (number, len) {

        var num = String(number);
        var dotIndex = num.indexOf('.');

        // 检查是否包含小数
        if (dotIndex > 0) {
            num = num.substring(0, dotIndex + len + 1);
        }

        return parseFloat(num);
    },

    /**
     * 获取最小需要的小数位，如 给定一个整数，需要和它进行较量，最好有一位小数，总之比传入的数的小数位多一位
     * @param num
     * @returns {number}
     * @private
     */
    _getMinFloat: function (num) {

        var ret = /\.(0*)\d*$/.exec(num);
        return ret ? ret[1].length + 1 : 1;
    },

    /**
     * 对数字进行mock
     * @param schema
     * @param {Boolean} floating 模拟数据是否可以带有小数
     * @returns {null}
     * @private
     */
    _numberMocker: function (schema, floating) {

        var ret = null;

        /**
         * multipleOf
         * maximum and exclusiveMaximum
         * minimum and exclusiveMinimum
         */

        if (schema.multipleOf) {

            // 检查条件的合理性，若不合理则返回0
            var multipleMin = 1;
            var multipleMax = 5;

            if (schema.maximum !== undefined) {
                if (( schema.maximum == schema.multipleOf && !schema.exclusiveMaximum ) || ( schema.maximum > schema.multipleOf )) {
                    multipleMax = Math.floor(schema.maximum / schema.multipleOf);
                }
                else {
                    // 若最大值小于个值
                    multipleMin = 0;
                    multipleMax = 0;
                }
            }

            ret = schema.multipleOf * MockRandom.integer(multipleMin, multipleMax);
        }
        else {

            var minimum = schema.minimum || 0;
            var maximum = schema.maximum || 9999;
            // 最大最小值之间的差额
            var gap = maximum - minimum;
            /**
             * 根据最大最小值，计算最小需要的浮点数，为何需要计算？看下面例子：
             *  - min: 0.000006
             *  - max: 0.000009
             *  如果计算的时候对随机数直接保留2位小数，则就无法继续在最大最小值区间里面进行计算了
             */
            var minFloat = this._getMinFloat(minimum);
            minFloat = minFloat < this._getMinFloat(maximum) ? this._getMinFloat(maximum) : minFloat;
            var maxFloat = minFloat + _.random(0, 2);
            /**
             * 一个很小，小于最大值和最小值差额的值，用于出现临界情况时进行修正的值
             */
            var littleGap = this._toFloat(_.random(0, gap, floating), _.random(minFloat, maxFloat)) / 10;

            ret = this._toFloat(_.random(minimum, maximum, floating), _.random(minFloat, maxFloat));

            if (ret === schema.maximum && schema.exclusiveMaximum) {
                ret -= littleGap;
            }

            if (ret === schema.minimum && schema.exclusiveMinimum) {
                ret += littleGap;
            }
        }

        return ret;
    },

    numberMocker: function (schema) {
        return this._numberMocker(schema, true);
    },

    integerMocker: function (schema) {
        return this._numberMocker(schema, false);
    },

    booleanMocker: function (schema) {
        return MockRandom.boolean();
    },

    nullMocker: function (schema) {
        return null;
    }
};


module.exports = DataMocker;

