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
      questions: {
        Row: {
          created_at: string | null
          id: number
          isPublished: boolean
          prompt: Json | null
          tag: string | null
          tips: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          isPublished?: boolean
          prompt?: Json | null
          tag?: string | null
          tips?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: number
          isPublished?: boolean
          prompt?: Json | null
          tag?: string | null
          tips?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
