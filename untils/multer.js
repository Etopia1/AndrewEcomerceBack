// const multer = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../uploads')
//     },
//     filename: (req, file, cb) => {
//         // assign a unique name for the uploaded file
//         const uniqueName = Date.now() + "-" + Math.round(Math.random() * 100);
    
//         // create the file name with the original file extension
//         const extension = path.extname(file.originalname);
//         const fileName = `${uniqueName}${extension}`;
    
//         createImageBitmap(null, fileName);
//       },
// })

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith('image/')){
//         cb(null, true);
//     } else {
//         cb(new Error('Image only'));
//     }
// }

// const fileSize = {
//     limits: 1024 * 1024 * 10
// }

// const upload = multer({
//     storage,
//     fileFilter,
//     limits:  fileSize
// })

// module.exports = upload
// const multer = require('multer');



// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../uploads'); // Directory for temporary files
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only images are allowed!'));
//         }
//     },
// });

// module.exports = upload;


const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads'); // Temporary storage directory
    },
    filename: (req, file, cb) => {
        // Generate a unique name for the uploaded file
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1000);
        const extension = path.extname(file.originalname); // Get the file extension
        const fileName = `${uniqueName}${extension}`;
        cb(null, fileName);
    },
});

// File Filter for Images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept image files
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject non-image files
    }
};

// Multer Configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 3024 * 3024 * 50 }, // 10 MB limit
});

module.exports = upload;
