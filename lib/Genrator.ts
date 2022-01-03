import downloadGitRepo from 'download-git-repo'
import loading from 'loading-cli'
import fs, { readFileSync } from 'fs-extra'
import util from 'util'
import path from 'path'
import concurrently from 'concurrently'
import { errorColor, MARKDOWN_DATA, PAGE_DATA, removeDir } from './utils'

// 文件所在路径
const filePath = path.join(__dirname, `../${MARKDOWN_DATA}`)

type IDirs = {
  name: string;
  fileName: string;
  content: string;
  children: IDirs[]
}
class Genrator {
  markdownUrl: string
  pageUrl: string
  title: string
  isSuccess: boolean
  fileName: string | undefined
  constructor(markdownUrl: string, pageUrl: string, title: string) {
    this.markdownUrl = markdownUrl
    this.pageUrl =  pageUrl
    this.title = title
    this.isSuccess = true

    /**
     * 获取文件名
     * 1. 需要git clone下载page项目
     * 2. 获取.git文件，并更新代码
     */
    if (pageUrl) {
      const arr = pageUrl.split('/')
      let fileName = arr[arr.length - 1]
      // 去除多余后缀
      if (fileName.includes('.git')) {
        fileName = fileName.substring(0, fileName.length - 4)
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
          console.log(errorColor('  建议重新执行配置操作：github config'))
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
      // 去除.md后缀名
      const name = item.includes('.md') ? item.split('.md')[0] : item
      // 获取内容
      let content = ''
      if (item.includes('.md')) {
        content = readFileSync(path.join(__dirname, `${cureenPath}/${item}`), 'utf-8')
      }

      dirArrs.push({
        name,
        content,
        fileName: item,
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

    // 不存在则生成
    if (!fs.existsSync(faterDir)) {
      fs.mkdirsSync(`./bin/${PAGE_DATA}`)
    }

    // 文件不存在则下载下载github page
    if (!fs.existsSync(projectDir)) {
      await concurrently([{ command: `git clone ${this.pageUrl}`, cwd: faterDir }])
    }
  }

  // 上传github
  async uploadGithub() {
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)
    await concurrently([
      { command: `git add .`, cwd: projectDir },
      { command: `git commit -m "${new Date().getTime()}"`, cwd: projectDir },
      { command: `git push`, cwd: projectDir }
    ])
  }

  // 写入模板
  async write() {
    // 获取github markdown文件目录数据
    const dirs = await this.getList()
    // 模版文件目录
    const templates = path.join(__dirname, '../templates')
    // 生成文件
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)
    // 数据文件
    const dataFile = path.join(__dirname, `../templates/static/js/data.js`)

    // 克隆page项目
    await this.cloneProject()
    
    // 生成数据
    const data = `const title = '${this.title}';const menus = ${JSON.stringify(dirs)}`
    // 写入data.js数据
    fs.writeFileSync(dataFile, data)
    // 将模板文件复制到github上传文件目录下
    fs.copySync(templates, projectDir)

    // 上传至github page
    await this.uploadGithub()

    // 删除生成文件
    // removeDir()
  }
}

export default Genrator