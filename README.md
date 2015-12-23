
##一个用nodejs写的分布式服务框架，创建该框架的目的是为了打造快速消费的轻量级服务体系，要易于使用及安装部署。一般分布式服务体系至少由三个部分组成：服务提供者，服务消费者及注册中心。该框架为服务提供者提供了基础开发模型。

##框架文件布局:
    - bin: 执行文件目录
    - src: 源文件目录
       - main 源代码主目录
       - resources  资源类文件，包括各种加载的配置文件
       - entity     数据表模型定义目录
       - test: 测试用目录
    - node_modules： 模块安装目录
    - package.json： 项目及依赖管理
    - Gruntfile.js:  项目构建文件
    
## 使用
 1. 安装开发环境 nodejs，grunt,git 
   首先安装 [nodejs 4.x](http://www.nodejs.org),应根据你所在的平台选择Windows或者Linux安装包。
   其次要安装git客户端，请确保git的执行命令在path目录下。在命令窗口输入git --version来验证git是否正确安装。
   最后安装grunt，请在命令窗口中输入: npm install -g grunt-cli
   
 2. 安装服务注册中心
   下载[etcd](https://github.com/coreos/etcd/releases/download/v2.2.0/etcd-v2.2.0-windows-amd64.zip). 下载完成后解压安装包。打开命令窗口，进入解压后的etcd-v2.2.0-windows-amd64，并启动etcd.exe. 请务必保留该窗口，不要关闭。
    
 3. 编译框架：
   - 进入项目框架目录，根据你所在的平台将package.json.linux或者package.json.win修改为package.json。
   - 在命令窗口中输入: npm install 来安装项目所有必须的模块。
   - 模块安装完成后，输入grunt来编译框架src目录源代码。
   - npm start [8080]，启动服务提供端。如没有出现任何错误，那么服务接口应该在输出的端口上等待接入使用了。
   
 4. 测试服务消费：
   项目根录下： grunt test:all或者grunt test:all:sometest

## 部署
  项目根录下执行grunt product,将在target目录下生成一个zip格式的压缩包。将压缩包上传服务器并解压缩，进入解压后的目录执行npm install --product安装产品环境下必须的模块。然后执行NODE_EVN=products npm stat [8080]启动服务。
  
## 开发

### Tools  

 Nodeclipse is free open-source project that grows with your contributions.

