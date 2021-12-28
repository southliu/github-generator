class Genrator {
  markdownUrl: string
  pageUrl: string
  constructor(markdownUrl: string, pageUrl: string) {
    this.markdownUrl = markdownUrl
    this.pageUrl =  pageUrl
  }

  // 获取github列表
  getList() {}

  // 下载github数据
  download() {}
}

export default Genrator