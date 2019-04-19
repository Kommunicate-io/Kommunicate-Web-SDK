module.exports = {
  apps: [{
    name: 'Kommunicate',
    script: './app.js',
    args: '--cron enable',
    interpreter : "node@8.11.4",
    error_file : "./logs/kommunicate-error.log",
    out_file : "./logs/kommunicate.log",
    instances: 1,
    autorestart: true,
    watch: false,
    exec_mode : "fork", //"cluster" ,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'default'
    },
    env_test: {
      NODE_ENV: 'test'
    },
    env_prod: {
      NODE_ENV: 'prod'
    }
  }],

  deploy: {
    test: {
      user: 'node',
      host: '172.31.17.248',
      port: '3991',
      ref: 'origin/master',
      repo: 'git@github.com:AppLozic/Kommunicate.git',
      path: '~/Kommunicateserver/Kommunicate/server',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env test'
    },
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:AppLozic/Kommunicate.git',
      path: '~/Kommunicateserver/Kommunicate/server',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env prod'
    }
  }
};
