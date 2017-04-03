'use strict'

const path = require('path');
// node遍历文件插件
const glob = require('glob');
const webpack = require('webpack');
// 加载自动化css独立插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 加载js模块压缩编译插件
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// 加载公用组件插件
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// srcDir为当前开发目录
const srcDir = path.resolve(process.cwd(), 'src');
// publicDir为当前建立目录
const publicDir = path.resolve(process.cwd(), 'public');
// 读取入口的js文件目录(本目录只能对应页面的入口的js，其他脚本需要写在/dist/plugins中)
const jsEntryDir = path.resolve(srcDir, 'js');
// 生成js的目录地址
const jsDir = 'js/'
// 生成css的目录地址
const cssDir = 'public/css';
// 要单独打包的插件
const singleModule = ['jquery', 'bootstrap'];
// 是否合并打包其他组建模块
const libMerge = true;
// 需要全局使用的组件，比如jquery
const globalValue = {
  $: 'jquery',
  jQuery: "jquery"
};


// 加载webpack目录参数配置
let config = {
  // 开启source_map
  // devtool: 'source-map',
  // 自动获取并生成入口，获取的目录路径为./src/js
  entry: getEntry(),
  // 输出位置为./public
  output: {
    path: path.join(process.cwd(), 'public'),
    filename: jsDir + '[name].js',
    publicPath: '/'
  },
  plugins: [
    //排除css压缩加载在页面
    // new ExtractTextPlugin(cssDir + '[name].css'),
    //合并额外的js包(暂时无用)
    // new CommonsChunkPlugin('lib', './dist/js/lib.js', jsExtract),
    //开启热加载模式
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    //设置全局使用的变量，在这里将jquery设为全局变量，则在js文件中可以直接使用$
    new webpack.ProvidePlugin(globalValue),
  ],
  module: {
    // 加载器配置
    loaders: [
      // 使用expose-loader 解决第三方库的插件依赖问题，必须放在前面
      { test: require.resolve("jquery"), loader: "expose-loader?$!expose-loader?jQuery" },
      // {
      //   test: /\.css$/,
      //   exclude: getExcludeCss(),
      //   loaders: [
      //       'style-loader',
      //       'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap&importLoaders=1',
      //       'postcss-loader?sourceMap=true'
      //   ]
      // },
      //css加载器 设置需要加ss-modules的css部分
      // {
      //   test: /\.css$/,
      //   // include: getExcludeCss(),
      //   loaders: [
      //       'style-loader',
      //       'css-loader?sourceMap&importLoaders=1',
      //       'postcss-loader?sourceMap=true'
      //   ]
      // },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(process.cwd(), 'src'),
        loader: ['babel-loader']
      },
      {// 让webpack帮助复制font文件
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        loader: 'file?name=dist/img/[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json'
      }

    ]
  }
};


// 设置入口文件
function getEntry() {
  let entrys = glob.sync(path.resolve(jsEntryDir, '**/*.js'));
  let map = {};
  entrys.forEach(function (entry) {
    if (entry && unpackage(entry)) {
      var obj = entry.slice(0, -3).split('/');
      var entryName = obj[obj.length - 1];
      map[entryName] = entry;
    }
  })

  //自定义额外加载包,不会合并在页面对应js中
  if (libMerge) {
    map['vender'] = singleModule;
  } else {
    singleModule.forEach(function (libName) {
      map[libName] = [libName];
    });
  }
  return map;
};

// 设置需要排除的文件夹(在这里是存放第三方插件的plugs文件夹)
function unpackage(path) {
  return path.indexOf('/plugs/') === -1
};


// 设置排除的css路径
// function getExcludeCss(){
//   let cssArr = [];
//   excludeCss.forEach(function(paths){
//     cssArr.push(path.resolve(srcDir, paths));
//   });

//   return cssArr;
// };

module.exports = config;