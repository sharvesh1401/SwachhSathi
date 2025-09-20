const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

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

// In-memory storage (replace with DB in real use)
let users = [];
let households = [];
let activities = [];
let streaks = [];

// --- USER API ROUTES ---

// Create new user with UUID
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: uuidv4(),
    name,
    email,
    createdAt: new Date(),
  };
  users.push(newUser);
  res.json(newUser);
});

// Fetch user by ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Generate unique household QR code
app.post("/api/users/:id/household", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if user already has a household
    let household = households.find(h => h.userId === userId);
    
    if (!household) {
      household = {
        id: uuidv4(),
        userId,
        qrCode: `HOUSEHOLD-${userId}-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      households.push(household);
    }
    
    res.json(household);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate household QR code" });
  }
});

// Get user statistics
app.get("/api/users/:id/stats", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Calculate user stats from activities
    const userActivities = activities.filter(a => a.userId === userId);
    const today = new Date().toDateString();
    const todayActivities = userActivities.filter(a => 
      new Date(a.timestamp).toDateString() === today
    );
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedActivities = userActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (sortedActivities.length > 0) {
      let lastDate = new Date(sortedActivities[0].timestamp);
      currentStreak = 1;
      
      for (let i = 1; i < sortedActivities.length; i++) {
        const currentDate = new Date(sortedActivities[i].timestamp);
        const diffTime = Math.abs(lastDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }
    
    // Calculate waste segregation (simplified)
    const wasteSegregation = {
      wet: { segregated: 0, pending: 0 },
      dry: { segregated: 0, pending: 0 },
      hazardous: { segregated: 0, pending: 0 }
    };
    
    userActivities.forEach(activity => {
      if (activity.wasteType && activity.amount) {
        const wasteType = activity.wasteType.toLowerCase();
        if (wasteSegregation[wasteType]) {
          wasteSegregation[wasteType].segregated += activity.amount;
        }
      }
    });
    
    res.json({
      todayPoints: todayActivities.reduce((sum, a) => sum + (a.points || 0), 0),
      totalPoints: userActivities.reduce((sum, a) => sum + (a.points || 0), 0),
      currentStreak,
      wasteSegregation
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user statistics" });
  }
});

// Update user activity
app.post("/api/users/:id/activity", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const { activityType, wasteType, amount, points } = req.body;
    const newActivity = {
      id: uuidv4(),
      userId,
      activityType,
      wasteType,
      amount,
      points: points || 10, // Default points
      timestamp: new Date().toISOString()
    };
    
    activities.push(newActivity);
    
    // Update streak
    const today = new Date().toDateString();
    const todayStreak = streaks.find(s => 
      s.userId === userId && new Date(s.date).toDateString() === today
    );
    
    if (!todayStreak) {
      streaks.push({
        userId,
        date: new Date().toISOString(),
        activities: [newActivity.id]
      });
    } else {
      todayStreak.activities.push(newActivity.id);
    }
    
    res.json({
      success: true,
      pointsEarned: newActivity.points,
      activity: newActivity
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update activity" });
  }
});

// Get streak calendar data
app.get("/api/users/:id/streak-calendar", async (req, res) => {
  try {
    const userId = req.params.id;
    const days = parseInt(req.query.days) || 30;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const streakData = [];
    const userActivities = activities.filter(a => a.userId === userId);
    
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const hasActivity = userActivities.some(a => 
        a.timestamp.split('T')[0] === dateStr
      );
      
      streakData.push({
        date: dateStr,
        hasActivity,
        points: hasActivity ? 
          userActivities
            .filter(a => a.timestamp.split('T')[0] === dateStr)
            .reduce((sum, a) => sum + (a.points || 0), 0) : 0
      });
    }
    
    // Calculate current streak
    let currentStreak = 0;
    const sortedActivities = userActivities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (sortedActivities.length > 0) {
      let lastDate = new Date(sortedActivities[0].timestamp);
      currentStreak = 1;
      
      for (let i = 1; i < sortedActivities.length; i++) {
        const currentDate = new Date(sortedActivities[i].timestamp);
        const diffTime = Math.abs(lastDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
          lastDate = currentDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }
    
    res.json({
      streakData,
      currentStreak
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch streak calendar data" });
  }
});

// Authentication - Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Simple authentication (in real app, use proper password hashing)
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // In a real app, you would verify the password hash here
    // For this example, we'll just check if password is provided
    if (!password) {
      return res.status(401).json({ error: "Password required" });
    }
    
    res.json({
      token: `token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Authentication - Register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date(),
    };
    
    users.push(newUser);
    
    res.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// --- FILE UPLOAD AND QR CODE ROUTES ---

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

// QR Code Generation Endpoint
app.get('/api/users/:id/qr', async (req, res) => {
  try {
    const userId = req.params.id;

    // You can encode any unique info here: userId, householdId, etc.
    const qrData = JSON.stringify({ userId });

    const qrImage = await QRCode.toDataURL(qrData); // generates base64 PNG

    res.json({ qr: qrImage });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});