import { supabase } from "./supabase";

// Sign Up (Register) with Display Name
export const signUp = async (
  email: string,
  password: string,
  displayName: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { displayName }, // Save display name in user metadata
      emailRedirectTo: `${window.location.origin}/auth/callback`, // Add redirect URL for email verification
    },
  });

  if (error) throw error;
  return data;
};

// Login
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// Logout
export const logout = async () => {
  await supabase.auth.signOut();
};

// Get Current User Display Name
export const getUserDisplayName = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;

  return data.user.user_metadata?.displayName || "User";
};
