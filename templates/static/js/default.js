// 首页内容
const defaultData = [`
  <h2>功能介绍</h2>
  <h3>一键生成github风格的免费博客。</h3>
  <h2>业务场景</h2>
  <h3>当你有用github写markdown文章习惯，我们这套代码可以一键将markdown文章项目转成github page所需静态页面。</h3>
  <pre><code>博客github项目 => github page(免费域名)所需文件</code></pre>
  <h2>操作指令</h2>
  <h3>下载操作</h3>
  <pre><code>npm i -g github-generator</code></pre>
  <h3>生成并替换代码</h3>
  <pre><code>github start</code></pre>
  <h3>配置参数</h3>
  <pre><code>github config</code></pre>
  <h2>配置说明</h2>
  <ul>
  <li>markdown github链接: <a href="https://github.com/SouthLiu/blog">https://github.com/SouthLiu/blog</a> (url链接，而不是git clone用的链接，确保有main分支)</li>
  <li>page github链接: <a href="mailto:git@github.com">git@github.com</a>:SouthLiu/SouthLiu.github.io.git (SSH链接，而不是git clone用的链接)</li>
  <li>title: 个人博客</li>
  </ul>
  <h2>favicon.ico需要放在根目录下</h2>
`]