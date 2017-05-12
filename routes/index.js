'use strict'

const path = require('path');
const ueditor = require('ueditor');
const express = require('express');
const router = express.Router();

let utilFile = require('../util/util.js');
let Blog = require('../controllers/blog.js');
let Backstage = require('../controllers/backstage.js');

// 博客首页
router.get('/blog.html', Blog.showBlog);
// router.get('/blog.html/nextActicles', function(){
//     console.log('asdfasdf');
// });
router.get('/blog.html/nextActicles', Blog.nextActicles);

// 后台登录
router.get('/login.html', Backstage.login);
router.post('/login.html/checkpwd', Backstage.checkpwd);

// 后台：首页
router.get('/backstage.html',utilFile.checkStatus, Backstage.showIndex);
router.get('/backstage.html/nav_home',utilFile.checkStatus, Backstage.navHome);
// 后台：目录管理
router.get('/backstage.html/nav_catalog',utilFile.checkStatus, Backstage.navCatalog);
router.post('/backstage.html/nav_catalog/catalog_del',utilFile.checkStatus, Backstage.catalogsDel);
router.post('/backstage.html/nav_catalog/catalog_add',utilFile.checkStatus, Backstage.catalogAdd);
router.post('/backstage.html/nav_catalog/catalog_edit',utilFile.checkStatus, Backstage.catalogEdit);
// 后台：文章管理
router.get('/backstage.html/nav_article',utilFile.checkStatus, Backstage.navArticle);
router.post('/backstage.html/nav_article/article_det',utilFile.checkStatus, Backstage.ArticleDet);
router.post('/backstage.html/nav_article/article_del',utilFile.checkStatus, Backstage.ArticleDel);
router.post('/backstage.html/nav_article/article_edit',utilFile.checkStatus, Backstage.ArticleEdit);
// 后台：发布文章
router.get('/backstage.html/nav_public',utilFile.checkStatus, Backstage.navPublic);
router.post('/backstage.html/nav_public/thumbnail_save',utilFile.checkStatus, Backstage.thumbnailSave)
router.post('/backstage.html/nav_public/main_body_save',utilFile.checkStatus, Backstage.mainBodySave);
// 后台：帐号管理
router.get('/backstage.html/nav_accounts/administrator_list',utilFile.checkStatus, Backstage.administratorList);
router.post('/backstage.html/nav_accounts/administrator_add',utilFile.checkStatus, Backstage.administratorAdd);
router.post('/backstage.html/nav_accounts/administrator_edit',utilFile.checkStatus, Backstage.administratorEdit);
router.post('/backstage.html/nav_accounts/administrator_del',utilFile.checkStatus, Backstage.administratorDel);
router.post('/backstage.html/nav_accounts/modify_password',utilFile.checkStatus, Backstage.modifyPassword);

// 后台：文本编辑器
router.use("/js/ueditor/ue", ueditor(path.join(dirname, 'public'), Backstage.ueditor ));

module.exports = router;