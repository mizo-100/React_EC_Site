import { QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { AuthInitializer } from "../features/auth/components/AuthInitializer";
import { queryClient } from "../lib/queryClient";

type AppProvidersProps = PropsWithChildren;

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
    </QueryClientProvider>
  );
}
