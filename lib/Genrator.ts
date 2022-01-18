import downloadGitRepo from 'download-git-repo'
import loading from 'loading-cli'
import fs, { readFileSync } from 'fs-extra'
import util from 'util'
import path from 'path'
import Git from 'simple-git'
import MarkdownIt from 'markdown-it'
import concurrently from 'concurrently'
import { errorColor, MARKDOWN_DATA, PAGE_DATA, removeDir } from './utils'

// 文件所在路径
const filePath = path.join(__dirname, `../${MARKDOWN_DATA}`)
// loading

const loadingAnimate = (text: string) => loading({
  text,
  color: 'cyan',
  frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
})

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
      // 获取最后四位后缀
      const prefix = fileName.substring(fileName.length - 4, fileName.length)
      // 去除.git后缀
      if (prefix === '.git') {
        fileName = fileName.substring(0, fileName.length - 4)
      }
      this.fileName = fileName
    }
  }

  // loading
  async handleLoading(fn: Promise<void>, text: string = '下载中...') {
    const load = loadingAnimate(text)
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
  
  // 图片文件就传入template/static/images中
  imgToTemplate(cureenPath: string) {
    // 静态图片文件夹
    const imgDir = path.join(__dirname, '../templates/static/images')
    // 如果静态图片文件夹不存在则创建
    if (!fs.existsSync(imgDir)) {
      fs.mkdirsSync('./bin/templates/static/images')
    }

    // 过滤图片文件
    const filters = ['.jpg', '.png', '.jpeg', '.git']
    filters.forEach(item => {
      const text = new RegExp(`/.*\/${item}/`)
      if (cureenPath.match(text)) {
        // 获取文件名
        const arr = cureenPath.split('/')
        const name = arr[arr.length - 1]
        const file = path.join(__dirname, cureenPath)
        const imgs = path.join(__dirname, `../templates/static/images/${name}`)
        fs.copyFileSync(file, imgs)
      }
    })
  }

  // 复制模板文件
  copyTemplate() {
    const templates = path.join(__dirname, '../templates')

    // 如果模板文件不存在则复制
    if (!fs.existsSync(templates)) {
      const publicTemplates = path.join(__dirname, '../../templates')
      fs.mkdirSync(templates)
      fs.copySync(publicTemplates, templates)
    }
  }

  // 迭代获取文件目录列表
  handleDirs(cureenPath: string) {
    // 检测到图片文件就传入template/static/images中
    this.imgToTemplate(cureenPath)

    // 检测到.*文件名结构则退出迭代
    const isMarkdown = cureenPath.match(/\.\w/)
    if (isMarkdown) return []

    // 获取文件目录
    const filePath = path.join(__dirname, cureenPath)
    const dirs = fs.readdirSync(filePath)
    if (dirs.length === 0) return []

    const md = new MarkdownIt({
      html: true,
      xhtmlOut: true,
      breaks: true,
      linkify: true
    })
    const dirArrs: IDirs[] = []
    dirs.forEach(item => {
      // 去除.md后缀名
      const name = item.includes('.md') ? item.split('.md')[0] : item
      // 获取内容
      let content = ''
      if (item.includes('.md')) {
        let markdownCon = readFileSync(path.join(__dirname, `${cureenPath}/${item}`), 'utf-8')
        // 过滤文中图片路径 -> 转到static/images下面
        markdownCon = markdownCon.replace(/<img src=\"\..*\//g, '<img src=\"\.\/static\/images\/')
        content = md.render(markdownCon)
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
  cloneProject() {
    const faterDir = path.join(__dirname, `../${PAGE_DATA}`)
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)

    // 不存在则生成
    if (!fs.existsSync(faterDir)) {
      fs.mkdirsSync(`./bin/${PAGE_DATA}`)
    }

    // 文件不存在则下载下载github page
    if (!fs.existsSync(projectDir)) {
      concurrently([{ command: `git clone ${this.pageUrl}`, cwd: faterDir }])
    }
  }

  // 上传github
  async uploadGithub() {
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)

    // 加载动画
    const load = loadingAnimate('上传中...')
    load.start()

    // 调用下载
    Git({ baseDir: projectDir })
      .add('.')
      .commit(`git commit -m "${new Date().getTime()}"`)
      .push([], () => {
        load.stop()
        console.log(' 上传成功')
      })
  }

  // 写入模板
  async write() {
    // 复制模板文件到bin中
    this.copyTemplate()

    // 模版文件目录
    const templates = path.join(__dirname, '../templates')
    // 生成文件
    const projectDir = path.join(__dirname, `../${PAGE_DATA}/${this.fileName}`)
    // 数据文件
    const dataFile = path.join(__dirname, `../templates/static/js/data.js`)
    // 获取github markdown文件目录数据
    let dirs = await this.getList()

    // 克隆page项目
    this.cloneProject()

    // 生成数据
    const data = `const title = '${this.title}';const menus = ${JSON.stringify(dirs)}`
    // 写入data.js数据
    fs.writeFileSync(dataFile, data)
    // 将模板文件复制到github上传文件目录下
    fs.copySync(templates, projectDir)

    // 上传至github page
    this.uploadGithub()

    // 删除生成文件
    // removeDir()
  }
}

export default Genrator