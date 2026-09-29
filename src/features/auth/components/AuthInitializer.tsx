import { useEffect, type PropsWithChildren } from "react";
import { useAuthStore } from "../../../stores/authStore";
import { userName } from "../api/authApi";

type AuthInitializerProps = PropsWithChildren;

export const AuthInitializer = ({
  children,
}: AuthInitializerProps) => {
  const completeAuthCheck = useAuthStore(
    (state) => state.completeAuthCheck,
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await userName();

        completeAuthCheck(user);
      } catch {
        completeAuthCheck(null);
      }
    };

    void initializeAuth();
  }, [completeAuthCheck]);

  return children;
}
