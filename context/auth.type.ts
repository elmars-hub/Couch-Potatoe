export type User = {
  id: string;
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
