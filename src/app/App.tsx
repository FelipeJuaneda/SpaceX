import { QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "motion/react";
import { RouterProvider } from "react-router";
import { queryClient } from "./queryClient";
import { router } from "./router";

const loadMotionFeatures = () => import("./motion-features").then((m) => m.default);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </LazyMotion>
    </QueryClientProvider>
  );
}
