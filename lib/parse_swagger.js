'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 23:24:43
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 加载模型定义
 */

const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

function parse(baseDir, swaggerDoc) {
    // 'definitions.js'
    baseDir = path.join(baseDir, 'schema/swagger');
    let files = fs.readdirSync(baseDir);

    files = files.filter((item) => {
        return item.endsWith('.js') || item.endsWith('.yaml');
    });

    files.forEach((item) => {
        let [filed, fileType] = item.split('.');

        if(fileType === 'yaml') {
            swaggerDoc[filed] = yaml.safeLoad(fs.readFileSync(path.join(baseDir, item), 'utf8'));
        } else {
            swaggerDoc[filed] = require(path.join(baseDir, item));
        }
    });
}

module.exports = parse;
