export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      survey_responses: {
        Row: {
          a1: number | null
          a2: number | null
          a3: number | null
          a4: number | null
          a5: number | null
          b1: number | null
          b2: number | null
          b3: number | null
          b4: number | null
          b5: number | null
          b6: number | null
          company_form: string | null
          county: string | null
          created_at: string
          effective_step: string | null
          email: string | null
          emp_count: string | null
          future_outlook: string | null
          gender: string | null
          hiring_freq: string | null
          id: string
          ownership: string | null
          p1: number | null
          p10: number | null
          p2: number | null
          p3: number | null
          p4: number | null
          p5: number | null
          p6: number | null
          p7: number | null
          p8: number | null
          p9: number | null
          position: string | null
          position_other: string | null
          q11: string | null
          q12: number | null
          q13: string | null
          q14: string | null
          q15: string | null
          q9: number | null
          sector: string | null
        }
        Insert: {
          a1?: number | null
          a2?: number | null
          a3?: number | null
          a4?: number | null
          a5?: number | null
          b1?: number | null
          b2?: number | null
          b3?: number | null
          b4?: number | null
          b5?: number | null
          b6?: number | null
          company_form?: string | null
          county?: string | null
          created_at?: string
          effective_step?: string | null
          email?: string | null
          emp_count?: string | null
          future_outlook?: string | null
          gender?: string | null
          hiring_freq?: string | null
          id?: string
          ownership?: string | null
          p1?: number | null
          p10?: number | null
          p2?: number | null
          p3?: number | null
          p4?: number | null
          p5?: number | null
          p6?: number | null
          p7?: number | null
          p8?: number | null
          p9?: number | null
          position?: string | null
          position_other?: string | null
          q11?: string | null
          q12?: number | null
          q13?: string | null
          q14?: string | null
          q15?: string | null
          q9?: number | null
          sector?: string | null
        }
        Update: {
          a1?: number | null
          a2?: number | null
          a3?: number | null
          a4?: number | null
          a5?: number | null
          b1?: number | null
          b2?: number | null
          b3?: number | null
          b4?: number | null
          b5?: number | null
          b6?: number | null
          company_form?: string | null
          county?: string | null
          created_at?: string
          effective_step?: string | null
          email?: string | null
          emp_count?: string | null
          future_outlook?: string | null
          gender?: string | null
          hiring_freq?: string | null
          id?: string
          ownership?: string | null
          p1?: number | null
          p10?: number | null
          p2?: number | null
          p3?: number | null
          p4?: number | null
          p5?: number | null
          p6?: number | null
          p7?: number | null
          p8?: number | null
          p9?: number | null
          position?: string | null
          position_other?: string | null
          q11?: string | null
          q12?: number | null
          q13?: string | null
          q14?: string | null
          q15?: string | null
          q9?: number | null
          sector?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
