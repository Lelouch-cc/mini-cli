const simpleGit = require('simple-git')('./');

module.exports = function (name, template) {
  return new Promise((resolve, reject) => {
    try {
      simpleGit.clone(`${template === 'Vue' ? 'git@github.com:Lelouch-cc/vue-mobile-template.git' : 'git@112.124.51.62:h5/templete-react.git'}`, name).exec(() => {
        resolve(true)
      })
    } catch (error) {
      reject(error)
    }
  })
}
