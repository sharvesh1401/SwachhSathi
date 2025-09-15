const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- API ROUTES ---

// Illegal Dumping Reporting Endpoint
app.post('/api/report', upload.single('photo'), (req, res) => {
  const { lat, lng, accuracy, timestamp } = req.body;
  const photo = req.file;

  if (!photo) {
    return res.status(400).json({ success: false, message: 'Photo is required.' });
  }

  // In a real app, you'd save this data to a database.
  const reportId = `REP-${Date.now()}`;
  const photoPath = `/uploads/${photo.filename}`;

  const newReport = {
    id: reportId,
    photoPath: photoPath,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    accuracy: parseFloat(accuracy),
    timestamp: timestamp
  };

  console.log('New Report Received:', newReport);

  res.status(201).json({
    success: true,
    data: newReport
  });
});


// Simple route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
