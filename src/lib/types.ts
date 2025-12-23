export type Role = "owner" | "admin" | "member";
export type AssetStatus = "InStock" | "Issued" | "Maintenance" | "WrittenOff";
export type TransferType = "ISSUE" | "RETURN" | "MOVE" | "WRITE_OFF" | "MAINTENANCE";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          default_organization_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          default_organization_id?: string | null;
        };
        Update: Partial<{ full_name: string | null; default_organization_id: string | null }>;
        Relationships: [];
      };
      organizations: {
        Row: { id: string; name: string; created_at: string; created_by: string };
        Insert: { id?: string; name: string; created_by: string };
        Update: Partial<{ name: string }>;
        Relationships: [];
      };
      organization_members: {
        Row: { id: string; organization_id: string; user_id: string; role: Role; created_at: string };
        Insert: { organization_id: string; user_id: string; role?: Role };
        Update: Partial<{ role: Role }>;
        Relationships: [];
      };
      locations: {
        Row: { id: string; organization_id: string; name: string; description: string | null; created_at: string };
        Insert: { id?: string; organization_id: string; name: string; description?: string | null };
        Update: Partial<{ name: string; description: string | null }>;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          type: string | null;
          brand: string | null;
          model: string | null;
          serial_number: string | null;
          inventory_number: string | null;
          status: AssetStatus;
          photo_url: string | null;
          current_location_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          type?: string | null;
          brand?: string | null;
          model?: string | null;
          serial_number?: string | null;
          inventory_number?: string | null;
          status?: AssetStatus;
          photo_url?: string | null;
          current_location_id?: string | null;
          notes?: string | null;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["assets"]["Row"], "id" | "organization_id" | "created_at">>;
        Relationships: [];
      };
      asset_transfers: {
        Row: {
          id: string;
          organization_id: string;
          asset_id: string;
          type: TransferType;
          from_location_id: string | null;
          to_location_id: string | null;
          issued_to_user_id: string | null;
          quantity: number;
          note: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          asset_id: string;
          type: TransferType;
          from_location_id?: string | null;
          to_location_id?: string | null;
          issued_to_user_id?: string | null;
          quantity?: number;
          note?: string | null;
          created_by: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["asset_transfers"]["Row"], "id" | "created_at" | "organization_id" | "created_by">>;
        Relationships: [];
      };
      asset_audit_log: {
        Row: {
          id: string;
          organization_id: string;
          asset_id: string;
          action: string;
          metadata: Record<string, unknown> | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          asset_id: string;
          action: string;
          metadata?: Record<string, unknown> | null;
          created_by: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["asset_audit_log"]["Row"], "id" | "created_at" | "organization_id" | "created_by">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationMember = Database["public"]["Tables"]["organization_members"]["Row"];
export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type Asset = Database["public"]["Tables"]["assets"]["Row"];
export type AssetTransfer = Database["public"]["Tables"]["asset_transfers"]["Row"];
export type AssetAuditLog = Database["public"]["Tables"]["asset_audit_log"]["Row"];
