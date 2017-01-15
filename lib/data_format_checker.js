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
    constructor (name, type, properties = {}) {
        this.name = name;
        this.type = type;
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

    format (obj) {
        if(this.type === 'properties') {
            return this.formatProperties(obj);
        } else if (this.type == 'array') {
            return this.formatArray(obj);
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
        this.propertiesChecker = new Map();
    }

    getFormaterInstance(name, type) {
        if(this.propertiesChecker.get(name)) {
            return this.propertiesChecker.get(name);
        }

        let formater;
        if(type === 'properties') {
            formater = new Formater(name, type, this.definitions[name]['properties']);
        } else {
            formater = new Formater(name, type);
        }

        this.propertiesChecker.set(name, formater);
        return formater;
    }

    module(ds) {
        if(this.stepsMap.get(ds)) {
            return this.stepsMap.get(ds);
        }

        let steps = new Steps();

        if(ds[0] === '[') {
            steps.push(this.getFormaterInstance('Array', 'array'));
        }
        // 循环对象
        let reg =  /\@(\w+)/g, key;
        while((key = reg.exec(ds))) {
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
