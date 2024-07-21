const fs = require("fs");
const removeImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
module.exports = removeImage;
