const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const users = [];
const plans = [
  {
    id: 1,
    name: "Basic",
    price: 9.99,
    duration: 30,
    features: ["5 Projects", "Basic Support", "1 GB Storage", "Email Support"],
  },
  {
    id: 2,
    name: "Pro",
    price: 29.99,
    duration: 30,
    features: [
      "Unlimited Projects",
      "Priority Support",
      "10 GB Storage",
      "24/7 Chat Support",
      "Advanced Analytics",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 99.99,
    duration: 30,
    features: [
      "Unlimited Everything",
      "Dedicated Support",
      "100 GB Storage",
      "Phone Support",
      "Custom Integrations",
      "API Access",
    ],
  },
];
const subscriptions = [];

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: "user",
    };

    users.push(user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/auth/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  });
});

app.get("/api/plans", (req, res) => {
  res.json(plans);
});

app.post("/api/subscribe/:planId", authenticateToken, (req, res) => {
  try {
    const planId = parseInt(req.params.planId);
    const plan = plans.find((p) => p.id === planId);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const existingSub = subscriptions.find(
      (s) => s.user_id === req.user.id && s.status === "active"
    );

    if (existingSub) {
      return res
        .status(400)
        .json({ message: "You already have an active subscription" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = {
      id: subscriptions.length + 1,
      user_id: req.user.id,
      plan_id: planId,
      start_date: startDate,
      end_date: endDate,
      status: "active",
    };

    subscriptions.push(subscription);

    res.status(201).json({
      message: "Subscription created successfully",
      subscription: {
        ...subscription,
        plan,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/my-subscription", authenticateToken, (req, res) => {
  const subscription = subscriptions.find(
    (s) => s.user_id === req.user.id && s.status === "active"
  );

  if (!subscription) {
    return res.status(404).json({ message: "No active subscription found" });
  }

  const plan = plans.find((p) => p.id === subscription.plan_id);

  res.json({
    ...subscription,
    plan,
  });
});

app.get("/api/admin/subscriptions", authenticateToken, isAdmin, (req, res) => {
  const enrichedSubs = subscriptions.map((sub) => {
    const user = users.find((u) => u.id === sub.user_id);
    const plan = plans.find((p) => p.id === sub.plan_id);

    return {
      ...sub,
      user: { id: user.id, name: user.name, email: user.email },
      plan,
    };
  });

  res.json(enrichedSubs);
});

// Create admin user on startup
const createAdminUser = async () => {
  const adminExists = users.find((u) => u.email === "admin@example.com");
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    users.push({
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Admin user created: admin@example.com / admin123");
  }
};

app.listen(PORT, () => {
  createAdminUser();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Add this route to get user statistics
app.get("/api/admin/users/stats", async (req, res) => {
  try {
    // Total users count
    const totalUsers = await User.countDocuments();

    // Users with active subscriptions
    const usersWithSubscriptions = await Subscription.distinct("user", {
      status: "active",
    });
    const usersWithActiveSubs = usersWithSubscriptions.length;

    // Users without subscriptions
    const usersWithoutSubs = totalUsers - usersWithActiveSubs;

    res.json({
      total: totalUsers,
      withSubscription: usersWithActiveSubs,
      withoutSubscription: usersWithoutSubs,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Error fetching user statistics" });
  }
});
