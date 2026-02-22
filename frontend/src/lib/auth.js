import { supabase } from "./supabase";

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  };

export const signOutUser = async () => {
  await supabase.auth.signOut();
};