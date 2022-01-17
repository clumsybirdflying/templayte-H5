/*
 * @Description: 
 * @Autor: yanpeng6@hikvision.com
 * @Date: 2021-12-13 10:05:42
 * @LastEditors: yanpeng6@hikvision.com
 * @LastEditTime: 2021-12-14 20:28:41
 */
/* eslint-disable prettier/prettier */

module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "react-app",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "react"],
  rules: { 
    "prettier/prettier": ["warn", { "endOfLine":"auto",}],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "react-hooks/exhaustive-deps": "off"
  }
};
