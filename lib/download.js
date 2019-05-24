const simpleGit = require('simple-git')('./');

const baseUrl = 'git@github.com:Lelouch-cc/'

module.exports = function (name, template) {
  let path = '';

  switch (template) {
    case 'Vue-Mobile':
      path = 'vue-mobile-template';
      break;
    case 'Gulp-Mobile':
      path = 'gulp-mobile-template';
      break;
    default:
      break;
  }

  return new Promise((resolve, reject) => {
    if (!path) {
      const error = new Error('路径不能为空');
      reject(error);
    }
    try {
      simpleGit.clone(`${baseUrl}${path}.git`, name).exec(() => {
        resolve(true)
      })
    } catch (error) {
      reject(error);
    }
  })
}
