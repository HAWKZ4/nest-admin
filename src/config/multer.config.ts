import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/products',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileExt = extname(file.originalname);

      // Validate file type
      if (!['.jpg', '.jpeg', '.png'].includes(fileExt.toLowerCase())) {
        return callback(
          new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed'),
          '',
        );
      }

      // file.fieldname: The field name used in the HTML form (e.g., "image").
      callback(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
    },
  }),
};
