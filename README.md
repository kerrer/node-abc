
##一个用nodejs写的分布式服务框架，创建该框架的目的是为了打造快速消费的轻量级服务体系，要易于使用及安装部署。一般分布式服务体系至少由三个部分组成：服务提供者，服务消费者及注册中心。该框架为服务提供者提供了基础开发模型。

## 框架文件布局:
    - bin: 执行文件目录，主要用来启动整个框架的服务，包括向注册中心注册src/main里的服务，并在主机上注册端口，将服务绑定到端口。默认服务监听端口是5004.
    - src: 源文件目录，所有产品开发服务都在这个目录里，包括服务接口方法的开发，一些配置性的文件，数据模型定义文件。
       - main       源代码主目录，编写服务接口的主要生成目录。这个目录可以建立子目录，以便于分类管理并归组各服务
       - resources  资源类文件，包括各种加载的配置文件，比如服务启动的参数设置：服务绑定端口，服务绑定ip地址等等。还有一些数据库连接参数。可分文件设置参数
       - entity     数据表模型定义目录，主要是将数据库里的表格映射到程序里的实体对象，用来操控数据表的增，删，查，改。
       - test       测试用目录。整个框架的测试都是基于某个服务接口来进行的单元测试。单元测试用的框架是nodeunit。
    - node_modules： 模块安装目录，在项目根目录下，通过npm insall或npm update来安装模块，该目录是自动生成的。
    - package.json： 项目及依赖管理配置文件。npm命令需要根据此文件来安装管理模块。
    - Gruntfile.js:  项目构建文件。编译项目时需要根据此文件来生成最终的可用的代码，即可以用来部署的项目代码，全部可用代码都输出到target/services目录里.以及服务报告生成目录target/out。
    
## 关于服务的注册和查找
  **服务的注册*
   当项目启动时，注册程序会扫描services目录里的all.services文件（这个文件在项目构建时自动生成，主要内容是服务接口的相关信息，主要是为注册程序使用，文件为加密内容）
   单个服务在注册中心的存储格式以key-value形式存储，如下：
   /Services/project/hospital/getHospitalInfoTest/192.168.56.11:5004    "name:dotor,call:doctor,ip:192.168.56.11,port:5004,desc..........."
   /Services/project/hospital/addHospital/192.168.56.11:5004            "name:dotor,call:doctor,ip:192.168.56.11,port:5004,desc..........."
   /Services/project/hospital/editHospital/192.168.56.11:5004           "name:dotor,call:doctor,ip:192.168.56.11,port:5004,desc..........."
   /Services/project/hospital/delHospital/192.168.56.11:5004            "name:dotor,call:doctor,ip:192.168.56.11,port:5004,desc..........."
   其中：
   hospital - 为项目名称，
   getHospitalInfoTest、addHospital、editHospital、delHospital - 为服务接口调用名称，
   192.168.56.11:5004 - 为此服务运行所在的主机ip和端口
  
  **服务的查找*
   服务查找时，必须传入 "项目名称"和"服务接口调用名称"，并组装成如下key： "/Services/project/[项目名称]/[服务接口调用名称]", 来查找所有服务的ip:port,如有多条记录返回，则选择其中一个，然后再组装一个key："/Services/project/[项目名称]/[服务接口调用名称]/[ip:port]",最终由这个key来获取服务接口的value值，即服务调用接口的相关信息。
   
      
## 项目依赖模块
  【产品环境下必须用模块】
   - yxlog   日志模块，提供程序运行时写日志用。
   - death   捕作程序运行异常或崩溃
   - node-db 数据库连接及操作模块
   - string  字符串操作模块
   - service 服务接口注册模块，包括服务启动，监听，与注册中心通信，处理服务调用。
 【开发测试环境下必须用模块】
   - grunt-contrib-service  构建及生成服务接口的报告
   - grunt  编译，构建，测试用包装模块
   - grunt-contrib-clean 清理项目构建时产生的目录和文件
   - grunt-contrib-compress 压缩文件用模块
   - grunt-contrib-internal 定时任务用模块
   - grunt-contrib-jshint   js文件语法检查模块
   - grunt-contrib-nodeunit 单元测试用模块
   - grunt-contrib-uglify   js文件格式化使用模块
   - grunt-contrib-watch    文件监听（文件的改动）时使用模块
   - grunt-concurrent       再grunt里使用并行执行任务
   - grunt-contrib-nodemon  grunt里线程deamon运行
  
## 开发
 1. 安装开发环境 nodejs，grunt,git 
   首先安装 [nodejs](http://www.nodejs.org),应根据你所在的平台选择Windows或者Linux安装包。
   其次要安装git客户端，请确保git的执行命令在path目录下。在命令窗口输入git --version来验证git是否正确安装。
   最后安装grunt，请在命令窗口中输入: npm install -g grunt-cli
   
 2. 安装服务注册中心
   下载[etcd](https://github.com/coreos/etcd/releases/download/v2.2.0/etcd-v2.2.0-windows-amd64.zip). 下载完成后解压安装包。打开命令窗口，进入解压后的etcd-v2.2.0-windows-amd64，并启动etcd.exe. 请务必保留该窗口，不要关闭。
    
 3. 编译框架：
   - 进入项目框架目录，根据你所在的平台将package.json.linux或者package.json.win修改为package.json。
   - 在命令窗口中输入: npm install 来安装项目所有必须的模块。
   - 模块安装完成后，输入grunt来编译框架src目录源代码。
   - npm run dev，启动服务提供端。如没有出现任何错误，那么服务接口应该在输出的端口上等待接入使用了。
   
 4. 测试服务消费：
   项目根录下： grunt test:all

## 部署
  项目根录下执行grunt product,将在target目录下生成一个zip格式的压缩包。将压缩包上传服务器并解压缩，进入解压后的目录执行npm install --product安装产品环境下必须的模块。然后执行npm stat启动服务。


##Abount me
  <kerrer@126.com>
