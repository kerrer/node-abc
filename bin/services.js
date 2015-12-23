require('services')(process.env.etcd_port,process.env.etcd_host).server(process.env.port,process.env.host).start(process.env.project_name);
