import { AccountChip } from "@/components/account-chip";
import { WalletButton } from "@/components/wallet-button";
import { currentUserId } from "@/lib/auth";
import { accounts } from "@/lib/db";

type UserRow = { name: string | null; picture: string | null; wallet_address: string | null };

// Same bar the tools have, minus the wordmark. Account chip and wallet when signed in; signed out
// the right side is empty, since the login button belongs to the tools' login pages.
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
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-end">
        {user && (
          <div className="flex items-center gap-3.5">
            <AccountChip name={user.name ?? "Account"} picture={user.picture} />
            <WalletButton initialAddress={user.wallet_address} />
          </div>
        )}
      </div>
    </nav>
  );
}
