import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authService } from "../services/auth-service";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "名前、メール、パスワードが必要です" });
    }

    const result = await authService.signup(name, email, password);
    if (!result) {
      return res
        .status(409)
        .json({ error: "このメールは既に登録されています" });
    }

    const { token, user } = result;

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "サインアップに失敗しました" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "メールアドレスとパスワードが必要です" });
    }

    const result = await authService.login(email, password);
    if (!result) {
      return res.status(401).json({ error: "ユーザーが見つかりません" });
    }
    const { token, user } = result;

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none", // 'none' required for cross-origin in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "ログインに失敗しました";
    // For business-rule rejections (paused/expired), return 403 with message
    return res.status(403).json({ error: message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("auth-token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "none",
    path: "/",
  });
  res.json({ message: "ログアウトしました" });
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      return res.status(401).json({ error: "認証が必要です" });
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;

    const user = await authService.me(payload.id);

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません" });
    }

    // Invalidate cookie if user is paused or subscription expired
    const now = new Date();
    const expired = (user as any).subscriptionEndAt ? new Date((user as any).subscriptionEndAt) < now : false;
    if ((user as any).status === 'PAUSED' || expired) {
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("auth-token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "lax" : "none",
        path: "/",
      });
      return res.status(401).json({ error: (user as any).status === 'PAUSED' ? 'このアカウントは停止されています' : 'サブスクリプションの有効期限が切れています' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: "認証に失敗しました" });
  }
});

export default router;
