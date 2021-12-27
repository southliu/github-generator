#! /usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import figlet from 'figlet'
import { cyanColor } from './src/utils'

const pack = require(path.join(__dirname, '../package.json'))
const program = new Command(pack.name)

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
