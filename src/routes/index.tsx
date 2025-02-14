import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PolymorphicCallbackProps } from "@kobalte/core/polymorphic";
import { A, AnchorProps } from "@solidjs/router";
import { ComponentProps } from "solid-js";
export default function Home() {
  return (
    <section class="flex min-h-screen flex-col items-center justify-center space-y-10 py-24">
      <div class="container flex flex-col items-center justify-center gap-6 text-center">
        <a
          href="#"
          class="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium"
        >
          🎉 <Separator class="mx-2 h-4" orientation="vertical" /> Introducing
          HACK Attendance
        </a>
        <h1 class="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          Track Attendance
          <br />
          With Ease
        </h1>
        <span class="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Create, track, and analyze event attendance all from one place.
        </span>
        <div class="flex gap-4">
          <Button size="lg" class="h-12 px-8" href="/dashboard" as={A}>
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            class="h-12 px-8"
            href="https://github.com/0xdeis/attendance"
            as={A}
          >
            Star us on Github
          </Button>
        </div>
      </div>
    </section>
  );
}
