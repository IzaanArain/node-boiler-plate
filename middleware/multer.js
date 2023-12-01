const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "profileImage") {
            cb(null, './uploads/profileImages/')
        }
        else if (file.fieldname == "otherImages") {
            cb(null, './uploads/otherImages/')
        }
        else if (file.fieldname == "eventImage") {
            cb(null, './uploads/eventImages/')
        }
        else if (file.fieldname == "chatFile") {
            cb(null, './uploads/chatFiles/')
        }
        else if (file.fieldname == "feedbackImage") {
            cb(null, './uploads/feedbackImages/')
        }
        else if (file.fieldname == "categoryImage") {
            cb(null, './uploads/categoryImages/')
        }
    },
    filename(req, file, callback) {
        callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: async (req, file, cb) => {
        if (!file) {
            cb(null, false);
        }
        else {
            cb(null, true);
        }
    }
});

module.exports = { upload } 
