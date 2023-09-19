// utils/auth.js
import { getSession } from "next-auth/react";

export async function isAuthenticated(context) {
  const session = await getSession(context);

  if (!session) {
    return false;
  }

  // Optionally, you can check for specific user roles or permissions here
  // For example, check if the user is an admin

  return true;
}
