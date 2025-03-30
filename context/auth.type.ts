export type User = {
  id: string;
  email?: string;
  role: string;
  created_at: string;
  updated_at: string;
  user_metadata: {
    displayName?: string;
    email?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    sub?: string;
  };
};

export type Token = {
  accessToken: string;
  expiresAt: number;
};

export type Auth = {
  user: User | null;
  logout: () => void;
  session: Token | null;
  getUser: () => User | null;
  checkAuth: () => boolean;
  loginUser: (user: User, token: Token) => void;
};
