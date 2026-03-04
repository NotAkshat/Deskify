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
  <div className="w-full h-full flex items-center justify-center text-white">
    
    <div className="p-6 w-80 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
      
      <h2 className="text-lg font-semibold mb-4">Welcome 👋</h2>

      <div className="text-sm text-gray-300 mb-4">
        <p className="opacity-70">Signed in as</p>
        <p className="font-mono text-blue-300 break-all">{user.email}</p>
      </div>

      <button
        onClick={signOutUser}
        className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 transition font-medium"
      >
        Logout
      </button>

    </div>

  </div>
);
}