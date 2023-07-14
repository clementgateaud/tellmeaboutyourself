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
      notes: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          question_id: number | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          question_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_question_id_fkey"
            columns: ["question_id"]
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          created_at: string | null
          duration: number | null
          id: number
          isPublished: boolean
          prompt: Json | null
          prompt_en: string | null
          prompt_fr: string | null
          tag: string | null
          tips_en: string | null
          tips_fr: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          id?: number
          isPublished?: boolean
          prompt?: Json | null
          prompt_en?: string | null
          prompt_fr?: string | null
          tag?: string | null
          tips_en?: string | null
          tips_fr?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          id?: number
          isPublished?: boolean
          prompt?: Json | null
          prompt_en?: string | null
          prompt_fr?: string | null
          tag?: string | null
          tips_en?: string | null
          tips_fr?: string | null
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
