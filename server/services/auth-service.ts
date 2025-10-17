import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user-repo";
import { verifyPassword, hashPassword } from "../lib/auth";
import { config } from "../config/env";
import { seedSheetsForUser } from "../scripts/sheets";

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) return null;
    
    // Check if user is paused
    if (user.status === 'PAUSED') {
      throw new Error("このアカウントは停止されています");
    }

    // Check if subscription expired
    if (user.subscriptionEndAt) {
      const now = new Date();
      const end = new Date(user.subscriptionEndAt as any);
      if (!isNaN(end.getTime()) && end < now) {
        throw new Error("サブスクリプションの有効期限が切れています");
      }
    }
    
    const ok = await verifyPassword(password, user.password);
    if (!ok) return null;
    const token = jwt.sign(
      { id: String(user._id), email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    return {
      token,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  },

  async me(id: string) {
    const user = await userRepository.findById(id);
    if (!user) return null;
    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
      status: (user as any).status,
      subscriptionEndAt: (user as any).subscriptionEndAt,
    };
  },

  async signup(name: string, email: string, password: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return null;
    }
    const hashed = await hashPassword(password);
    const created = await userRepository.create({
      name,
      email,
      password: hashed,
    });
    // Seed initial sheets for this user in the background (fetch endpoint seeds on-demand if needed)
    seedSheetsForUser(String(created._id)).catch((e) => {
      console.error("Seeding sheets failed for user", created._id, e)
    })
    const token = jwt.sign(
      { id: String(created._id), email: created.email, role: created.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
    return {
      token,
      user: {
        id: String(created._id),
        email: created.email,
        name: created.name,
        role: created.role,
      },
    };
  },

  async createUserByAdmin(userData: {
    email: string;
    password: string;
    name?: string;
    description?: string;
    subscriptionStartAt?: string | Date;
    subscriptionEndAt?: string | Date;
  }) {
    const existing = await userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error("このメールアドレスは既に使用されています");
    }
    const hashed = await hashPassword(userData.password);
    const created = await userRepository.create({
      email: userData.email,
      name: userData.name,
      password: hashed,
      description: userData.description,
      role: "USER",
      status: "ACTIVE",
      subscriptionStartAt: userData.subscriptionStartAt ? new Date(userData.subscriptionStartAt) : undefined,
      subscriptionEndAt: userData.subscriptionEndAt ? new Date(userData.subscriptionEndAt) : undefined,
    });
    
    // Seed initial sheets for this user in the background to avoid request timeout
    seedSheetsForUser(String(created._id)).catch((e) => {
      console.error("Seeding sheets failed for user", created._id, e)
    })
    
    return {
      id: String(created._id),
      email: created.email,
      name: created.name,
      description: created.description,
      role: created.role,
      status: created.status,
      subscriptionStartAt: created.subscriptionStartAt,
      subscriptionEndAt: created.subscriptionEndAt,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  },
};
