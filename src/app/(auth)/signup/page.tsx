import SignupForm from "@/components/features/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return <SignupForm />;
}
