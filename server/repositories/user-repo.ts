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
    name?: string;
    password: string;
    description?: string;
    role?: "ADMIN" | "USER";
    status?: "ACTIVE" | "PAUSED";
    subscriptionStartAt?: Date;
    subscriptionEndAt?: Date;
  }) {
    const created = await User.create(user);
    // return lean-like object
    return {
      _id: created._id,
      email: created.email,
      name: created.name,
      description: created.description,
      password: created.password,
      role: created.role,
      status: created.status,
      subscriptionStartAt: (created as any).subscriptionStartAt,
      subscriptionEndAt: (created as any).subscriptionEndAt,
      createdAt: (created as any).createdAt,
      updatedAt: (created as any).updatedAt,
    };
  },

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await User.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    
    return {
      users,
      totalPages,
      currentPage: page,
      totalUsers: total
    };
  },

  async updateById(id: string, updateData: {
    name?: string;
    description?: string;
    subscriptionStartAt?: Date | null;
    subscriptionEndAt?: Date | null;
  }) {
    return User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-password').lean();
  },

  async updateStatusById(id: string, status: "ACTIVE" | "PAUSED") {
    return User.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).select('-password').lean();
  },

  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  }
};
