import { Request } from 'express';

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, './src/public/images/');
    },
    filename: (req: any, file: any, cb: any) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const imageFilter = (req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: imageFilter });

export interface MulterRequest extends Request {
    file: any;
    fileValidationError: any;
}
