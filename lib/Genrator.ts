import downloadGitRepo from 'download-git-repo'
import loading from 'loading-cli'
import fs from 'fs-extra'
import util from 'util'
import path from 'path'
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
    console.log('dirs:', dirs);
    return dirs
  }
}

export default Genrator