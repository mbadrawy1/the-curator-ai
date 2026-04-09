export interface Generation {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  seed: number | null;
  steps: number | null;
  resolution: string | null;
  is_public: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  curator_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerateRequest {
  prompt: string;
  resolution?: string;
  steps?: number;
  seed?: number;
}

export interface GenerateResponse {
  image: string;
  seed: number;
  steps: number;
  resolution: string;
}
