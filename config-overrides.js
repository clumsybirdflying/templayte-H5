/*
 * @Description: 配置文件--新增文件路径简称
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-13 10:05:42
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-29 11:05:50
 */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const {
  override,
  fixBabelImports,
  disableEsLint,
  addPostcssPlugins,
  addDecoratorsLegacy,
  addLessLoader,
  addWebpackAlias
} = require("customize-cra");

const path = require('path');

module.exports = {
  webpack: override(
    disableEsLint(),
    fixBabelImports("import", {
      libraryName: "antd-mobile",
      libraryDirectory: "es",
      style: true, // change importing css to less
    }),
    addPostcssPlugins([require("postcss-px2rem")({ remUnit: 37.5 })]),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        "@primary-color": "#3E80FF", // 主题色
        "COUNT": process.env.NODE_ENV === "production" ? 90 : 10,
      },
      cssModules: {
        localIdentName: "[path][name]__[local]--[hash:base64:5]", // if you use CSS Modules, and custom `localIdentName`, default is '[local]--[hash:base64:5]'.
      },
    }),
    addDecoratorsLegacy(),
    addWebpackAlias({
      "@": path.resolve(__dirname, "src"),
      "util": path.resolve(__dirname, "src/util"),
      "pages": path.resolve(__dirname, "src/pages"),
      "store": path.resolve(__dirname, "src/store"),
      "assets": path.resolve(__dirname, "src/assets"),
      "components": path.resolve(__dirname, "src/components")
    }),
  ),
};
