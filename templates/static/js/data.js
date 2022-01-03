const title = 标题;
const menus = [{
  "name": "2021",
  "content": "",
  "fileName": "2021",
  "children": [{
    "name": "11",
    "content": "",
    "fileName": "11",
    "children": [{
      "name": "11-02~11-03 初识Three.js",
      "content": "# 2021-11-02 初识Three.js\n## Three.js是什么？\n```\nThree.js是基于原生WebGL封装运行的三维引擎，市面上使用最广泛的三维可视化框架。\n```\n## 如何使用Three.js\n1. 首先通过官网下载[three.js](http://www.yanhuangxueyuan.com/versions/threejsR92/build/three.js)，并将其引入。\n```\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>初始Three.js</title>\n  <!--引入three.js三维引擎-->\n  <script src=\"./three.js\"></script>\n  <style>\n    body {\n      margin: 0;\n      overflow: hidden;\n      /* 隐藏body窗口区域滚动条 */\n    }\n  </style>\n</head>\n<body>\n</body>\n\n<script>\n/**\n * TODO: 3D逻辑代码\n */\n</script>\n</html>\n\n```\n2. 创建虚拟场景，在其场景网络模型和光照，网络模型中定义几何体形状和材质，设置光照的颜色和光照类型。\n```\n<script>\n  // 创建场景对象Scene\n  const scene = new THREE.Scene()\n\n  /**\n    * 创建网络模型\n    */\n  // 创建立方体几何对象\n  const geometry = new THREE.BoxGeometry(100, 100, 100)\n    // 素材对象\n  const material = new THREE.MeshLambertMaterial({\n    color: 0x444444\n  })\n  // 网络模型对象\n  const mesh = new THREE.Mesh(geometry, material)\n  // 将网络模型添加至场景中\n  scene.add(mesh)\n\n  /**\n    * 光源设置\n    */\n  // 点光源\n  const point = new THREE.PointLight(0xffffff)\n  point.position.set(400, 200, 300) // 点光源位置\n  scene.add(point)\n\n  /**\n    * 环境光\n    */\n  const ambient = new THREE.AmbientLight(0x444444)\n  scene.add(ambient)\n</script>\n```\n3. 创建虚拟相机，设置相机位置、视线方向、投影方式，如何人拍照需要调整角度位置和显示效果不同，成像也不同。\n```\n<script>\n  ...\n\n  /**\n    * 相机设置\n    */\n  const width = window.innerWidth // 窗口宽度\n  const height = window.innerHeight // 窗口高度\n  const k = width / height // 窗口宽高比\n  const s = 200 // 三维场景显示范围控制系数，系数越大，显示范围越大\n  // 创建相机对象\n  const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)\n  camera.position.set(200, 300, 200) // 设置相机位置\n  camera.lookAt(scene.position) // 设置相机方向(指场景对象)\n</script>\n```\n3. 创建渲染器，渲染器通过虚拟场景和虚拟相机可以渲染操作成三维图形。\n```\n<script>\n  ...\n\n  /**\n    * 创建渲染器对象\n    */\n  const renderer = new THREE.WebGLRenderer()\n  renderer.setSize(width, height) // 设置渲染区域尺寸\n  renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色\n  document.body.appendChild(renderer.domElement) // body元素中插入canvas对象\n  // 执行渲染操作 指定场景、相机为参数\n  renderer.render(scene, camera)\n\n  let T0 = new Date() // 上次时间\n  // 渲染函数\n  function render() {\n    const T1 = new Date() // 本次时间\n    const t = T1 - T0 // 时间差\n    T0 = T1 // 把本次时间赋值给上次时间\n    requestAnimationFrame(render)\n    renderer.render(scene, camera) // 执行渲染操作\n    mesh.rotateY(0.001 * t) // 每次绕y轴转0.01弧度\n  }\n\n  render()\n</script>\n```\n4. 最终我们得到了一个旋转的三维图像。\n<img src=\"./images/2021-11-2.gif\">\n<br/>\n<br/>\n## 最后我们可以通过<a href=\"http://www.webgl3d.cn/Three.js\">Three.js官网教程</a>进行学习。\n<br />\n\n# 2021-11-03\n## 使用React开发Three\n### 安装依赖：\n```\nyarn i three\nyarn i -D @types/thress\n```\n1. 引入Three依赖\n```\nimport {\n  Scene,\n  OrthographicCamera,\n  WebGLRenderer,\n  BoxGeometry,\n  MeshLambertMaterial,\n  Mesh,\n  PointLight,\n  AmbientLight,\n  SphereGeometry,\n  GridHelper\n} from 'three'\nimport { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';\n```\n2. 给正方体添加半透明\n```\n...\n\n/**\n  * 创建网络模型\n  */\n// 创建立方体几何对象\nconst geometry = new BoxGeometry(100, 100, 100)\n  // 素材对象\nconst material = new MeshLambertMaterial({\n  color: 0x444444\n})\nmaterial.opacity = 0.5 // 半透明为0.5\nmaterial.transparent = true // 允许透明度\n\n...\n```\n3. 修改render函数\n```\n...\n\nfunction render() {\n  renderer.render(scene,camera);//执行渲染操作\n  requestAnimationFrame(render);//请求再次执行渲染函数render\n}\nrender()\nconst controls = new OrbitControls(camera,renderer.domElement);//创建控件对象\ncontrols.addEventListener('change', render);//监听鼠标、键盘事件\n```\n4. 添加额外球体和辅助坐标系\n```\n...\n\n// 球体网格模型\nconst geometry2 = new SphereGeometry(60, 40, 40);\nconst material2 = new MeshLambertMaterial({\n  color: 0xff00ff\n});\nconst mesh2 = new Mesh(geometry2, material2); //网格模型对象Mesh\nmesh2.translateY(150); //球体网格模型沿Y轴正方向平移120\nscene.add(mesh2);\n\n// 辅助坐标系\nvar gridHelper = new GridHelper(150, 150, 0x2C2C2C, 0x888888);\nscene.add(gridHelper);\n```\n5. 最终成像：\n<img src=\"./images/2021-11-03.png\">\n",
      "fileName": "11-02~11-03 初识Three.js.md",
      "children": []
    }, {
      "name": "11-05 Threejs开发一个三维地球",
      "content": "# 2021-11-05 使用React+Threejs开发一个三维地球\n### 安装React\n```\nnpx create-react-app project-name --tmeplate typescript\n```\n### 安装依赖：\n```\nyarn i three\nyarn i -D @types/thress\n```\n### 为全局添加css\n```\n// APP.css\n\nbody {\n  margin: 0;\n  overflow: hidden;\n  /* 隐藏body窗口区域滚动条 */\n}\n```\n### 按需加载Threejs所需组件和图片\n图片文件可在[github](https://github.com/one-moeny/earth/tree/main/src/assets)下载\n```\n// APP.tsx\n\nimport './App.css';\nimport earthImg from './assets/earth.jpg'\nimport cloudImg from './assets/cloud.png'\nimport {\n  Scene,\n  PerspectiveCamera,\n  WebGLRenderer,\n  SphereGeometry,\n  MeshPhongMaterial,\n  Mesh,\n  TextureLoader,\n  AmbientLight,\n  Color\n} from 'three'\nimport { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'\n```\n### 创建虚拟场景和球体，并为球体添加图片材质\n```\nfunction APP() {\n  // 创建场景对象Scene\n  const scene = new Scene()\n  scene.background = new Color(0, 0, 0)\n\n  /**\n   * 创建网络模型\n   */\n  // 创建球体几何对象\n  const geometry = new SphereGeometry(200, 100, 100)\n  // 创建一个纹理加载器对象\n  const textureLoader = new TextureLoader()\n  // 素材对象\n  const material = new MeshPhongMaterial({\n    map: textureLoader.load(earthImg)\n  })\n  // 网络模型对象\n  const mesh = new Mesh(geometry, material)\n  // 将网络模型添加至场景中\n  scene.add(mesh)\n}\n```\n### 添加环境光\n```\n...\n\n  /**\n   * 环境光\n   */\n  const ambient = new AmbientLight(0xFFFFFF)\n  ambient.position.set(100, 100, 200);\n  scene.add(ambient)\n```\n### 添加虚拟相机\n```\n...\n\n  /**\n   * 相机设置\n   */\n  const width = window.innerWidth // 窗口宽度\n  const height = window.innerHeight // 窗口高度\n  // 创建相机对象\n  const camera = new PerspectiveCamera(45, width / height, 1, 1000)\n  camera.position.set(0, 500, -500) // 设置相机位置\n  camera.lookAt(scene.position) // 设置相机方向(指场景对象)\n```\n### 创建渲染器将其渲染成像\n```\n...\n\n  /**\n   * 创建渲染器对象\n   */\n  const renderer = new WebGLRenderer()\n  renderer.setSize(width, height) // 设置渲染区域尺寸\n  document.body.appendChild(renderer.domElement) // body元素中插入canvas对象\n  // 执行渲染操作 指定场景、相机为参数\n  renderer.render(scene, camera)\n```\n### 添加云层\n```\n...\n\n  /**\n   * 云层\n   */\n  // 创建球体cloudImg\n  const coludGeometry = new SphereGeometry(201, 100, 100)\n  // 云层材质\n  const cloudsMater = new MeshPhongMaterial({\n    alphaMap: new TextureLoader().load(cloudImg),\n    transparent: true,\n    opacity: 0.2\n  })\n  const cloudsMesh = new Mesh(coludGeometry, cloudsMater)\n  scene.add(cloudsMesh)\n```\n### 添加自转动画和控制球体视角操作\n```\n  // 创建控件对象\n  const controls = new OrbitControls(camera,renderer.domElement)\n  controls.addEventListener('change', render) // 监听鼠标、键盘事件\n\n  // 自转动画\n  function animate() {\n    controls.update();\n    // 地球自转\n    mesh.rotation.y -= 0.002;\n    // 漂浮的云层\n    cloudsMesh.rotation.y -= 0.001;\n    cloudsMesh.rotation.z += 0.001;\n    renderer.render(scene, camera);\n    requestAnimationFrame(animate) // 请求再次执行渲染函数animate\n  }\n  animate()\n\n  // 渲染函数\n  function render() {\n    renderer.render(scene,camera) // 执行渲染操作\n    requestAnimationFrame(render) // 请求再次执行渲染函数render\n  }\n  render()\n```\n### 最总成像：\n<img src=\"./images/2021-11-05.gif\">\n<br />\n<br />\n\n# 源码：https://github.com/one-moeny/earth",
      "fileName": "11-05 Threejs开发一个三维地球.md",
      "children": []
    }, {
      "name": "11-09~11-11 CLI创建页面初步设计",
      "content": "# 2021-11-09 CLI创建页面初步设计\n### 初步设计生成页面指令，根据create-xxx-page判断是哪种框架\n```\nsouth create-react-page page-name\nor\nsouth creat-vue-page page-name\n```\n### 页面功能(checkbox)\n```\n搜索              顶部搜索框\n新增-弹窗         当前页新增弹窗\n新增-跳转         跳转至新增页面\n删除              删除按钮\n删除-批量删除      批量删除按钮\n分页              分页栏\n```\n```\n当'新增-弹窗'和'新增-跳转'同时勾选时，会被'新增-弹窗'覆盖\n```\n# 2021 11-11 实现CLI提示功能\n### 在<kbd>lib/GeneratorPage</kbd>中添加询问功能方法\n```\nasync handleFunctions() {\n  // 询问基础功能\n  const { functions }: { functions: IPageFunctions[] } = await inquirer.prompt({\n    name: 'functions',\n    type: 'checkbox',\n    message: '选择页面功能:',\n    choices: [\n      { name: '搜索', value: 'search', checked: true },\n      { name: '分页', value: 'pagination', checked: true },\n      { name: '新增', value: 'create', checked: true },\n      { name: '删除', value: 'delete', checked: true },\n      { name: '批量删除', value: 'batch-delete' }\n    ]\n  })\n\n  // 新增类型 create: 弹窗 create-page: 跳转页面\n  if (functions.includes('create')) {\n    // 询问新增类型\n    const { type } = await inquirer.prompt({\n      name: 'type',\n      type: 'confirm',\n      message: '新增是否以弹窗形式展现? Y: 弹窗 n: 跳转'\n    })\n\n    // 处理基础功能中的新增类型\n    const createIdx = functions.indexOf('create')\n    functions[createIdx] = type ? 'create' : 'create-page'\n  }\n\n  return functions\n}\n```\n### 得到以下效果：\n<img src=\"./images/2021-11-11.gif\">\n<br />",
      "fileName": "11-09~11-11 CLI创建页面初步设计.md",
      "children": []
    }, {
      "name": "11-16 leetcode第一题",
      "content": "# 2021-11-16 leetcode第一题\n### 求两数之和，输入两个参数，第一个参数为数组，第二个参数是数组中任意两个参数之和的结果，当有结果时，返回对应两个数据的下标。\n```\n输入： [1, 2, 3], 4\n输出： [0, 2]\n解释： 1 + 3 = 4, 1和3对应下标是0和2\n```\n### 思路：循环数组，并用当前结果减去当前数据，得到结果，结果存储到对象中，如果对象里面存在结果，则是答案。\n```\nfunction twoSum(nums: number[], target: number): number[] {\n  // 缓存数据\n  const map = {}\n\n  // 循环数据\n  for (let key in nums) {\n    // 获取对应结果\n    const result = target - nums[key]\n    // 当结果存在缓存数据中，则为答案\n    if (map[result] !== undefined) {\n      return [map[result], Number(key)]\n    }\n    map[nums[key]] = Number(key)\n  }\n\n  // 当结果不存在则返回空数组\n  return []\n}\n```",
      "fileName": "11-16 leetcode第一题.md",
      "children": []
    }, {
      "name": "images",
      "content": "",
      "fileName": "images",
      "children": [{
        "name": "2021-11-03.png",
        "content": "",
        "fileName": "2021-11-03.png",
        "children": []
      }, {
        "name": "2021-11-05.gif",
        "content": "",
        "fileName": "2021-11-05.gif",
        "children": []
      }, {
        "name": "2021-11-11.gif",
        "content": "",
        "fileName": "2021-11-11.gif",
        "children": []
      }, {
        "name": "2021-11-2.gif",
        "content": "",
        "fileName": "2021-11-2.gif",
        "children": []
      }]
    }]
  }, {
    "name": "12",
    "content": "",
    "fileName": "12",
    "children": [{
      "name": "12-11 golang基础类型",
      "content": "# Go基础类型\n### 字符串类型\n字符串类型是由双引号(\"\")包裹住的字符\n```\nvar stringVal string = \"Hello World\"\nstringVal := \"Hello World\"\n```\n**注意：直接使用单引号('')会报错**\n<img src=\"./images/go_string_error.jpg\">\n单引号('')应该写在双引号内：stringVal := \"Hello **'South'**\"\n\n### bool布尔型\nbool布尔型只有两个值：true和false\n```\nvar boolVal bool = true\nboolVal := true\n```\n\n### int整数类型\nint类型有分int、unint、int8、uint8、int16、uint16、int32、uint32、int64、uint64，**常用int或unint**\n* int和uint类型大小为4或8字节，32位或64位\n* int8  （大小为1字节，代表2^8，正负各占一半，取值区间为-128 ~ 127）\n* uint8 （大小为1字节，代表2^8，由0开始，取值区间为0 ~ 255）\n* int16 （大小为2字节，代表2^16，取值区间为-32768 ~ 32767）\n* uint16（大小为2字节，代表2^16，取值区间为0 ~ 65535）\n* int32 （大小为4字节，代表2^32，取值区间为-2147483648 ~ 2147483647）\n* uint32（大小为4字节，代表2^32，取值区间为0 ~ 4294967295）\n* int64 （大小为8字节，代表2^64，取值区间为-9223372036854775808 ~ 9223372036854775807）\n* uint64（大小为8字节，代表2^64，取值区间为0 ~ 18446744073709551615）\n```\nvar intVal int = 123\nintVal := 123\n```\n**使用unsafe可以查看对应的字节大小:**\n```\npackage main \nimport (\n \"fmt\"\n \"unsafe\"\n) \nfunc main() {\n  var intVal int = 123\n  fmt.Println(unsafe.Sizeof(intVal))\n}\n```\n\n### 浮点型\n浮点型有分float32、float64，**常用float64**\n* float32（单精度类型，占据4个字节 byte，32个二进制位 bit）\n* float64（双精度类型，占据8个字节 byte，64个二进制位 bit）\n```\nvar floatVal float64 = 0.5\nfloatVal := 0.5\n```",
      "fileName": "12-11 golang基础类型.md",
      "children": []
    }, {
      "name": "12-25 golang基础类型转换",
      "content": "# Go基础类型转换\n### string类型转int类型\n```\nint,err := strconv.Atoi(string)\n```\n### string类型转int64类型\n```\nint64,err := strconv.ParseInt(string, 10, 64)\n```\n### int类型转string类型\n```\nstring := strconv.Itoa(int)\n```\n### int64类型转string\n```\nstring := strconv.FormatInt(int64, 10)\n```\n### string类型转float32/float64\n```\nfloat32,err := strconv.ParseFloat(str, 32)\nfloat64,err := strconv.ParseFloat(str, 64)\n```\n### int64类型转int类型\n```\nint := int(int64)\n```\n### int类型转int64类型\n```\nint64 := int(int)\n```",
      "fileName": "12-25 golang基础类型转换.md",
      "children": []
    }, {
      "name": "images",
      "content": "",
      "fileName": "images",
      "children": [{
        "name": "go_string_error.jpg",
        "content": "",
        "fileName": "go_string_error.jpg",
        "children": []
      }]
    }]
  }]
}, {
  "name": "leetcode",
  "content": "",
  "fileName": "leetcode",
  "children": [{
    "name": "01-求两数之和",
    "content": "# leetcode 01: 求两数之和\n### 求两数之和，输入两个参数，第一个参数为数组，第二个参数是数组中任意两个参数之和的结果，当有结果时，返回对应两个数据的下标。\n```\n输入： [1, 2, 3], 4\n输出： [0, 2]\n解释： 1 + 3 = 4, 1和3对应下标是0和2\n```\n### 思路：循环数组，并用当前结果减去当前数据，得到结果，结果存储到对象中，如果对象里面存在结果，则是答案。\n```\n// JS\nfunction twoSum(nums: number[], target: number): number[] {\n  // 缓存数据\n  const map = {}\n\n  // 循环数据\n  for (let key in nums) {\n    // 获取对应结果\n    const result = target - nums[key]\n    // 当结果存在缓存数据中，则为答案\n    if (map[result] !== undefined) {\n      return [map[result], Number(key)]\n    }\n    map[nums[key]] = Number(key)\n  }\n\n  // 当结果不存在则返回空数组\n  return []\n}\n```\n```\n// go\nfunc twoSum(nums []int, target int) []int {\n\thasMaps := map[int]int{}\n\tfor i,v := range nums {\n\t\tif y,yv := hasMaps[target - v]; yv {\n\t\t\treturn []int{y, i}\n\t\t}\n\t\thasMaps[v] = i\n\t}\n\treturn  nil\n}\n```",
    "fileName": "01-求两数之和.md",
    "children": []
  }, {
    "name": "02-两数相加",
    "content": "# leetcode 02: 两数相加\n### 给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。\n### 请你将两个数相加，并以相同形式返回一个表示和的链表。\n### 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。\n#### 示例 1：\n```\n输入：l1 = [2,4,3], l2 = [5,6,4]\n输出：[7,0,8]\n解释：342 + 465 = 807.\n```\n#### 示例 2：\n```\n输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]\n输出：[8,9,9,9,0,0,0,1]\n```\n### 解题思路：\n1. 添加一个哑节点: const prehead = new ListNode(-1)\n2. 当其中一个参数不为null时，使用while遍历: while(list1 !== null && list2 !== null) {}\n3. 设置相加多出的数surplus，当遍历中l1和l2和surplus相加大于10，surplus为1，否则为0。\n```\n\n  let surplus = 0 // 相加多出的数\n  const prehead = new ListNode(-1)\n  let prev = prehead\n\n  while (l1 || l2) {\n    const n1 = l1 ? l1.val : 0\n    const n2 = l2 ? l2.val : 0\n    let sum = n1 + n2 + surplus\n    let value = sum\n    if (sum >= 10) value = sum % 10\n    prev.next = new ListNode(value)\n    surplus = sum >= 10 ? 1 : 0\n    if (l1) l1 = l1.next\n    if (l2) l2 = l2.next\n    prev = prev.next\n  }\n\n  // 多出的数继续累加\n  if (surplus) {\n    prev.next = new ListNode(surplus)\n  }\n\n  return prehead.next\n```",
    "fileName": "02-两数相加.md",
    "children": []
  }, {
    "name": "03-无重复字符的最长子串",
    "content": "# leetcode 03: 无重复字符的最长子串\n### 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。\n#### 示例 1：\n```\n输入: s = \"abcabcbb\"\n输出: 3 \n解释: 因为无重复字符的最长子串是 \"abc\"，所以其长度为 3。\n```\n#### 示例 2：\n```\n输入: s = \"bbbbb\"\n输出: 1\n解释: 因为无重复字符的最长子串是 \"b\"，所以其长度为 1。\n```\n#### 示例 3：\n```\n输入: s = \"pwwkew\"\n输出: 3\n解释: 因为无重复字符的最长子串是 \"wke\"，所以其长度为 3。\n     请注意，你的答案必须是 子串 的长度，\"pwke\" 是一个子序列，不是子串。\n```\n#### 示例 4：\n```\n输入: s = \"\"\n输出: 0\n```\n### 解题思路：\n1. 创建右指针和Set，遍历每个字符\n2. 没有出现重复值的时候不断往Set添加字符\n3. 当出现重复值时，计算最大值，Set值删除第一位\n```\nfunction lengthOfLongestSubstring(s: string): number {\n  // 记录每个字符是否出现过\n  const occ = new Set()\n  const n = s.length\n  // 右指针，初始值为-1，相当于我们在字符串的左边界的左例，还没开始移动\n  let rk = -1, ans = 0\n  for (let i = 0; i < n; ++i) {\n    if (i !== 0) {\n      // 左指针向右移动一格，移除一个字符\n      occ.delete(s[i - 1])\n    }\n    while (rk + 1 < n && !occ.has(s[rk + 1])) {\n      // 不断地移动右指针\n      occ.add(s[rk + 1])\n      ++rk\n    }\n    // 第i到rk个字符是一个极长的无重复字符子串\n    ans = Math.max(ans, rk - i + 1)\n  }\n\n  return ans\n};\n```",
    "fileName": "03-无重复字符的最长子串.md",
    "children": []
  }, {
    "name": "07-整数反转",
    "content": "# leecode 07: 整数反转\n### 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。\n### 如果反转后整数超过 32 位的有符号整数的范围 [−2的31次幂,  2的31次幂 − 1] ，就返回 0。\n#### 示例 1：\n```\n输入：x = -123\n输出：-321\n```\n#### 示例 2：\n```\n输入：x = 120\n输出：21\n```\n### JS解题思路：\n1. 求参数是否是负数： x > 0\n2. 获取参数的绝对值，并分割反转，在合并成一个新的数字\n3. 判断是否在限制条件内，如果不在限制条件内则返回0\n```\n// JS\nfunction reverse(x: number): number {\n  if (x === 0) return 0\n  // 取值范围\n  const limit = Math.pow(2, 31)\n  // 判断是否为负数\n  const sign = x > 0\n  // 求绝对值\n  const abs = Math.abs(x)\n  // 分割字符串，反转数组，合并数组成字符串\n  const num = Number(abs.toString().split('').reverse().join(''))\n\n  if ((sign && num > (limit - 1)) || (!sign && Math.abs(num) > limit)) {\n    return 0\n  }\n\n  return sign ? num : -num\n};\n```\n### Go解题思路:\n1. 取x的余数，在将x除10\n2. 答案乘10在加余数，就等于反转数\n```\nfunc reverse(x int) (ans int) {\n\tfor x != 0 {\n\t\tif ans < math.MinInt32/10 || ans > math.MaxInt32/10 {\n\t\t\treturn 0\n\t\t}\n\t\tresidue := x % 10\n\t\tx /= 10\n\t\tans = ans * 10 + residue\n\t}\n\treturn\n}\n```",
    "fileName": "07-整数反转.md",
    "children": []
  }, {
    "name": "09-回文数",
    "content": "# leecode 09: 回文数\n### 给出一个整数x，这个x正着读和反着读都一样，则返回true，否则false。\n#### 示例 1：\n```\n输入：x = 121\n输出：true\n```\n#### 示例 2：\n```\n输入：x = -121\n输出：false\n解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。\n```\n### 解题思路：\n1. 负数都无法反转，排除负数： if (x < 0) return false\n2. 10的倍数反转必然不相等： if (x % 10 === 0 && x !== 0) return false\n3. 正整数平分为两个数，如果该整数为奇数，则删除中间数，如12321，取平分之后前半部分数据为123，后半部数据为21，删除中间数3，在相等。\n```\n// JS\nfunction isPalindrome(x: number): boolean {\n  // 当参数为负数或10的倍数时则退出\n  if (x < 0 || (x % 10 === 0 && x !== 0)) return false\n  // 取整数平分数\n  let half = 0\n  while (x > half) {\n    half = half * 10 + x % 10\n    x = Math.floor(x / 10)\n  }\n\n  // x为偶数，x === half成立\n  // x为奇数，x === Math.floor(half / 10)成立\n  return x === half || x === Math.floor(half / 10)\n}\n```\n```\n// Go\nfunc isPalindrome(x int) bool {\n\tif x < 0 || (x % 10 == 0 && x != 0) {\n\t\treturn false\n\t}\n\tans := 0\n\tfor x > ans {\n\t\tans = ans * 10 + x % 10\n\t\tx /= 10\n\t}\n\treturn x == ans || x == ans / 10\n}\n```",
    "fileName": "09-回文数.md",
    "children": []
  }, {
    "name": "100-相同的树",
    "content": "# leecode 100: 相同的树\n### 给你两棵二叉树的根节点 p 和 q ，编写一个函数来检验这两棵树是否相同。\n### 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。\n#### 示例 1：\n```\n输入：p = [1,2,3], q = [1,2,3]\n输出：true\n```\n#### 示例 2：\n```\n输入：p = [1,2], q = [1,null,2]\n输出：false\n```\n#### 示例 3：\n```\n输入：p = [1,2,1], q = [1,1,2]\n输出：false\n```\n### 解题思路：递归左子树和右子树，当前都为null则为true，如果当前值不等或其中一个值为null则返回false\n```\nclass TreeNode {\n    val: number\n    left: TreeNode | null\n    right: TreeNode | null\n    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n        this.val = (val===undefined ? 0 : val)\n        this.left = (left===undefined ? null : left)\n        this.right = (right===undefined ? null : right)\n    }\n}\n\nfunction isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {\n  if (p === null && q === null) return true\n  if (p === null || q === null) return false\n  if (p.val !== q.val) return false\n\n  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right)\n};\n```",
    "fileName": "100-相同的树.md",
    "children": []
  }, {
    "name": "101-对称二叉树",
    "content": "# leecode 101: 对称二叉树\n### 给定一个二叉树，检查它是否是镜像对称的。\n### 例如，二叉树 [1,2,2,3,4,4,3] 是对称的。\n```\n    1\n   / \\\n  2   2\n / \\ / \\\n3  4 4  3\n```\n### 但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:\n```\n    1\n   / \\\n  2   2\n   \\   \\\n   3    3\n```\n### 解题思路：使用递归左右子树值，将左子树和右子树进行对比，如果双方都没值则返回true，一方有值另外一方没值为false，最后对比左子树值和右子树值是否相等\n```\nclass TreeNode {\n    val: number\n    left: TreeNode | null\n    right: TreeNode | null\n    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n        this.val = (val===undefined ? 0 : val)\n        this.left = (left===undefined ? null : left)\n        this.right = (right===undefined ? null : right)\n    }\n}\n\nconst check = (p: TreeNode | null, q: TreeNode | null) => {\n  if (!p && !q) return true\n  if (!p || !q) return false\n  return p.val === q.val && check(p.left, q.right) && check(p.right, q.left)\n}\n\n\nfunction isSymmetric(root: TreeNode | null): boolean {\n  return check(root, root)\n};\n```",
    "fileName": "101-对称二叉树.md",
    "children": []
  }, {
    "name": "104-二叉树的最大深度",
    "content": "# leecode 104: 二叉树的最大深度\n### 给定一个二叉树，找出其最大深度。\n### 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。\n### 说明: 叶子节点是指没有子节点的节点。\n\n#### 示例：\n给定二叉树 [3,9,20,null,null,15,7]，\n```\n    3\n   / \\\n  9  20\n    /  \\\n   15   7\n```\n返回它的最大深度 3 。\n### 解题思路：每层都判断是否有左右子树，如果有，深度+1。\n```\nclass TreeNode {\n    val: number\n    left: TreeNode | null\n    right: TreeNode | null\n    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n        this.val = (val===undefined ? 0 : val)\n        this.left = (left===undefined ? null : left)\n        this.right = (right===undefined ? null : right)\n    }\n}\n\nfunction maxDepth(root: TreeNode | null): number {\n  if (!root) {\n    return 0\n  } else {\n    const left = maxDepth(root.left)\n    const right = maxDepth(root.right)\n    return Math.max(left, right) + 1\n  }\n};\n```",
    "fileName": "104-二叉树的最大深度.md",
    "children": []
  }, {
    "name": "13-罗马数字转整数",
    "content": "# leecode 13: 罗马数字转整数\n### 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。\n```\n字符          数值\nI             1\nV             5\nX             10\nL             50\nC             100\nD             500\nM             1000\n```\n### 例如， 罗马数字 2 写做 II ，即为两个并列的 1 。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。\n### 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：\n* I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。\n* X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 \n* C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。\n#### 示例 1：\n```\n输入: s = \"III\"\n输出: 3\n```\n#### 示例 2：\n```\n输入: s = \"MCMXCIV\"\n输出: 1994\n解释: M = 1000, CM = 900, XC = 90, IV = 4.\n```\n\n### 解题思路：比较当前数据和后一个数据对比，如果后一个大于前面一个则减去当前的值。\n```\nfunction romanToInt(s: string): number {\n  // 枚举\n  const enums = {\n    I: 1,\n    V: 5,\n    X: 10,\n    L: 50,\n    C: 100,\n    D: 500,\n    M: 1000\n  }\n  let result = 0 // 结果\n  const length = s.length - 1\n\n  for (let i = 0; i <= length; ++i) {\n    const value = enums[s[i]]\n    if (i < length && value < enums[s[i + 1]]) {\n      result -= value\n    } else {\n      result +=value\n    }\n  }\n\n  return result\n}\n```",
    "fileName": "13-罗马数字转整数.md",
    "children": []
  }, {
    "name": "14-最长公共前缀",
    "content": "# leecode 14: 最长公共前缀\n### 查找数组中最长公共前缀，没有则返回空。\n#### 示例 1：\n```\n输入：strs = [\"flower\",\"flow\",\"flight\"]\n输出：\"fl\"\n```\n#### 示例 2：\n```\n输入：strs = [\"dog\",\"racecar\",\"car\"]\n输出：\"\"\n解释：输入不存在公共前缀。\n```\n### 解题思路：获取第一个数组数据，并进行循环比对。\n```\nfunction longestCommonPrefix(strs: string[]): string {\n  if (strs.length === 0) return ''\n  let first = strs[0]\n\n  for (let i = 0; i < strs.length; i++) {\n    let j = 0\n    for (; j < first.length && j < strs[i].length; j++) {\n      if (first[j] !== strs[i][j]) break\n    }\n    first = first.substring(0, j)\n    if (first === '') return first\n  }\n\n  return first\n};\n```",
    "fileName": "14-最长公共前缀.md",
    "children": []
  }, {
    "name": "20-有效的括号",
    "content": "# leecode 20: 有效的括号\n### 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。\n### 有效字符串需满足：\n1. 左括号必须用相同类型的右括号闭合。\n2. 左括号必须以正确的顺序闭合。\n#### 示例 1：\n```\n输入：s = \"{[]}\"\n输出：true\n```\n#### 示例 2：\n```\n输入：s = \"([)]\"\n输出：false\n```\n### 解题思路：\n1. 如果参数为奇数，则返回false: if (s.length % 2 === 1) return false\n2. 新建一个Map，key为括号左边，value为括号邮编。\n3. 当识别到左边括号时，推入cache数组，但没识别到时，判断cache数组最后一位是否相等，如果不等则为false。\n```\nfunction isValid(s: string): boolean {\n  if (s.length % 2 === 1) return false\n  const cache: string[] = []\n  const maps = new Map([\n    ['(', ')'],\n    ['[', ']'],\n    ['{', '}']\n  ])\n  \n  for (let value of s) {\n    if (maps.has(value)) {\n      cache.push(maps.get(value))\n    } else {\n      if (value === cache[cache.length - 1]) {\n        cache.pop()\n      } else {\n        return false\n      }\n    }\n  }\n\n  return cache.length === 0\n};\n```",
    "fileName": "20-有效的括号.md",
    "children": []
  }, {
    "name": "21-合并两个有序链表",
    "content": "# leecode 21: 合并两个有序链表\n### 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。\n#### 示例 1：\n```\n输入：l1 = [1,2,4], l2 = [1,3,4]\n输出：[1,1,2,3,4,4]\n```\n#### 示例 2：\n```\n输入：l1 = [], l2 = []\n输出：[]\n```\n#### 示例 3：\n```\n输入：l1 = [], l2 = [0]\n输出：[0]\n```\n### 解题思路：设置一个哑指针，对比两个链表中最小的指，将指针指向最小链表，并将该链表值指向下一位，以此类推。\n```\nclass ListNode {\n  val: number\n  next: ListNode | null\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = (val === undefined ? 0 : val)\n    this.next = (next === undefined ? null : next)\n  }\n}\n\n// @lc code=start\nfunction mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {\n  const prehead = new ListNode(-1) // 哑节点\n  let prev = prehead\n  let num = 0\n\n  while(list1 !== null && list2 !== null) {\n    if (list1.val <= list2.val) {\n      prev.next = list1\n      list1 = list1.next\n    } else {\n      prev.next = list2\n      list2 = list2.next\n    }\n    console.log(num++, prev, prehead)\n    prev = prev.next\n  }\n\n  // 合并list1和list2最多只有一个未被合并，我们在链表末尾指向未合并的链表即可\n  prev.next = list1 === null ? list2 : list1\n\n  return prehead.next\n};\n```",
    "fileName": "21-合并两个有序链表.md",
    "children": []
  }, {
    "name": "26-删除有序数组中的重复项",
    "content": "# leecode 26: 删除有序数组中的重复项\n### 给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使每个元素 只出现一次 ，返回删除后数组的新长度。\n### 不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。\n#### 示例 1：\n```\n输入：nums = [1,1,2]\n输出：2, nums = [1,2]\n解释：函数应该返回新的长度 2 ，并且原数组 nums 的前两个元素被修改为 1, 2 。不需要考虑数组中超出新长度后面的元素。\n```\n#### 示例 2：\n```\n输入：nums = [0,0,1,1,1,2,2,3,3,4]\n输出：5, nums = [0,1,2,3,4]\n解释：函数应该返回新的长度 5 ， 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4 。不需要考虑数组中超出新长度后面的元素。\n```\n### 解题思路：\n1. 设置快指针和慢指针：let fast = 1, slow = 1\n2. nums是一个已按升序排列的数组，快指针和上一个快指针不同时，则是新的数，则更新数组慢指针的下的数据。\n<img src=\"./images/2021-11-28.gif\">\n```\nfunction removeDuplicates(nums: number[]): number {\n  const lenth = nums.length\n  if (lenth === 0) return 0\n  // 创建慢指针和快指针\n  let fast = 1, slow = 1\n\n  while (fast < lenth) {\n    if (nums[fast] !== nums[fast - 1]) {\n      nums[slow] = nums[fast]\n      ++slow\n    }\n    ++fast\n  }\n\n  return slow\n};\n```",
    "fileName": "26-删除有序数组中的重复项.md",
    "children": []
  }, {
    "name": "263-丑数",
    "content": "# leecode 263: 丑数\n### 给你一个整数 n ，请你判断 n 是否为 丑数 。如果是，返回 true ；否则，返回 false 。\n### 丑数 就是只包含质因数 2、3 和/或 5 的正整数。\n#### 示例1：\n``` \n输入：n = 6\n输出：true\n解释：6 = 2 × 3\n示例 2：\n``` \n#### 示例2：\n``` \n输入：n = 8\n输出：true\n解释：8 = 2 × 2 × 2\n``` \n#### 示例3：\n``` \n输入：n = 14\n输出：false\n解释：14 不是丑数，因为它包含了另外一个质因数 7 。\n``` \n#### 示例4：\n``` \n输入：n = 1\n输出：true\n解释：1 通常被视为丑数。\n``` \n### 解题思路：循环除2、3、5，当除剩1时为丑数，如果不行则为false\n```\nfunction isUgly(n: number): boolean {\n  let ans = false\n\n  while (n % 2 === 0 && n > 0) {\n    n = n / 2\n    if (n === 0) ans = true\n  }\n\n  while (n % 3 === 0 && n > 0) {\n    n = n / 3\n    if (n === 0) ans = true\n  }\n\n  while (n % 5 === 0 && n > 0) {\n    n = n / 5\n    if (n === 0) ans = true\n  }\n\n  if (n === 1) return true\n\n  return ans\n};\n```",
    "fileName": "263-丑数.md",
    "children": []
  }, {
    "name": "27-移除元素",
    "content": "# leecode 27: 移除元素\n### 给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。\n### 不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地 修改输入数组。\n### 元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。\n#### 示例 1：\n```\n输入：nums = [3,2,2,3], val = 3\n输出：2, nums = [2,2]\n解释：函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。你不需要考虑数组中超出新长度后面的元素。例如，函数返回的新长度为 2 ，而 nums = [2,2,3,3] 或 nums = [2,2,0,0]，也会被视作正确答案。\n```\n#### 示例 2：\n```\n输入：nums = [0,1,2,2,3,0,4,2], val = 2\n输出：5, nums = [0,1,4,0,3]\n解释：函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。注意这五个元素可为任意顺序。你不需要考虑数组中超出新长度后面的元素。\n```\n### 解题思路：\n1. 设置双指针来定义数组第一位和最后一位：let left = 0, right = nums.length\n2. 遍历数组，当数组当前值等于要删除值时，当前值和right指针交换，当前right指针后退一位，否则left指针前进一位。\n```\nfunction removeElement(nums: number[], val: number): number {\n  const lenth = nums.length\n  if (lenth === 0) return 0\n\n  let left = 0, right = nums.length\n\n  while (left < right) {\n    if (nums[left] === val) {\n      nums[left] = nums[right - 1]\n      right--\n    } else {\n      left++\n    }\n  }\n\n  return left\n};\n```",
    "fileName": "27-移除元素.md",
    "children": []
  }, {
    "name": "28-实现 strStr() (indexOf)",
    "content": "# leecode 28: 实现 strStr()\n### 给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。\n#### 示例 1：\n```\n输入：haystack = \"hello\", needle = \"ll\"\n输出：2\n```\n#### 示例 2：\n```\n输入：haystack = \"aaaaa\", needle = \"bba\"\n输出：-1\n```\n#### 示例 3：\n```\n输入：haystack = \"\", needle = \"\"\n输出：0\n```\n### 解题：\n```\nfunction strStr(haystack: string, needle: string): number {\n  return haystack.indexOf(needle)\n};\n```",
    "fileName": "28-实现 strStr() (indexOf).md",
    "children": []
  }, {
    "name": "35-搜索插入位置",
    "content": "# leecode 35: 搜索插入位置\n### 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。\n### 请必须使用时间复杂度为 O(log n) 的算法。\n#### 示例 1：\n```\n输入: nums = [1,3,5,6], target = 5\n输出: 2\n```\n#### 示例 2：\n```\n输入: nums = [1,3,5,6], target = 0\n输出: 0\n```\n#### 示例 3：\n```\n输入: nums = [1], target = 0\n输出: 0\n```\n### 解题思路：设定左右三个变量，每次取中间值进行对比，如果目标值小于中间值，右值减少1，否则左值加1。\n### PS: >>(右移) = x / 2^y 取整\n```\nfunction searchInsert(nums: number[], target: number): number {\n  const { length } = nums\n  let left = 0, right = length - 1, ans = length\n  while (left <= right) {\n    let mid = ((right - left) >> 1) + left\n    if (target <= nums[mid]) {\n      ans = mid\n      right = mid - 1\n    } else {\n      left = mid + 1\n    }\n  }\n\n  return ans\n};\n```",
    "fileName": "35-搜索插入位置.md",
    "children": []
  }, {
    "name": "53-最大子序和(不解)",
    "content": "# leecode 53: 最大子序和\n### 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。\n### 子数组 是数组中的一个连续部分。\n#### 示例 1：\n```\n输入：nums = [-2,1,-3,4,-1,2,1,-5,4]\n输出：6\n解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。\n```\n#### 示例 2：\n```\n输入：nums = [1]\n输出：1\n```\n#### 示例 3：\n```\n输入：nums = [5,4,-1,7,8]\n输出：23\n```\n### 解题思路：\n1. 创建答案变量ans和总和变量sum\n2. 遍历数组，如果sum大于0则为有用数据，否则用遍历的新数据替换sum\n3. 对比ans和sum大小，最大值为最新的ans\n```\nfunction maxSubArray(nums: number[]): number {\n  let ans = nums[0];\n  let sum = 0\n  for (let item of nums) {\n    if (sum > 0) {\n      sum += item\n    } else {\n      sum = item\n    }\n    ans = Math.max(ans, sum)\n  }\n\n  return ans\n};\n```",
    "fileName": "53-最大子序和(不解).md",
    "children": []
  }, {
    "name": "58-最后一个单词的长度",
    "content": "# leecode 58: 最后一个单词的长度\n### 给你一个字符串 s，由若干单词组成，单词前后用一些空格字符隔开。返回字符串中最后一个单词的长度。\n### 单词 是指仅由字母组成、不包含任何空格字符的最大子字符串。\n#### 示例 1：\n```\n输入：s = \"Hello World\"\n输出：5\n```\n#### 示例 2：\n```\n输入：s = \"   fly me   to   the moon  \"\n输出：4\n```\n#### 示例 3：\n```\n输入：s = \"luffy is still joyboy\"\n输出：6\n```\n### 解题思路：\n1. 去除尾部空格\n2. 从尾部开始遍历数组，遇到空格则退出\n```\nfunction lengthOfLastWord(s: string): number {\n  let index = s.length - 1\n  // 清除尾部空格\n  while (s[index] === ' ') {\n    index--\n  }\n\n  let ans = 0\n  while (s[index] !== ' ' && index >= 0) {\n    ans++\n    index--\n  }\n\n  return ans\n};\n```",
    "fileName": "58-最后一个单词的长度.md",
    "children": []
  }, {
    "name": "66-加一",
    "content": "# leecode 66: 加一\n### 单词 是指仅由字母组成、不包含任何空格字符的最大子字符串。\n### 给定一个由 整数 组成的 非空 数组所表示的非负整数，在该数的基础上加一。\n### 最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。\n### 你可以假设除了整数 0 之外，这个整数不会以零开头。\n#### 示例 1：\n```\n输入：digits = [1,2,3]\n输出：[1,2,4]\n解释：输入数组表示数字 123。\n```\n#### 示例 2：\n```\n输入：digits = [4,3,2,1]\n输出：[4,3,2,2]\n解释：输入数组表示数字 4321。\n```\n#### 示例 3：\n```\n输入：digits = [0]\n输出：[1]\n```\n### 解题思路：\n1. 创建加一的数据\n2. 从尾部遍历数组，判断尾数+1是否等于10，等于10则当前数据为0，前进一位在+1，否则就清空加一数据\n3. 当循环完数组，加一数据不为0时，则在首部添加一个1的数据\n```\nfunction plusOne(digits: number[]): number[] {\n  const { length } = digits\n  let forward = 1 // 进一\n  \n  for (let i = length - 1; i >= 0; i--) {\n    const value = digits[i] + forward\n    if (value >= 10) {\n      digits[i] = 0\n    } else {\n      forward = 0\n      digits[i] = value\n      return digits\n    }\n  }\n\n  // 当还有值时，填充首位为1\n  if (forward) digits.unshift(1)\n\n  return digits\n};\n```",
    "fileName": "66-加一.md",
    "children": []
  }, {
    "name": "67-二进制求和(不优)",
    "content": "# leecode 67: 二进制求和\n### 给你两个二进制字符串，返回它们的和（用二进制表示）。\n### 输入为 非空 字符串且只包含数字 1 和 0。\n#### 示例 1：\n```\n输入: a = \"11\", b = \"1\"\n输出: \"100\"\n```\n#### 示例 2：\n```\n输入: a = \"1010\", b = \"1011\"\n输出: \"10101\"\n```\n### 解题思路：\n1. 置换数组，a为最大数组，创建进位和b数组的长度\n2. 尾遍历最大数组，尾数之和在加进位，如果和大于1则进位+1，前移动一位，以此类推\n```\nfunction addBinary(a: string, b: string): string {\n  if (a.length < b.length) {\n    [a, b] = [b, a]\n  }\n\n  let ans = ''\n  let bLength = b.length - 1\n  let forward = 0\n\n  for (let i = a.length - 1; i >= 0; i--) {\n    if (b[bLength] || forward > 0) {\n      const bValue = b[bLength] ? parseInt(b[bLength]) : 0\n      const sum = parseInt(a[i]) + bValue + forward\n      switch (sum) {\n        case 3:\n          forward = 1\n          ans = `1${ans}`\n          break\n\n        case 2:\n          forward = 1\n          ans = `0${ans}`\n          break\n\n        default:\n          forward = 0\n          ans = `${sum}${ans}`\n          break\n      }\n    } else {\n      ans = `${a[i]}${ans}`\n    }\n    bLength--\n  }\n\n  if (forward) ans = `1${ans}`\n\n  return ans\n};\n```",
    "fileName": "67-二进制求和(不优).md",
    "children": []
  }, {
    "name": "69-求平方根Sqrt(x)",
    "content": "# leecode 69：求平方根Sqrt(x)\n### 给你一个非负整数 x ，计算并返回 x 的 算术平方根 。\n### 由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。\n### 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。\n#### 示例 1：\n```\n输入：x = 4\n输出：2\n```\n#### 示例 2：\n```\n输入：x = 8\n输出：2\n解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。\n```\n### 解题思路：\n1. 二分查询法，创建左右变量\n2. left小于等于right循环，求中间值，中间值的方小于等于值，left为中间值+1，否则right等于中间值减1\n```\nfunction mySqrt(x: number): number {\n  let left = 0\n  let right = x\n\n  while (left <= right) {\n    const mid = left + ((right - left) >> 1)\n    if (mid * mid <= x) {\n      left = mid + 1\n    } else {\n      right = mid - 1\n    }\n  }\n\n  return right\n};\n```",
    "fileName": "69-求平方根Sqrt(x).md",
    "children": []
  }, {
    "name": "70-爬楼梯(不解)",
    "content": "# leecode 70: 爬楼梯\n### 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。\n### 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？\n### 注意：给定 n 是一个正整数。\n#### 示例 1：\n```\n输入： 2\n输出： 2\n解释： 有两种方法可以爬到楼顶。\n1.  1 阶 + 1 阶\n2.  2 阶\n```\n#### 示例 1：\n```\n输入： 3\n输出： 3\n解释： 有三种方法可以爬到楼顶。\n1.  1 阶 + 1 阶 + 1 阶\n2.  1 阶 + 2 阶\n3.  2 阶 + 1 阶\n```\n### 解题思路： 每次只爬1级或2级，当阶级大于等于3时，公式成立：f(x) = f(x - 1) + f(x - 2)\n```\nfunction climbStairs(n: number): number {\n  let p = 0, q = 0, r = 1\n  for (let i = 1; i <= n; ++i) {\n    p = q\n    q = r\n    r = p + q\n  }\n  return r\n};\n```",
    "fileName": "70-爬楼梯(不解).md",
    "children": []
  }, {
    "name": "83-删除排序链表中的重复元素",
    "content": "# leecode 83: 删除排序链表中的重复元素\n### 存在一个按升序排列的链表，给你这个链表的头节点 head ，请你删除所有重复的元素，使每个元素 只出现一次 。\n### 返回同样按升序排列的结果链表。\n#### 示例 1：\n```\n输入：head = [1,1,2]\n输出：[1,2]\n```\n#### 示例 2：\n```\n输入：head = [1,1,2,3,3]\n输出：[1,2,3]\n```\n### 解题思路：循环数组，当下个值等于当前值时，跳过下个值，指针指向next.next\n```\nclass ListNode {\n  val: number\n  next: ListNode | null\n  constructor(val?: number, next?: ListNode | null) {\n    this.val = (val===undefined ? 0 : val)\n    this.next = (next===undefined ? null : next)\n  }\n}\n\nfunction deleteDuplicates(head: ListNode | null): ListNode | null {\n  if (!head) return head\n  let ans = head\n\n  while (ans.next) {\n    if (ans.val === ans.next.val) {\n      ans.next = ans.next.next\n    } else {\n      ans = ans.next\n    }\n  }\n\n  return head\n};\n```",
    "fileName": "83-删除排序链表中的重复元素.md",
    "children": []
  }, {
    "name": "88-合并两个有序数组",
    "content": "# leecode 88: 合并两个有序数组\n### 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。\n### 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。\n### 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。\n#### 示例 1：\n```\n输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3\n输出：[1,2,2,3,5,6]\n解释：需要合并 [1,2,3] 和 [2,5,6] 。\n合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。\n```\n#### 示例 2：\n```\n输入：nums1 = [1], m = 1, nums2 = [], n = 0\n输出：[1]\n解释：需要合并 [1] 和 [] 。\n合并结果是 [1] 。\n```\n#### 示例 3：\n```\n输入：nums1 = [0], m = 0, nums2 = [1], n = 1\n输出：[1]\n解释：需要合并的数组是 [] 和 [1] 。\n合并结果是 [1] 。\n注意，因为 m = 0 ，所以 nums1 中没有元素。nums1 中仅存的 0 仅仅是为了确保合并结果可以顺利存放到 nums1 中。\n```\n### 解题思路：\n1. 使用双指针尾递归查找: let p1 = m - 1, p2 = n - 1\n2. 创建尾部最后一位的值: let laster = m + n - 1\n3. 递归数组，当p1为-1时，则直接赋值nums2[p2]的值，以此类推\n4. 当nums1的值大于nums2的值时，赋值当前值\n```\nfunction merge(nums1: number[], m: number, nums2: number[], n: number): void {\n  let p1 = m - 1, p2 = n - 1\n  let laster = m + n - 1\n  let cur = undefined\n  while (p1 >= 0 || p2 >= 0) - ur300{\n    if (p1 === -1) {\n      cur = nums2[p2--]\n    } else if (p2 === -1) {\n      cur = nums1[p1--]\n    } else if (nums1[p1] > nums2[p2]) {\n      cur = nums1[p1--]\n    } else {\n      cur = nums2[p2--]\n    }\n    nums1[laster--] = cur\n  }\n};\n```\n",
    "fileName": "88-合并两个有序数组.md",
    "children": []
  }, {
    "name": "94-二叉树的中序遍历",
    "content": "# leecode 94: 二叉树的中序遍历\n### 给定一个二叉树的根节点 root ，返回它的 **中序** 遍历。\n#### 示例 1：\n```\n输入：root = [1,null,2,3]\n输出：[1,3,2]\n```\n#### 示例 2：\n```\n输入：root = [1]\n输出：[1]\n```\n### root参数转换[3,9,20,null,null,15,7]\n```\n    3\n   / \\\n  9  20\n    /  \\\n   15   7\n```\n### 解题思路：使用递归方法，当有左子树则返回，如果没有则赋值。\n```\nclass TreeNode {\n    val: number\n    left: TreeNode | null\n    right: TreeNode | null\n    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {\n        this.val = (val===undefined ? 0 : val)\n        this.left = (left===undefined ? null : left)\n        this.right = (right===undefined ? null : right)\n    }\n}\n\nfunction inorderTraversal(root: TreeNode | null): number[] {\n  const res = []\n  console.log('root:', root)\n  const inorder = (root) => {\n    if (!root) return\n    inorder(root.left)\n    res.push(root.val)\n    inorder(root.right)\n  }\n  inorder(root)\n  return res\n};\n```",
    "fileName": "94-二叉树的中序遍历.md",
    "children": []
  }, {
    "name": "images",
    "content": "",
    "fileName": "images",
    "children": [{
      "name": "2021-11-28.gif",
      "content": "",
      "fileName": "2021-11-28.gif",
      "children": []
    }]
  }]
}, {
  "name": "README",
  "content": "# 个人博客",
  "fileName": "README.md",
  "children": []
}]