module.exports = {
  apps: [{
    name: 'Kommunicate',
    script: './app.js',
    args: '--cron enable',
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'default'
    },
    env_test: {
      NODE_ENV: 'test'
    },
    env_production: {
      NODE_ENV: 'production'
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
