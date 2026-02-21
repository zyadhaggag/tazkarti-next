export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            tickets: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    seat_location: string
                    price: number
                    image_url: string | null
                    description: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    seat_location: string
                    price: number
                    image_url?: string | null
                    description?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    seat_location?: string
                    price?: number
                    image_url?: string | null
                    description?: string | null
                }
            }
            store_items: {
                Row: {
                    id: string
                    created_at: string
                    name: string
                    price: number
                    image_url: string | null
                    description: string | null
                    features: string[] | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    name: string
                    price: number
                    image_url?: string | null
                    description?: string | null
                    features?: string[] | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    name?: string
                    price?: number
                    image_url?: string | null
                    description?: string | null
                    features?: string[] | null
                }
            }
            profiles: {
                Row: {
                    id: string
                    created_at: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    role: string
                    banned: boolean | null
                }
                Insert: {
                    id: string
                    created_at?: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: string
                    banned?: boolean | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: string
                    banned?: boolean | null
                }
            }
            user_likes: {
                Row: {
                    id: string
                    user_id: string
                    item_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    item_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    item_id?: string
                    created_at?: string
                }
            }
            job_applications: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    email: string
                    phone: string
                    position: string
                    reason: string
                    experience: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    full_name: string
                    email: string
                    phone: string
                    position: string
                    reason: string
                    experience: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string
                    email?: string
                    phone?: string
                    position?: string
                    reason?: string
                    experience?: string
                    status?: string
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    title: string
                    message: string
                    data: Json | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    title: string
                    message: string
                    data?: Json | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    title?: string
                    message?: string
                    data?: Json | null
                    is_read?: boolean
                    created_at?: string
                }
            }
            chat_messages: {
                Row: {
                    id: string
                    user_id: string
                    message: string
                    is_admin: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    message: string
                    is_admin?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    message?: string
                    is_admin?: boolean
                    created_at?: string
                }
            }
            coupons: {
                Row: {
                    id: string
                    created_at: string
                    code: string
                    type: string
                    value: number
                    usage_limit: number | null
                    used_count: number
                    expires_at: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    code: string
                    type: string
                    value: number
                    usage_limit?: number | null
                    used_count?: number
                    expires_at?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    code?: string
                    type?: string
                    value?: number
                    usage_limit?: number | null
                    used_count?: number
                    expires_at?: string | null
                }
            }
            payments: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string
                    item_id: string
                    amount: number
                    status: string
                    stripe_session_id: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id: string
                    item_id: string
                    amount: number
                    status: string
                    stripe_session_id?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string
                    item_id?: string
                    amount?: number
                    status?: string
                    stripe_session_id?: string | null
                }
            }
        }
    }
}
