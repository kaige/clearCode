// 引入所需的模块
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

// 获取命令行参数作为要删除的文件夹的路径
const folder = process.argv[2];
console.log('Will Clear unused files in:', folder);
if (!folder) {
  console.log('请输入要删除的文件夹的路径作为参数。');
  process.exit(-1);
}

// 读取exclude.txt里的名称到一个数组里
const excludeNames = [];
try {
  const data = fs.readFileSync('exclude.txt', 'utf8');
  const lines = data.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line) {
      excludeNames.push(line);
      console.log('Exclude:', line);
    }
  }
} catch (err) {
  console.error(err);
}

// check if the file is an intermediate files for cpp and c# project
function isIntmediateFilesForCppCSharp(filePath) {
  //定义一个数组，存储要检查的后缀名
  let extensions = [".pdb", ".ilk", ".exp", ".cache", ".tlb"];
  //遍历数组，对每个后缀名进行判断
  for (let ext of extensions) {
    //如果文件路径以后缀名结尾，返回true
    if (filePath.endsWith(ext)) {
      return true;
    }
  }
  //如果没有匹配到任何后缀名，返回false
  return false;
}

// 循环遍历文件夹下所有以node_modules或target命名的文件夹，并删除它们里面的内容
clearFolder(folder);

console.log('Done.');

function clearFolder(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    for (let file of files) {
      const fullPath = path.join(folder, file);
      console.log('Processing: ', fullPath);
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isDirectory()) {
          if (file === 'node_modules' || file === 'target') {
            console.log('Built files for Javasciprt and Java projects');
            // 判断文件夹是否包含exclude.txt里的名称
            let exclude = false;
            for (let name of excludeNames) {
              if (fullPath.includes(name)) {
                exclude = true;
                break;
              }
            }
            // 根据判断结果决定是否删除文件夹内容
            if (!exclude) {
              console.log('Deleting', fullPath);
              rimraf(fullPath, err => {
                if (err) {
                  console.error(err);
                }
              });
            } else {
              console.log('Skipping', fullPath);
            }
          }
          else {
            files = [];
            clearFolder(fullPath);
          }
        }
        else {
          if (isIntmediateFilesForCppCSharp(fullPath)) {
            fs.unlink(fullPath, (err) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log('Deleting', fullPath);
            });
          }
          console.log('Skipping', fullPath);
        }
      });
    }
  });
}
