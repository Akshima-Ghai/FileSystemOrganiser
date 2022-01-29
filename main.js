const { dir } = require("console");
let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);
// console.log(inputArr);

// node main.js tree "dirPath"
// node main.js organize "dirPath"
// node main.js help
let types = {
  media: ["mp4", "mkv"],
  archives: ["zip", "rar", "tar", "ar", "xz"],
  documents: ["doc", "docx", "pdf", "xls", "xlsx", "txt"],
  app: ["exe", "pkg"],
};
let command = inputArr[0];
switch (command) {
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("please enter valid command");
}

function treeFn(dirPath) {
    // console.log("tree function implemented for", dirPath);
    if (dirPath == undefined) {
      console.log("pls enter valid path");
    } else {
      let doesExist = fs.existsSync(dirPath);
      if (doesExist) {
          treeHelper(dirPath,"");
      } else {
        console.log("pls enter the correct path");
      }
    }
}
function treeHelper(dirPath,indent) {
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile) {
        let fileName = path.basename(dirPath);
        console.log(indent+"|__"+fileName);
    } else {
        let dirName = path.basename(dirPath);
        console.log(indent + "|---" + dirName);
        let chidren = fs.readdirSync(dirPath);
        for (let i = 0; i < chidren.length; i++){
            let childPath = path.join(dirPath, chidren[i]);
            treeHelper(childPath, indent+"\t");
        }
    }
}
function organizeFn(dirPath) {
    // console.log("organize function implemented for", dirPath);
    let destPath;
    if (dirPath == undefined) {
        console.log("pls enter valid path");
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            destPath = path.join(dirPath, "organized_files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
        } else {
            console.log("pls enter the correct path");
        }
    }
    organizeHelper(dirPath,destPath)
}
function organizeHelper(src, dest) {
    let childNames = fs.readdirSync(src);
    console.log(childNames);

    for (let i = 0; i < childNames.length; i++){
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            let category = getCategory(childNames[i]);
            console.log(childNames[i], "belongs to ->", category);
            
            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    console.log(fileName, "copied to", category);
}
function getCategory(name) {
    let ext = path.extname(name);
    // console.log(ext);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++){
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}
function helpFn() {
    console.log(`
    List of All commands:
        node main.js tree "dirPath"
        node main.js organize "dirPath"
        node main.js help`);
}
