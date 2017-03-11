'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.15 15:03:47
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 输出格式检查器
 */

const util = require('util');

/**
 * 数据格式化器
 */
class Formater {
    constructor (name, type, repeat = false, keyname = '' ,properties = {}) {
        this.name = name;
        this.type = type;
        this.repeat = repeat;
        this.keyname = keyname;
        this.properties = properties;
    }

    formatProperties (obj) {
        let properties = this.properties;

        let newObj = {};
        for(let key in properties) {
            if(!{}.hasOwnProperty.call(properties, key)) {
                continue;
            }

            if(obj[key] === undefined) {
                throw new Error(`${util.inspect(obj)} miss ${key} in format ${this.name}`);
            }

            if(typeof obj[key] !== properties[key].type) {
                throw new Error(`The obj ${key} value was ${obj[key]} that does not match ${properties[key].type} type`);
            }

            newObj[key] = obj[key];
        }

        return newObj;
    }

    formatArray (obj) {
        if(!Array.isArray(obj)) {
            throw new Error(`${util.inspect(obj)} is not an array`);
        }

        return [];
    }

    formatObject (obj) {
        if(typeof obj !== 'object') {
            throw new Error(`${util.inspect(obj)} is not an object`);
        }

        return {};
    }

    format (obj) {
        if(this.type === 'properties') {
            return this.formatProperties(obj);
        } else if (this.type === 'array') {
            return this.formatArray(obj);
        } else if (this.type === 'object') {
            return this.formatObject(obj);
        }
    }

    toString () {
        return `Formater ${this.name}`;
    }
}

/**
 * 序列检测器
 */
class Steps extends Array {
    constructor (...args) {
        super(...args);
    }

    checkAndFormat (obj) {
        let newObj;

        if(this[0].type === 'array') {
            newObj = this[0].format(obj);
            this.caseTypeRepeat(this[1], obj, newObj);
        } else if(this[0].type === 'object') {
            newObj = this[0].format(obj);
            
            if(this[0].repeat) {
                this.caseObjectRepeat(this[1], obj, newObj);
            } else {
                this.caseObjectEnum(this.slice(1), obj, newObj);
            }
        } else if(this[0].type === 'properties') {
            newObj = this.caseTypeProperties(this[0], obj);
        }

        return newObj;
    }

    caseTypeRepeat (formater, obj, newObj) {
        for(let i = 0; i < obj.length; i++) {
            newObj.push(formater.format(obj[i]));
        }
    }

    caseObjectRepeat (formater, obj, newObj) {
        for(let key in obj) {
            if(!{}.hasOwnProperty.call(obj, key)) {
                continue;
            }

            newObj[key]  = formater.format(obj[key]);
        }
    }

    caseObjectEnum (formaters, obj ,newObj) {
        for(let i = 0; i < formaters.length; i++) {
            let formater = formaters[i];
            let keyname = formater.keyname;
            if (!obj[keyname]) {
                throw new Error(`对象缺少 ${keyname} 字段`);
            }
            newObj[keyname] = formater.format(obj[keyname]);
        }
    }

    caseTypeProperties (formater, obj) {
        return formater.format(obj);
    }
}

/**
 * 检测器
 */
class Checker {
    constructor (definitions) {
        this.definitions = definitions;
        this.stepsMap = new Map();
    }

    getFormaterInstance(name, type, repeat = false, keyname = '') {
        let formater;
        if(type === 'properties') {
            formater = new Formater(name, type, false, keyname, this.definitions[name]['properties']);
        } else {
            formater = new Formater(name, type, repeat);
        }

        return formater;
    }

    module(ds) {
        const moduleReg = /\@(\w+)/g;

        if(this.stepsMap.get(ds)) {
            return this.stepsMap.get(ds);
        }

        let steps = new Steps();

        // 如果是数组，则要求内部元素保持一致性
        if(ds[0] === '[') {
            steps.push(this.getFormaterInstance('Array', 'array'));

            let key = moduleReg.exec(ds);
            steps.push(this.getFormaterInstance(key[1], 'properties'));

        } else if(ds[0] === '{') {
            let reg = /([^,\s]*):@([^,\s]+)/g;
            // 对象处理
            // reg.exec 在浏览器和 node 内表现不一致
            // 判断是否是循环对象
            if(ds.slice(-4, -1) === '...') {
                // 循环对象
                steps.push(this.getFormaterInstance('ObjectRepeat', 'object', true));

                let key = reg.exec(ds.slice(1, -4));
                steps.push(this.getFormaterInstance(key[2], 'properties'));
            } else {
                steps.push(this.getFormaterInstance('Object', 'object'));

                let key;
                let sliceText = ds.slice(1, -1);
                while((key = reg.exec(sliceText))) {
                    steps.push(this.getFormaterInstance(key[2], 'properties', false, key[1]));
                }
            }
        } else {
            // 直接 model 定义
            let key = moduleReg.exec(ds);
            steps.push(this.getFormaterInstance(key[1], 'properties'));
        }

        this.stepsMap.set(ds, steps);
        return steps;
    }
}

module.exports = opts => {
    let definitions = require(opts.definitionsPath);
    return new Checker(definitions);
};
