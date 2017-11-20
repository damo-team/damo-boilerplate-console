'use strict';
const babylon = require('babylon');

const babylonConfig = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'flow',
    'doExpressions',
    'objectRestSpread',
    'decorators',
    'classProperties',
    'exportExtensions',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport'
  ]
};

const type2Schema = {
  object: 'properties',
  array: 'items'
};


function setProperty(object, name, value) {
  if (!object) {
    return;
  }
  if (!object[name]) {
    object[name] = value;
  }
}

module.exports = function (src) {
  let ast = babylon.parse(src, babylonConfig);
  ast = ast.program.body[0] || ast.program.body;
  if (ast.type === 'ExportDefaultDeclaration') {
    ast = ast.declaration;
  }
  if (ast.type === 'ArrayExpression') {
    // 取第一个对象的语法树
    ast = ast.elements[0];
  }
  if (ast.type === 'VariableDeclaration') {
    if (ast.declarations[0] && ast.declarations[0].init) {
      ast = ast.declarations[0].init;
    }
  }

  const metadata = {
    type: 'object',
    description: '',
    properties: {}
  };
  let preMetadata = metadata;
  function gen(children, metadata) {
    if (!children || !children.length) {
      return;
    }

    for (let i = 0; i < children.length; i += 1) {
      let item = children[i];
      if (!metadata[type2Schema[metadata.type]]) {
        metadata[type2Schema[metadata.type]] = {};
      }

      if (item.type === 'ObjectExpression' || item.type === 'ArrayExpression') {
        metadata[type2Schema[metadata.type]].type = 'object';
        setProperty(metadata[type2Schema[metadata.type]], 'description', item.trailingComments ? item.trailingComments[0].value : '');
        // metadata[type2Schema[metadata.type]].description || (metadata[type2Schema[metadata.type]].description = item.trailingComments ? item.trailingComments[0].value : '');
        if (item.leadingComments && preMetadata) {
          setProperty(preMetadata, 'description', item.leadingComments[0].value);
          // preMetadata.description || (preMetadata.description = item.leadingComments[0].value);
        }
        gen(item.properties, metadata[type2Schema[metadata.type]]);
      } else if (item.type === 'ObjectProperty') {
        setProperty(metadata[type2Schema[metadata.type]], item.key.name  || item.key.value, {
          description: item.trailingComments ? item.trailingComments[0].value : ''
        });
        // metadata[type2Schema[metadata.type]][item.key.name  || item.key.value] = {
        //   description: item.trailingComments ? item.trailingComments[0].value : ''
        // };
        if (item.leadingComments && preMetadata) {
          setProperty(preMetadata, 'description', item.leadingComments[0].value);
          // preMetadata.description || (preMetadata.description = item.leadingComments[0].value);
        }
        preMetadata = metadata[type2Schema[metadata.type]][item.key.name  || item.key.value];
        if (item.value.type === 'ObjectExpression') {
          metadata[type2Schema[metadata.type]][item.key.name  || item.key.value].type = 'object';
          gen(item.value.properties, metadata[type2Schema[metadata.type]][item.key.name  || item.key.value]);
        } else if (item.value.type === 'ArrayExpression') {
          metadata[type2Schema[metadata.type]][item.key.name  || item.key.value].type = 'array';
          gen(item.value.elements, metadata[type2Schema[metadata.type]][item.key.name  || item.key.value]);
        } else {
          if (item.value.type === 'BooleanLiteral') {
            metadata[type2Schema[metadata.type]][item.key.name  || item.key.value].type = 'boolean';
          } else if (item.value.type === 'NumericLiteral') {
            metadata[type2Schema[metadata.type]][item.key.name  || item.key.value].type = 'integer';
          } else {
            metadata[type2Schema[metadata.type]][item.key.name  || item.key.value].type = 'string';
          }
        }
        
      } else if (item.type === 'BooleanLiteral') {
        setProperty(metadata, type2Schema[metadata.type], {
          type: 'boolean',
          description: item.trailingComments ? item.trailingComments[0].value : ''
        });
        // metadata[type2Schema[metadata.type]] = {
        //   type: 'boolean',
        //   description: item.trailingComments ? item.trailingComments[0].value : ''
        // };
        if (item.leadingComments && preMetadata) {
          setProperty(preMetadata, 'description', item.leadingComments[0].value);
          // preMetadata.description || (preMetadata.description = item.leadingComments[0].value);
        }
        preMetadata = metadata[type2Schema[metadata.type]];
      } else if (item.type === 'NumericLiteral') {
        setProperty(metadata, type2Schema[metadata.type], {
          type: 'integer',
          description: item.trailingComments ? item.trailingComments[0].value : ''
        });
        // metadata[type2Schema[metadata.type]] = {
        //   type: 'integer',
        //   description: item.trailingComments ? item.trailingComments[0].value : ''
        // };
        if (item.leadingComments && preMetadata) {
          setProperty(preMetadata, 'description', item.leadingComments[0].value);
          // preMetadata.description || (preMetadata.description = item.leadingComments[0].value);
        }
        preMetadata = metadata[type2Schema[metadata.type]];
      } else {
        // StringLiteral
        setProperty(metadata, type2Schema[metadata.type], {
          type: 'string',
          description: item.trailingComments ? item.trailingComments[0].value : ''
        });
        // metadata[type2Schema[metadata.type]] = {
        //   type: 'string',
        //   description: item.trailingComments ? item.trailingComments[0].value : ''
        // };
        if (item.leadingComments && preMetadata) {
          setProperty(preMetadata, 'description', item.leadingComments[0].value);
          // preMetadata.description || (preMetadata.description = item.leadingComments[0].value);
        }
        preMetadata = metadata[type2Schema[metadata.type]];
      }
    }
    preMetadata = metadata;
  }

  gen(ast.properties, metadata);
  return metadata;
}
