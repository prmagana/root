import TaptMark from "./tapt-mark";
import { AccountChip } from "@/components/account-chip";
import { TelegramButton } from "@/components/telegram-button";
import { WalletButton } from "@/components/wallet-button";
import { currentUserId } from "@/lib/auth";
import { accounts } from "@/lib/db";

type UserRow = { name: string | null; picture: string | null; wallet_address: string | null };

// Signing in from the hub comes straight back to the hub.
const LOGIN_URL = `/api/auth/login?return=${encodeURIComponent("https://tapt.so/")}`;

// The tools' bar with the star where their wordmark goes. Signed in: account chip and wallet. Signed out: the
// same Continue with Telegram the tools' login pages use.
export async function Nav() {
  const userId = await currentUserId();
  const user = userId
    ? await (await accounts())
        .prepare("SELECT name, picture, wallet_address FROM users WHERE id = ?1")
        .bind(userId)
        .first<UserRow>()
    : null;

  return (
    <nav className="sticky top-0 z-50 w-full shrink-0 border-b border-foreground/5 bg-background px-4 sm:px-6">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between">
        <TaptMark className="size-9 select-none text-ink" />
        {user ? (
          <div className="flex items-center gap-3.5">
            <AccountChip name={user.name ?? "Account"} picture={user.picture} />
            <WalletButton initialAddress={user.wallet_address} />
          </div>
        ) : (
          <TelegramButton href={LOGIN_URL} />
        )}
      </div>
    </nav>
  );
}
