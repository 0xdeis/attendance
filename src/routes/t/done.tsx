import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DoneAttending() {
  return (
    <main class="min-h-screen w-full pt-20">
      <Card class="max-w-screen-md flex-grow">
        <CardHeader>
          <CardTitle>You're Here</CardTitle>
        </CardHeader>
        <CardContent>
          Check the screen to see your name in a few seconds.
        </CardContent>
      </Card>
    </main>
  );
}
