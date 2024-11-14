---
html:
  embed_local_images: false
  embed_svg: true
  offline: false
  toc: true
toc:
  depth_from: 1
  depth_to: 6
  ordered: false
export_on_save:
  html: false
---

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [code from template web project](#code-from-template-web-project)
  - [Getting Started](#getting-started)
  - [项目说明](#项目说明)
  - [代码模板](#代码模板)
  - [模块说明](#模块说明)
    - [数据类型配置](#数据类型配置)
    - [er图设计](#er图设计)
    - [实例设计](#实例设计)
    - [DTO设计](#dto设计)
  - [数据字段、后台属性、前端属性重复编写问题](#数据字段-后台属性-前端属性重复编写问题)
  - [匹配数据库、后台框架、前端框架问题](#匹配数据库-后台框架-前端框架问题)
  - [模板语言，格式换行问题？](#模板语言格式换行问题)
  - [编写模板，模板参数？](#编写模板模板参数)
  - [常见问题解决](#常见问题解决)
    - [常见的2种开发方式：](#常见的2种开发方式)

<!-- /code_chunk_output -->
# code from template web project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```

## 项目说明
通过创建实体关系（ER）模型，将模型数据作为元数据管理起来，再通过进一步设计，从而达到从元数据渲染出代码模板功能。   
常用的输出代码模板有以下几种，但却可根据自身项目需求扩展自己的模板：   
1. 系统建表sql语句；
2. 单模块的crud代码；
3. 聚合模块的crud代码；
4. 前端模块代码；

基于实体关系模型而不是抽象到更高级的模型，有2个原因，一是实体关系模型通用性强；二是模型理解更加简单直观；

## 代码模板
使用：基于thymeleaf的[Textual template modes](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#textual-template-modes)   
使用"/**/"引用指令
使用单行注释符加反斜杠，如"//\"作为内联换行

## 模块说明

### 数据类型配置

### er图设计

### 实例设计

### DTO设计

## 数据字段、后台属性、前端属性重复编写问题

## 匹配数据库、后台框架、前端框架问题

## 模板语言，格式换行问题？

## 编写模板，模板参数？

## 常见问题解决
1. 目前添加模块需要添加路由和store到公共文件
2. 针对多人开发中文件经常冲突问题，主要是多个人有公共的维护文件，开发过程中最好分模块进行，各自维护自己的模块文件，针对需要公共使用的文件，在自己模块导出，在管理角色中通过动态引用每个模块的导出，然后统一动态管理，而不是每个模块都写死进去，导致公共文件维护问题，需要提供插件自动维护公共文件 

文档由vscode插件[Markdown Preview Enhanced](https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/)生成

### 常见的2种开发方式：
1. 从数据库建表的开发方式：
1.1. 数据库建表   
1.2. 反向生成代码   
1.3. controller加上swagger注解，暴露接口   
1.4. 前端对照接口开发   
1.5. 后端自定义接口开发，加上swagger注解，暴露接口   
1.6. 前端对照接口开发   

2. 从api定义接口的api模型开发方式：
2.1. yapi等创建接口   
2.2. 数据库设计表   
2.3. 后端反向生成代码    
2.4. 后端开发自定义接口   
2.5. 后端自定义接口开发   
