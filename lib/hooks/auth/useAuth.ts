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
    const token = session.get("access_token");

    if (!token) {
      setIsAuthenticated(false);
      dispatch(setUser(undefined));
      setLoading(false);
      return;
    }
    
    const loadUser = async () => {
      try {
        let fetchPromise = userService.getCurrentUser();
        const currentUser = await fetchPromise;
        dispatch(setUser(currentUser));
        setIsAuthenticated(true);
      } catch (err) {
        const data = await authService.refreshAccessToken()
        session.set("access_token", data.access_token)
        loadUser()
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, isAuthenticated, loading };
};
