import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
export default function LoginPage() {
  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
          });
        }}
      >
        Login
      </Button>
    </div>
  );
}
