'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 14:29:27
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 路由参数解析
 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const doctrine = require('doctrine');
const parseSchema = require('./parse_schema.js');

function parseJsdoc (content) {
    let result = doctrine.parse(content, {unwrap: true});
    result.description = _.trimStart(result.description, 'jsdoc\n');
    let obj = {
        description: result.description,
        param: []
    };

    result.tags.forEach(function (item) {
        if(item.title === 'param') {
            obj.param.push(item);
        } else {
            obj[item.title] = item.description;
        }
    });

    return obj;
}

function parseFile(file, parent = '', swaggerDoc) {
    let jsDocRegex = /\/\*\*jsdoc\n\ \*[\s\S]*?\*\//g;

    let content = fs.readFileSync(file, {
        encoding: 'utf8'
    });

    let definition;
    while((definition = jsDocRegex.exec(content)) !== null) {
        let apiDef = {};
        definition = parseJsdoc(definition[0]);
        // 返回模型名称定义
        let responseModel = `StdResponse-${definition.response}`;

        apiDef[definition['httpMethod']] = {
            description: definition.description,
            parameters: [],
            responses: {
                200: {
                    description: 'success',
                    schema: {
                        $ref: `#/definitions/${responseModel}`
                    }
                }
            }
        };

        // parameters 解析
        definition.param.forEach(function (item) {
            let [type, _in] = item.type.name.split('#');
            apiDef[definition['httpMethod']].parameters.push({
                name: item.name,
                description: item.description,
                type: type,
                in: _in,
                required: _in === 'path'
            });
        });

        // 申明返回模型定义
        swaggerDoc.definitions[responseModel] = _.defaultsDeep(
            {},
            swaggerDoc.definitions.StdResponse,
            {
                properties: {
                    data: parseSchema(definition.response)
                }
            }
        );

        // path 处理
        definition.path = definition.path.replace(/\:(\w+)/g, function (p1, p2) {
            return `{${p2}}`;
        });
        // 绑定
        swaggerDoc.paths[`/${parent}/${path.basename(file, '.js')}${definition.path}`] = apiDef;
    }
}

function parsePath(baseDir, swaggerDoc, parent = '') {
    let routers = fs.readdirSync(path.join(baseDir, parent));

    routers.forEach(function (item) {
        let itemPath = path.join(baseDir, parent, item);
        let itemStats = fs.statSync(itemPath);

        if(itemStats.isDirectory()) {
            parent = path.join(parent, item);
            parsePath(baseDir, swaggerDoc, parent);
        } else if(itemStats.isFile() && item.endsWith('.js')) {
            parseFile(path.join(baseDir, parent, item), parent, swaggerDoc);
        }
    });
}

function parse (baseDir, swaggerDoc) {
    baseDir = path.join(baseDir, '/controller');
    parsePath(baseDir, swaggerDoc);

    // 删除标准定义
    delete swaggerDoc.definitions.StdResponse;
}

module.exports = parse;
