import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import { removeDir } from './utils'

// 文件所在路径
const filePath = path.join(__dirname, '../src/config.js')
// 正则匹配文中的markdownUrl
const markdownText = /markdownUrl\s\=\s\'.*?\'/
// 正则匹配文中的pageUrl
const pageText = /pageUrl\s\=\s\'.*?\'/
// 正则匹配文中的title
const titleText = /title\s\=\s\'.*?\'/

type IUrlData = RegExpMatchArray | null | string

class Config {
  // 获取url
  async getUrl() {
    const { markdownUrl, pageUrl, title }: IConfigUrls = await inquirer.prompt([
      {
        name: 'markdownUrl',
        type: 'input',
        message: '请输入markdown github链接:'
      },
      {
        name: 'pageUrl',
        type: 'input',
        message: '请输入github page链接(SSH链接):'
      },
      {
        name: 'title',
        type: 'input',
        message: '请输入博客标题:'
      }
    ])

    return { markdownUrl, pageUrl, title }
  }

  // 读取文件
  readFile() {
    // 如果文件不存在则创建
    if (!fs.pathExistsSync(filePath)) {
      // 文件内容
      const fileCon = "exports.markdownUrl = '';exports.pageUrl = '';exports.title = ''"
      // 追加文件
      fs.appendFileSync(filePath, fileCon)
      // 删除之后生成的文件
      removeDir()
    }

    // 获取文件
    const file = fs.readFileSync(filePath, 'utf-8')

    return file
  }

  // 修改文件
  writeFile(markdownUrl: string, pageUrl: string, title: string, file: string) {
    if (file) {
      file = file.replace(markdownText, `markdownUrl = '${markdownUrl}'`)
      file = file.replace(pageText, `pageUrl = '${pageUrl}'`)
      file = file.replace(titleText, `title = '${title}'`)
      fs.writeFileSync(filePath, file)
    }
  }

  // 修改配置文件
  async update() {
    const { markdownUrl, pageUrl, title } = await this.getUrl()
    const file = this.readFile()
    this.writeFile(markdownUrl, pageUrl, title, file)
    // 删除之后生成的文件
    removeDir()

    return { markdownUrl, pageUrl, title }
  }

  // 读取缓存
  async readCache() {
    let file = this.readFile()

    let markdownUrl: IUrlData = file.match(markdownText)
    let pageUrl: IUrlData = file.match(pageText)
    let title: IUrlData = file.match(titleText)

    // 去除多余数据
    markdownUrl = markdownUrl ? markdownUrl[0].substring(15, markdownUrl[0].length - 1) : ''
    pageUrl = pageUrl ? pageUrl[0].substring(11, pageUrl[0].length - 1) : ''
    title = title ? title[0].substring(9, title[0].length - 1) : ''

    // 如果缓存数据为空则查询执行
    if (!markdownUrl || !pageUrl || !title) {
      const { markdownUrl, pageUrl, title } = await this.update()
      return { markdownUrl, pageUrl, title }
    }

    return { markdownUrl, pageUrl, title }
  }
}

export default Config