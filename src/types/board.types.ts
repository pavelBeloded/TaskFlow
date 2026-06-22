import { getBoardMembersProfiles } from '../services/boards.service.ts'

export type BoardMembersWithProfile = {
  board_id: string
  id: string
  role: string
  user_id: string
  profiles: {
    id: string
    name: string | null
    avatar_url: string | null
    email: string | null
  }
}

export type BoardMembers = Awaited<ReturnType<typeof getBoardMembersProfiles>>

export type MemberProfile = BoardMembers[number]['profiles']
export type MemberMap = Map<string, MemberProfile>
