#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import figlet from 'figlet'
import { cyanColor } from './lib/utils'
import Config from './lib/Config'
import Generator from './lib/Generator'

const pack = require(path.join(__dirname, '../package.json'))
const program = new Command(pack.name)

// 配置文件
program
  .description('配置文件')
  .command('config')
  .action(async () => {
    const config = new Config()
    await config.update()
  })

// 开始执行
program
  .description('开始执行')
  .command('start')
  .action(async () => {
    const config = new Config()
    const { markdownUrl, pageUrl, title } = await config.readCache()
    const Generators = new Generator(markdownUrl, pageUrl, title)
    Generators.write()
  })

// 获取列表数据
program
  .description('获取列表数据')
  .command('getList')
  .action(async () => {
    const config = new Config()
    const { markdownUrl, pageUrl, title } = await config.readCache()
    const Generators = new Generator(markdownUrl, pageUrl, title)
    console.log(Generators.getList())
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
