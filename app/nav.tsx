import { AccountChip } from "./account-chip";
import { TelegramButton } from "./telegram-button";
import { currentUserId } from "@/lib/auth";
import { accounts } from "@/lib/db";

type UserRow = { name: string | null; picture: string | null };

// Signing in from the hub comes straight back to the hub.
const LOGIN_URL = `/api/auth/login?return=${encodeURIComponent("https://tapt.so/")}`;

// Account chip when someone is signed in, the sign-in button when nobody is. The page places it.
export async function Nav() {
  const userId = await currentUserId();
  const user = userId
    ? await (await accounts()).prepare("SELECT name, picture FROM users WHERE id = ?1").bind(userId).first<UserRow>()
    : null;

  return user ? (
    <AccountChip name={user.name ?? "Account"} picture={user.picture} />
  ) : (
    <TelegramButton href={LOGIN_URL} />
  );
}
