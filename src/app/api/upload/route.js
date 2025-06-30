// // pages/api/upload.js
// import nextConnect from 'next-connect';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Buat folder /public/uploads jika belum ada
// const uploadDir = path.join(process.cwd(), 'public/uploads');
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// // Konfigurasi multer
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadDir),
//     filename: (req, file, cb) => {
//       const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
//       cb(null, uniqueName);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) cb(null, true);
//     else cb(new Error('File bukan gambar'));
//   },
// });

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     res.status(501).json({ error: `Terjadi kesalahan: ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Metode ${req.method} tidak diizinkan` });
//   },
// });

// apiRoute.use(upload.array('images')); // menerima multiple images

// apiRoute.post((req, res) => {
//   const urls = req.files.map((file) => `/uploads/${file.filename}`);
//   res.status(200).json({ urls });
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // penting untuk multer
//   },
// };
