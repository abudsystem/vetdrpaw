import { UserRepository } from "@/repositories/user.repo";

export const UserService = {
  getMe: (id: string) => UserRepository.findById(id),
  findById: (id: string) => UserRepository.findById(id),
  findByIdWithPassword: (id: string) => UserRepository.findByIdWithPassword(id),
  changeRole: (id: string, newRole: string) =>
    UserRepository.updateRole(id, newRole),
  list: (filter: any) => UserRepository.list(filter),
  update: (id: string, data: any) => UserRepository.update(id, data),
  updatePassword: (id: string, hashedPassword: string) =>
    UserRepository.updatePassword(id, hashedPassword),
  delete: (id: string) => UserRepository.delete(id),
};
