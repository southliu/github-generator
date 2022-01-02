import path from 'path'
import fs from 'fs-extra'


export const MARKDOWN_DATA = 'github_markdown_data'
export const PAGE_DATA = 'github_page_data'

// 添加 ANSI 转义字符，以将文本输出为红色
export function errorColor(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为绿色
export function successColor(str: string) {
  return `\x1b[32m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为蓝色
export function cyanColor(str: string) {
  return `\x1b[36m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为暗淡
export function dimColor(str: string) {
  return `\x1b[2m${str}\x1b[0m`;
}

// 添加 ANSI 转义字符，以将文本输出为斜体
export function italicFont(str: string) {
  return `\x1b[3m${str}\x1b[0m`;
}


// 删除生成文件
export function removeDir() {
  const pageDir = path.join(__dirname, `../${PAGE_DATA}`)
  const markdownDir = path.join(__dirname, `../${MARKDOWN_DATA}`)
  fs.removeSync(pageDir)
  fs.removeSync(markdownDir)
}
