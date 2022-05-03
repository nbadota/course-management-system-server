const fs = require('fs');
const Path = require('path');
const multer = require('@koa/multer');

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(Path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

function getExtension(name) {
  return name.substring(name.lastIndexOf('.') +1);
}

let id = null;

const storage = multer.diskStorage({
  // multer调用diskStorage可控制磁盘存储引擎
  destination: function(req, file, cb) {
    const {courtId: curId} = req.body;
    const path = Path.resolve(__dirname, '..', `static/images/${curId}`);
    if (!id || id !== curId) {
      try {
        mkdirsSync(path);
        id = curId;
      } catch (e) {
        throw e;
      }
    }
    cb(null, path);
  },
  filename: function(req, file, cb) {
    // 文件名使用cb回调更改，参数二是文件名，为了保证命名不重复，使用时间戳
    cb(null, `${file.fieldname}-${Date.now()}.${getExtension(file.originalname)}`);
  },
});

const upload = multer({
  storage,
});


module.exports = {
  upload,
};
