import { Database } from './database.types'

export type Ticket = Database['public']['Tables']['tickets']['Row']
export type Product = Database['public']['Tables']['store_items']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']

export interface AppState {
    user: Profile | null
    isLoading: boolean
    notifications: Notification[]
}
