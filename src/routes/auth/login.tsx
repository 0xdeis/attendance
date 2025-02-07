import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "@solidjs/router";
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  let callbackURL = "/dashboard";

  const redirect = searchParams.redirect;
  if (typeof redirect === "string") {
    callbackURL = redirect;
  }

  return (
    <div>
      <Button
        onClick={async () => {
          await authClient.signIn.social({
            provider: "google",
            callbackURL,
          });
        }}
      >
        Login
      </Button>
    </div>
  );
}
