import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { signInWithGoogle, signOutUser } from "../lib/auth";

export default function LoginApp() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // get session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // listen auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="mb-2">Welcome 👋</p>
      <p className="text-sm text-gray-600">{user.email}</p>

      <button
        onClick={signOutUser}
        className="mt-3 px-3 py-1 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}