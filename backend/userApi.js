const express = require("express");
const { v4: uuidv4 } = require("uuid");

class UserAPI {
  constructor() {
    this.router = express.Router();
    this.users = [];
    this.households = [];
    this.activities = [];
    this.streaks = [];
    this.setupRoutes();
  }

  setupRoutes() {
    // User routes
    this.router.post("/users", this.createUser.bind(this));
    this.router.get("/users/:id", this.getUser.bind(this));
    this.router.post("/users/:id/household", this.generateHouseholdQR.bind(this));
    this.router.get("/users/:id/stats", this.getUserStats.bind(this));
    this.router.post("/users/:id/activity", this.updateActivity.bind(this));
    this.router.get("/users/:id/streak-calendar", this.getStreakCalendar.bind(this));
    
    // Authentication routes
    this.router.post("/login", this.login.bind(this));
    this.router.post("/register", this.register.bind(this));
  }

  // Create new user with UUID
  createUser(req, res) {
    const { name, email, password } = req.body;
    const newUser = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    res.json(newUser);
  }

  // Fetch user by ID
  getUser(req, res) {
    const user = this.users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  }

  // Generate unique household QR code
  async generateHouseholdQR(req, res) {
    try {
      const userId = req.params.id;
      const user = this.users.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Check if user already has a household
      let household = this.households.find(h => h.userId === userId);
      
      if (!household) {
        household = {
          id: uuidv4(),
          userId,
          qrCode: `HOUSEHOLD-${userId}-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        this.households.push(household);
      }
      
      res.json(household);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate household QR code" });
    }
  }

  // Get user statistics
  async getUserStats(req, res) {
    try {
      const userId = req.params.id;
      const user = this.users.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Calculate user stats from activities
      const userActivities = this.activities.filter(a => a.userId === userId);
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
  }

  // Update user activity
  async updateActivity(req, res) {
    try {
      const userId = req.params.id;
      const user = this.users.find(u => u.id === userId);
      
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
      
      this.activities.push(newActivity);
      
      // Update streak
      const today = new Date().toDateString();
      const todayStreak = this.streaks.find(s => 
        s.userId === userId && new Date(s.date).toDateString() === today
      );
      
      if (!todayStreak) {
        this.streaks.push({
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
  }

  // Get streak calendar data
  async getStreakCalendar(req, res) {
    try {
      const userId = req.params.id;
      const days = parseInt(req.query.days) || 30;
      const user = this.users.find(u => u.id === userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const streakData = [];
      const userActivities = this.activities.filter(a => a.userId === userId);
      
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
  }

  // Authentication - Login
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Simple authentication (in real app, use proper password hashing)
      const user = this.users.find(u => u.email === email);
      
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
  }

  // Authentication - Register
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Check if user already exists
      if (this.users.some(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        name,
        email,
        createdAt: new Date(),
      };
      
      this.users.push(newUser);
      
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
  }
}

module.exports = UserAPI;