import downloadGitRepo from 'download-git-repo'
import loading from 'loading-cli'
import fs from 'fs-extra'
import util from 'util'
import path from 'path'
import ejs from 'ejs'
import concurrently from 'concurrently'
import { errorColor, MARKDOWN_DATA, PAGE_DATA } from './utils'

// 文件所在路径
const filePath = path.join(__dirname, `../${MARKDOWN_DATA}`)

type IDirs = {
  name: string;
  children: IDirs[]
}
class Genrator {
  markdownUrl: string
  pageUrl: string
  isSuccess: boolean
  fileName: string | undefined
  constructor(markdownUrl: string, pageUrl: string) {
    this.markdownUrl = markdownUrl
    this.pageUrl =  pageUrl
    this.isSuccess = false

    /**
     * 获取文件名
     * 1. 需要git clone下载page项目
     * 2. 获取.git文件，并更新代码
     */
    if (pageUrl) {
      const arr = pageUrl.split('/')
      let fileName = arr[arr.length - 1]
      // 去除多余后缀
      if (fileName.includes('.')) {
        fileName = fileName.split('.')[0]
      }
      this.fileName = fileName
    }
  }

  // loading
  async handleLoading(fn: Promise<void>, text: string = '下载中...') {
    const load = loading({
      text,
      color: 'cyan',
      frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    })
    load.start()
    try {
      const result = await fn;
      // 状态成功
      load.stop()
      this.isSuccess = true
      return result; 
    } catch (error) {
      // 状态失败
      load.stop()
      this.isSuccess = false
      console.log(`${errorColor('执行失败,请重试')}`)
      return false
    }
  }

  // 下载github数据
  async downloadFile() {
    // 下载方法添加promise
    const download = util.promisify(downloadGitRepo)

    // 如果文件存在则删除
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath)
    }

    // 调用下载
    await this.handleLoading(
      download(`direct:${this.markdownUrl}/archive/refs/heads/main.zip`, filePath)
        .then(() => console.log('\n 下载成功'))
        .catch(() => {
          // 错误处理
          this.isSuccess = false
          console.log(errorColor('\n  下载失败'))
          console.log(errorColor('建议重新执行配置操作：github config'))
        })
      )
  }

  // 迭代获取文件目录列表
  handleDirs(cureenPath: string) {
    // 检测到.*文件名结构则退出迭代
    const isMarkdown = cureenPath.match(/\.\w/)
    if (isMarkdown) return []

    // 获取文件目录
    const filePath = path.join(__dirname, cureenPath)
    const dirs = fs.readdirSync(filePath)
    if (dirs.length === 0) return []

    const dirArrs: IDirs[] = []
    dirs.forEach(item => {
      dirArrs.push({
        name: item,
        children: this.handleDirs(`${cureenPath}/${item}`)
      })
    })

    return dirArrs
  }

  // 获取目录列表
  async getList() {
    // 如果文件夹不存在则下载数据
    if (!fs.existsSync(filePath)) {
      await this.downloadFile()
    }

    const dirs = this.isSuccess ? this.handleDirs(`../${MARKDOWN_DATA}`) : []
    return dirs
  }

  // 克隆github page项目
  async cloneProject() {
    const faterDir = path.join(__dirname, `../${PAGE_DATA}`)
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)

    if (!fs.existsSync(faterDir)) {
      fs.mkdirsSync(`./bin/${PAGE_DATA}`)
    }

    // 文件不存在则下载下载github page
    if (!fs.existsSync(projectDir)) {
      await concurrently([{ command: `git clone ${this.pageUrl}`, cwd: faterDir }])
    }
  }

  // 删除生成文件
  removeDir() {
    const pageDir = path.join(__dirname, `../${PAGE_DATA}`)
    const markdownDir = path.join(__dirname, `../${MARKDOWN_DATA}`)
    fs.removeSync(pageDir)
    fs.removeSync(markdownDir)
  }

  // 写入模板
  async write() {
    // 获取github markdown文件目录数据
    const dirs = await this.getList()
    // 模版文件目录
    const templates = path.join(__dirname, '../templates')
    // 读取模板文件
    const templateDirs = fs.readdirSync(templates)
    
    // 输入数据
    const data = { name: JSON.stringify(dirs) }

    // 克隆page项目
    await this.cloneProject()

    // 遍历模板文件输出对应内容
    templateDirs.length > 0 && templateDirs.forEach(item => {
      const cureenPath = path.join(__dirname, `../templates/${item}`)

      ejs.renderFile(cureenPath, data).then(data => {
        // 模板文件写进github_page_data
        fs.writeFileSync(path.join(__dirname, `../${PAGE_DATA}/${this.fileName}/${item}`) , data)
      })
    })

    // 上传至github page
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)
    await concurrently([
      { command: `git add .`, cwd: projectDir },
      { command: `git commit -m "${new Date().getTime()}"`, cwd: projectDir },
      { command: `git push`, cwd: projectDir }
    ])

    // 删除生成文件
    this.removeDir()
  }
}

export default Genrator