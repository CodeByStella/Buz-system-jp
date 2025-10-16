import { User } from "../models/user";

export const userRepository = {
  async findByEmail(email: string) {
    return User.findOne({ email }).lean();
  },

  async findById(id: string) {
    return User.findById(id).lean();
  },

  async create(user: {
    email: string;
    name: string;
    password: string;
    role?: "ADMIN" | "USER";
  }) {
    const created = await User.create(user);
    // return lean-like object
    return {
      _id: created._id,
      email: created.email,
      name: created.name,
      password: created.password,
      role: created.role,
      createdAt: (created as any).createdAt,
      updatedAt: (created as any).updatedAt,
    };
  },
};
