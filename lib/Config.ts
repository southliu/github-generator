import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'

// 文件所在路径
const filePath = path.join(__dirname, '../src/config.js')
// 正则匹配文中的markdownUrl
const markdownText = /markdownUrl\s\=\s\'.*?\'/
// 正则匹配文中的pageUrl
const pageText = /pageUrl\s\=\s\'.*?\'/

type IUrlData = RegExpMatchArray | null | string

class Config {
  // 获取url
  async getUrl() {
    const { markdownUrl, pageUrl }: IConfigUrls = await inquirer.prompt([
      {
        name: 'markdownUrl',
        type: 'input',
        message: '请输入markdown github链接:'
      },
      {
        name: 'pageUrl',
        type: 'input',
        message: '请输入github page链接:'
      }
    ])

    return { markdownUrl, pageUrl }
  }

  // 读取缓存
  readCache() {
    // 获取文件
    if (!fs.pathExistsSync(filePath)) {
      console.log('文件不存在')
      return { markdownUrl: '', pageUrl: '' }
    }
    let file = fs.readFileSync(filePath, 'utf-8')
    let markdownUrl: IUrlData = file.match(markdownText)
    let pageUrl: IUrlData = file.match(pageText)

    // 去除多余数据
    markdownUrl = markdownUrl ? markdownUrl[0].substring(15, markdownUrl[0].length - 1) : ''
    pageUrl = pageUrl ? pageUrl[0].substring(11, pageUrl[0].length - 1) : ''

    return { markdownUrl, pageUrl }
  }

  // 读取文件
  readFile() {
    // 获取文件
    if (!fs.pathExistsSync(filePath)) {
      console.log('文件不存在')
      return false
    }
    let file = fs.readFileSync(filePath, 'utf-8')

    return file
  }

  // 修改文件
  writeFile(markdownUrl: string, pageUrl: string, file: string) {
    if (file) {
      file = file.replace(markdownText, `markdownUrl = '${markdownUrl}'`)
      file = file.replace(pageText, `pageUrl = '${pageUrl}'`)
      fs.writeFileSync(filePath, file)
    }
  }

  // 修改配置文件
  async update() {
    const { markdownUrl, pageUrl } = await this.getUrl()
    const file = this.readFile()
    if (file) this.writeFile(markdownUrl, pageUrl, file)
  }
}

export default Config