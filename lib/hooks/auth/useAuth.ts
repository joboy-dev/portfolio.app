import { useDispatch, useSelector } from "react-redux";
import session from "../../utils/session";
import { useEffect, useState } from "react";
import { setUser } from "@/lib/redux/slices/auth/auth";
import { RootState } from "@/lib/redux/store";
import { authService } from "@/lib/redux/slices/auth/auth.service";
import { userService } from "@/lib/redux/slices/user/user.service";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    let cancelled = false;
    const token = session.get("access_token");

    if (!token) {
      setIsAuthenticated(false);
      dispatch(setUser(undefined));
      setLoading(false);
      return;
    }

    // At most one refresh-and-retry: a token that's still invalid after a
    // fresh refresh means the session is dead, not a transient hiccup.
    // Retrying unconditionally here was recursing forever whenever the
    // backend kept rejecting the request, flooding the network tab.
    const loadUser = async (hasRetried: boolean) => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (cancelled) return;
        dispatch(setUser(currentUser));
        setIsAuthenticated(true);
      } catch (err) {
        if (hasRetried) {
          session.remove("access_token");
          dispatch(setUser(undefined));
          setIsAuthenticated(false);
          return;
        }
        try {
          const data = await authService.refreshAccessToken();
          if (cancelled) return;
          session.set("access_token", data.access_token);
          await loadUser(true);
          return;
        } catch {
          session.remove("access_token");
          dispatch(setUser(undefined));
          setIsAuthenticated(false);
        }
      }
    };

    loadUser(false).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { user, isAuthenticated, loading };
};
