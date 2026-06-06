import { handlers } from "@/auth";

/**
 * Auth.js catch-all route handler.
 * Mounts GET and POST handlers for all /api/auth/* paths:
 * sign-in, sign-out, callbacks, CSRF token, session, etc.
 */
export const { GET, POST } = handlers;
