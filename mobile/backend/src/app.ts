import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// Auth Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MeetFleet Backend API" });
});

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/check", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    });

    res.json({ exists: !!user, user });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { phone, username, avatarUrl, emoji, gender, age, bio, interests, job, company } = req.body;

    if (!phone) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    const user = await prisma.user.create({
      data: {
        phone,
        username,
        avatarUrl,
        emoji,
        gender,
        age: age ? parseInt(age) : null,
        bio,
        job,
        company,
        interests: Array.isArray(interests) ? interests : [],
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio, avatarUrl, age, isPremium, job, company, interests } = req.body;

    const data: any = {
      username,
      bio,
      avatarUrl,
      job,
      company,
      age: typeof age === "string" ? (age ? parseInt(age) : null) : age ?? null,
    };

    if (Array.isArray(interests)) {
      data.interests = interests;
    }

    if (typeof isPremium === "boolean") {
      data.isPremium = isPremium;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    res.json(user);
  } catch (error) {
    console.error("Update me error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default app;