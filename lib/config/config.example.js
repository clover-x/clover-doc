'use strict';
/**
 * <plusmancn@gmail.com> created at 2017.01.10 14:00:26
 *
 * Copyright (c) 2017 Souche.com, all rights
 * reserved.
 *
 * 示例 swagger 配置
 */

module.exports = {
    swagger: '2.0',
    info: {
        version: '1.0.0',
        title: 'cloverx doc',
        description: '🍀convert cloverx api definition into swagger specific format'
    },
    schemes: ['http'],
    host: '127.0.0.1:7078',
    basePath: '/',
    paths: {
        '/v1/bundle/{name}/exists': {
            post: {
                description: '判断包名是否存在',
                parameters: [
                    {
                        name: 'name',
                        in: 'path',
                        description: '需要检查的包名, 允许字符 [a-z-]',
                        type: 'string',
                        required: true
                    }
                ],
                responses: {
                    200: {
                        description: '搜车标准返回',
                        schema: {
                            $ref: '#/definitions/StdResponse'
                        }
                    }
                }
            }
        }
    },
    definitions: {
        StdResponse: {
            type: 'object',
            description: '搜车标准返回-模块包含',
            properties: {
                success: {
                    type: 'boolean',
                    description: '请求是否成功'
                },
                code: {
                    type: 'number',
                    description: '请求状态码，10000 为无错误',
                    default: 10000
                },
                msg: {
                    type: 'string',
                    description: '错误描述'
                },
                data: {
                    type: 'array',
                    description: '数据体',
                    items: {
                        $ref: '#/definitions/Module'
                    }
                }
            }
        },
        Module: {
            type: 'object',
            description: 'rn 模块返回定义',
            properties: {
                name: {
                    type: 'string',
                    description: '模块名'
                },
                repository: {
                    type: 'string',
                    description: 'jsbundle 地址'
                },
                version: {
                    type: 'string',
                    description: '模块版本号'
                }
            }
        }
    }
};
