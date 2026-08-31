"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse ml-2"></div>;
  }

  return (
    <div className="flex items-center ml-2">
      {isSignedIn ? (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8 border-2 border-white/20 hover:border-white transition-colors",
            },
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button className="bg-green-accent hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm">
            Masuk
          </button>
        </SignInButton>
      )}
    </div>
  );
}
