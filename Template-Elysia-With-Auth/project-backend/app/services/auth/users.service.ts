import type { CreateUsersDto, Users } from "../../types/auth/users.types"
import { userRepository } from "../../repositories/auth/users.repository"

export const usersService = {

  getAll() {
    return userRepository.findAll()
  },

  getById(id: number) {
    const item = userRepository.findById(id)
    if (!item) throw new Error(`Users ${id} not found.`)
    return item
  },

  getByEmail(email: string) {
    const item = userRepository.findByEmail(email);
    return item
  },

  create(dto: CreateUsersDto) {
    const base = dto.givenName.toLowerCase()
      .normalize("NFD")                        // rimuove accenti
      .replace(/[\u0300-\u036f]/g, "")         // rimuove diacritici
      .replace(/[^a-z0-9]/g, "-")             // caratteri speciali → -
      .replace(/-+/g, "-")                     // doppi trattini → -
      .replace(/^-|-$/g, "")                   // trim trattini bordi

    const suffix = Math.random().toString(36).slice(2, 6) // 4 chars random
    dto.handle = `${base}-${suffix}`         // → "marco-x7k2"

    return userRepository.insert(dto)
  },

  createFromEmail(email: string) {
    const username = email.split('@')[0] || 'User-' + Math.floor(Math.random() * 9999)

    const dto: CreateUsersDto = {
      email,
      verifiedEmail: false,
      name: username,
      givenName: username,
      familyName: '',
      picture: '',
      locale: '',
    }
    return userRepository.insert(dto)
  },

  update(id: number, dto: Partial<CreateUsersDto>) {
    const updated = userRepository.update(id, dto)
    if (!updated) throw new Error(`Users ${id} not found.`)
    return updated
  },

  delete(id: number) {
    const deleted = userRepository.remove(id)
    if (!deleted) throw new Error(`Users ${id} not found.`)
    return { ok: true }
  },

  verifyEmail(id: number) {
    const user = userRepository.findById(id)
    if (!user) throw new Error(`Users ${id} not found.`)
    return userRepository.update(id, { verifiedEmail: true })
  },

  updateUserData(id: number, data: Partial<Pick<Users, 'name' | 'givenName'>>) {
    const user = userRepository.findById(id)
    if (!user) throw new Error(`Users ${id} not found.`)
    return userRepository.update(id, data)
  },

}
