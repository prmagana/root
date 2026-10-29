import { AccountChip } from "@/components/account-chip";
import { TelegramButton } from "@/components/telegram-button";
import { currentUserId } from "@/lib/auth";
import { accounts } from "@/lib/db";

type UserRow = { name: string | null; picture: string | null };

// Signing in from the hub comes straight back to the hub.
const LOGIN_URL = `/api/auth/login?return=${encodeURIComponent("https://tapt.so/")}`;

// Same bar the tools have, minus the wordmark. Account chip right, or the sign-in button when nobody is.
export async function Nav() {
  const userId = await currentUserId();
  const user = userId
    ? await (await accounts()).prepare("SELECT name, picture FROM users WHERE id = ?1").bind(userId).first<UserRow>()
    : null;

  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-foreground/5 bg-background px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-end">
        {user ? (
          <AccountChip name={user.name ?? "Account"} picture={user.picture} />
        ) : (
          <TelegramButton href={LOGIN_URL} />
        )}
      </div>
    </nav>
  );
}
