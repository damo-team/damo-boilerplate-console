/**
 * amplifier 返回mocker最终用来mock数据的schema
 */

var _ = require('lodash');

var SchemaAmplifier = {
    /**
     * 将allOf属性解析至schema
     * @param schema
     * @private
     */
    _parseAllOf: function (schema) {
        var self = this;

        if (schema.allOf) {

            //遍历allOf数组中的约束，基于allOf的继承关系,外层覆盖内层
            _.forEach(schema.allOf, function (_schema) {

                //如果allOf约束中又包含allOf,先解析allOf中包含的allOf约束
                if (_schema.allOf) {
                    self._parseAllOf(_schema);
                }

                //先将required合并掉,避免合并allOf时, required字段被覆盖掉
                if (_schema.required) {
                    schema.required = _.union(schema.required, _schema.required);
                    delete _schema.required;
                }

                //如果allOf的子schema中含有default,也会被一并合并过来,逻辑上并没有错误
                schema = _.defaultsDeep(schema, _schema);
            });

            //删除allOf
            delete schema.allOf;
        }
    },

    /**
     * 详细化object类型的schema的函数
     * @param schema
     */
    arrayAmplifier: function (schema) {
        var self = this;

        if (_.isArray(schema.items)) {
            _.forEach(schema.items, function (_schema, item) {
                self.amplifier(_schema);
            });
        } else {
            self.amplifier(schema.items);
        }
    },

    /**
     * 详细化object类型的schema的函数
     * @param schema
     */
    objectAmplifier: function (schema) {
        var self = this;

        if (schema.properties) {
            _.forEach(schema.properties, function (_schema, property) {
                self.amplifier(_schema);
            });
        }
    },

    amplifier: function (schema) {
        var self = this;

        //包含allOf约束,优先处理
        if (schema.allOf) {
            self._parseAllOf(schema);
        }

        //获取schema的type类型,对object和array单独处理
        var type = schema.type;

        //如果type是Array,暂取第一项作为type处理
        if (_.isArray(type)) {
            type = type[0];
        }

        //对object进行特殊处理
        if (type === "object") {
            self.objectAmplifier(schema);
        }

        //对array进行特殊处理
        if (type === "array") {
            self.arrayAmplifier(schema);
        }
    },

    /**
     * 详细化schema的函数
     * @param schema
     * @returns {string} 返回处理后的schema
     */
    amplifiedSchema: function (schema) {
        var self = this;

        self.amplifier(schema)
        return schema;
    },

    /**
     * 对外暴露的接口, 返回一个新的amplfedSchema
     * @param schema originalSchema
     * @returns {string} amplifiedSchema;
     */
    getAmplifiedSchema: function (schema) {
        var self = this;
        var originalSchema = _.clone(schema);

        return self.amplifiedSchema(originalSchema);
    }
};

module.exports = SchemaAmplifier;