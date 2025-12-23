import { User, IUser } from "@/models/User";
import dbConnect from "@/lib/db";

export const UserRepository = {
  create: async (data: Partial<IUser>): Promise<IUser> => {
    await dbConnect();
    return User.create(data);
  },

  findByEmail: async (email: string): Promise<IUser | null> => {
    await dbConnect();
    return User.findOne({ email });
  },

  findOne: async (filter: any): Promise<IUser | null> => {
    await dbConnect();
    return User.findOne(filter);
  },

  findById: async (id: string): Promise<IUser | null> => {
    await dbConnect();
    return User.findById(id).select("-password");
  },

  findByIdWithPassword: async (id: string): Promise<IUser | null> => {
    await dbConnect();
    return User.findById(id).select("+password");
  },

  updateRole: async (id: string, role: string): Promise<IUser | null> => {
    await dbConnect();
    return User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
  },

  updatePassword: async (id: string, hashedPassword: string): Promise<IUser | null> => {
    await dbConnect();
    return User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).select("-password");
  },

  list: async (filter: { role?: string | null; search?: string | null }) => {
    await dbConnect();
    const query: any = {};
    if (filter.role) query.role = filter.role;
    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: "i" } },
        { email: { $regex: filter.search, $options: "i" } },
      ];
    }
    return User.find(query).select("-password");
  },

  update: async (id: string, data: any) => {
    await dbConnect();
    return User.findByIdAndUpdate(id, data, { new: true }).select("-password");
  },

  delete: async (id: string) => {
    await dbConnect();
    return User.findByIdAndDelete(id);
  },
};
