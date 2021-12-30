import downloadGitRepo from 'download-git-repo'
import loading from 'loading-cli'
import fs from 'fs-extra'
import util from 'util'
import path from 'path'
import ejs from 'ejs'
import { errorColor } from './utils'

// 文件所在路径
const filePath = path.join(__dirname, '../github_generator_datas')

type IDirs = {
  name: string;
  children: IDirs[]
}
class Genrator {
  markdownUrl: string
  pageUrl: string
  fileName: string | undefined
  constructor(markdownUrl: string, pageUrl: string) {
    this.markdownUrl = markdownUrl
    this.pageUrl =  pageUrl

    // 获取文件名
    if (markdownUrl) {
      const arr = markdownUrl.split('/')
      let fileName = arr[arr.length - 1]
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
      return result; 
    } catch (error) {
      // 状态失败
      load.stop()
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
          console.log(errorColor('\n  下载失败'))
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

    const dirs = this.handleDirs('../github_generator_datas')
    return dirs
  }

  // 写入模板
  async write() {
    const dirs = await this.getList()
    // 模版文件目录
    const templates = path.join(__dirname, '../templates')
    dirs.length > 0 && dirs.forEach(item => {
      ejs.renderFile(path.join(templates))
    })
    // 模版文件目录
    // const destUrl = path.join(__dirname, '../templates'); 
    // // 生成文件目录
    // // process.cwd() 对应控制台所在目录
    // const cwdUrl = process.cwd();
    // // 从模版目录中读取文件
    // fs.readdir(destUrl, (err, files) => {
    //   if (err) throw err;
    //   files.forEach((file) => {
    //     // 使用 ejs 渲染对应的模版文件
    //     // renderFile（模版文件地址，传入渲染数据）
    //     (ejs as any).renderFile(path.join(destUrl, file), '123').then((data: any) => {
    //       // 生成 ejs 处理后的模版文件
    //       fs.writeFileSync(path.join(cwdUrl, file) , data)
    //     })
    //   })
    // })
  }
}

export default Genrator