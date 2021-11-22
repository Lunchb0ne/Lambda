import { createContext, FunctionComponent, useState, useEffect } from 'react';
import Router from 'next/router';
import {
  User,
  Session,
  AuthChangeEvent,
  Provider,
  UserCredentials,
} from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';
import { useMessage } from '~/lib/message';
import { ROUTE_HOME, ROUTE_AUTH } from '~/config';

export type AuthContextProps = {
  user: User;
  signUp: (payload: UserCredentials) => void;
  signIn: (payload: UserCredentials) => void;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => void;
  loggedIn: boolean;
  loading: boolean;
  userLoading: boolean;
  userName: string;
  updateProfile: (username: string) => Promise<void>;
};

export const AuthContext = createContext<Partial<AuthContextProps>>({});

export const AuthProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loggedIn, setLoggedin] = useState(false);
  const { handleMessage } = useMessage();

  const signUp = async (payload: UserCredentials) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp(payload);
      if (error) {
        handleMessage({ message: error.message, type: 'error' });
      } else {
        handleMessage({
          message:
            'Signup successful. Please check your inbox for a confirmation email!',
          type: 'success',
        });
      }
    } catch (error) {
      handleMessage({
        message: error.error_description || error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  async function updateProfile(username: string) {
    try {
      setLoading(true);
      const user = supabase.auth.user();
      const updates = {
        id: user.id,
        username,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      fetchProfile();
      setLoading(false);
    }
  }

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setUserLoading(true);
      const user = supabase.auth.user();
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }
      if (data) {
        setUserName(data.username);
        // setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setUserLoading(false);
    }
  };

  const signIn = async (payload: UserCredentials) => {
    try {
      setLoading(true);
      const { error, user } = await supabase.auth.signIn(payload);
      if (error) {
        handleMessage({ message: error.message, type: 'error' });
      } else {
        handleMessage({
          message: payload.password.length
            ? `Welcome, ${user.email}`
            : `Please check your email for the magic link`,
          type: 'success',
        });
      }
    } catch (error) {
      handleMessage({
        message: error.error_description || error,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    await supabase.auth.signIn({ provider });
  };

  const signOut = async () => await supabase.auth.signOut();

  const setServerSession = async (event: AuthChangeEvent, session: Session) => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify({ event, session }),
    });
  };

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setUser(user);
      fetchProfile();
      setUserLoading(false);
      setLoggedin(true);
      Router.push(ROUTE_HOME);
    } else {
      setUserLoading(false);
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user! ?? null;
        setUserLoading(false);
        await setServerSession(event, session);
        if (user) {
          setUser(user);
          setLoggedin(true);
          // Router.push(ROUTE_HOME);
        } else {
          setUser(null);
          Router.push(ROUTE_AUTH);
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
        loggedIn,
        loading,
        userLoading,
        userName,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
