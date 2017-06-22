// Config for gruntfile
module.exports = {
  ftp_push_config: {
    staging: {
      authKey: "staging",
      host: "lind.github.io",
      dest: "lind/staging/dist/",
      port: 21,
    },
    production: {
      authKey: "production",
      host: "lind.github.io",
      dest: "lind/prod/dist/",
      port: 21,
    }
  }
}