<h1 style="text-align:center">Doge 计算器</h1>

一款为有道词典笔 OS 设计的第三方计算器程序，使用 Vue.js 构建

## 特性

- 支持基本的四则运算 ✅
- 支持输入复杂表达式 ✅
- 可访问高级数学函数 ✅
- 响应式设计，适配不同词典笔屏幕尺寸 ⏭️
- 拥有高健壮性的内核，有效阻止各种错误输入 💪
- 低依赖性 -- 纯原生实现，无需任何 jsapi 编译作业，直接安装 ✌

## 预览

1024x240(A7 pro):
![1024x240(A7 pro)](https://cdn.mmoe.work/public/doge-calculator/1024*240.png)

560x170(S6 pro):
![560x170(S6 pro)](https://cdn.mmoe.work/public/doge-calculator/560*170.png)

## 实机

![实机演示](https://cdn.mmoe.work/public/doge-calculator/example.jpg)

## 安装

### 直接安装

1. 首先确保你已经能够访问词典笔的 adb，否则请先按照
[听秋念的教程](https://www.bilibili.com/read/cv40931661/?plat_id=35&share_from=article&share_medium=iphone&share_plat=ios&share_source=QQ&share_tag=s_i&timestamp=1741365791&unique_k=3UbJ6rn&opus_fallback=1)
获取 adb 权限

2. 在 [releases](https://github.com/adogecheems/doge-calculater/releases) 页面下载最新版本的安装包

3. 连接词典笔的 adb（教程中有写），并将 .amr 安装包文件 push 到词典笔 `/userdisk` 任意目录下（其实你在词典笔的 mtp 文件夹把文件直接拖进去也行...）

```bash
adb push <你安装包的路径/>all.amr /userdisk/Favorite/
```

4. 使用adb运行如下命令安装程序

```bash
adb shell "miniapp_cli install /userdisk/Favorite/all.amr" # 也可以是你自己选的路径
```

5. 你现在应该可以在桌面看见 Doge 计算器的粉色图标

### 从源码编译安装

老实讲意义不大。

1. 克隆项目存储库到本地

```bash
git clone https://github.com/adogecheems/doge-calculater.git
```

2. 安装依赖

```bash
npm install
```

3. 编译项目

```bash
npm run build:prod
```

编译完成后，在项目根目录下会出现 amr 文件，按上文一样操作即可安装

## 关于

作者：adogecheems  
使用的依赖：`mathjs`, `fs(haasui 原生)`  
许可证：AGPLv3

"Doge" 是“词典笔 OS 通用生态系统”的意思 (Dictpen OS Generic Ecosystem) 🐶

如果对你有什么帮助，请给我一个 star ⭐️～
