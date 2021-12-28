#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import figlet from 'figlet'
import { cyanColor } from './src/utils'
import Config from './lib/Config'

const pack = require(path.join(__dirname, '../package.json'))
const program = new Command(pack.name)
let data: IConfigUrls = {
  markdownUrl: '',
  pageUrl: ''
}

// 配置文件
program
  .description('配置文件')
  .command('config')
  .action(async () => {
    const config = new Config()
    await config.update()
    config.readCache()
    const { markdownUrl, pageUrl } = config.readCache()
    console.log('pageUrl:', pageUrl)
    console.log('markdownUrl:', markdownUrl)
  })


// 配置文件
program
  .description('配置文件')
  .command('config-data')
  .action(() => {
    console.log('config data:', data)
  })

// 帮助说明
program
  .description('帮助说明')
  .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('GITHUB-GENERATOR', {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 100,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\nRun ${cyanColor(`github <command> --help`)} show details\r\n`)
  })

// 版本号
program.version(pack.version)

// 解析用户执行命令传入参数
program.parse(process.argv);
