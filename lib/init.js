#!/usr/bin/env node

const download = require('./download');
const fs = require('fs');
const chalk = require('chalk');
const symbols = require('log-symbols');
const inquirer = require('inquirer');
const ora = require('ora');
const handlebars = require('handlebars');
const path = require('path');
const validateNpmName = require('validate-npm-package-name');

function writePackage (fileName, meta) {
  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(fileName, result);
  }
}

function deleteFolder(dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const newPath = path.join(dir,files[i]);
    const stat = fs.statSync(newPath);
    if (stat.isDirectory()) {
      //如果是文件夹就递归下去
      deleteFolder(newPath);
    } else {
     //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);
}
// Sorry, name can no longer contain capital letters.
function validateTitle(name) {
  const res = validateNpmName(name);
  if (!res.validForNewPackages) {
    const error = (res.errors || []).concat(res.warnings || []);
    return `Sorry, ${error.join(' and ')}.`;
  } else {
    return true;
  }
}

module.exports = async function(name) {
  let template = '';
  if (!fs.existsSync(name)) {
    inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '请选择要使用的模板',
        choices: ['Vue', 'React']
      }
    ]).then(answers => {
      template = answers.type;
      inquirer.prompt([
        {
          name: 'name',
          message: 'Project name ',
          default: name,
          validate: validateTitle
        },
        {
          name: 'description',
          message: 'Project description '
        },
        {
          name: 'author',
          message: 'Author '
        }
      ]).then(async (answer) => {
        const spinner = ora('Download template...');
        spinner.start();
        const res = await download(name, template);
        if (res === true) {
          spinner.succeed();
          deleteFolder(`${name}/.git`);
          const packageJson = `${name}/package.json`;
          const indexPage = `${name}/public/index.html`;
          const meta = {
            name: answer.name,
            description: answer.description,
            author: answer.author
          }
          writePackage(packageJson, meta);
          writePackage(indexPage, meta);
          console.log(chalk.green('\n  Create success  🎉\n'));
          console.log(`  ${chalk.white('mini-cli')}    ${chalk.gray('Generated')}  ${chalk.gray(`"${name}"`)}\n`);
          console.log(chalk.gray('\n  To get started:\n'));
          console.log(chalk.gray(`\n    cd ${name}\n`));
          console.log(`    ${chalk.gray('npm install')} ${chalk.white('or')} ${chalk.gray('yarn install')}\n`);
          console.log(`    ${chalk.gray(`${template === 'Vue' ? 'npm run serve' : 'npm run start'}`)} ${chalk.white('or')} ${chalk.gray(`${template === 'Vue' ? 'yarn serve' : 'tarn start'}`)}\n\n`);
          console.log(chalk.gray('  Have fun with your project  ✨\n'));
        } else {
          spinner.fail();
          console.log(symbols.error, chalk.red('\nCreate error\n'));
        }
      })
    })
  } else {
    // 错误提示项目已存在，避免覆盖原有项目
    console.log(symbols.error, chalk.red('\nProject already exists\n'));
  }
};
