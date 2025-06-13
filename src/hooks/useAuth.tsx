import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin by email
          if (session.user.email === 'abateisking@gmail.com') {
            setIsAdmin(true);
            console.log('Admin user detected');
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      setLoading(true);
      
      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) {
        console.log('Sign in failed, checking if user needs to be created:', signInError.message);
        
        // If credentials are invalid and this is the admin email, try to create the user
        if (signInError.message.includes('Invalid login credentials') && email === 'abateisking@gmail.com') {
          console.log('Creating admin user...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/admin`
            }
          });
          
          if (signUpError) {
            console.error('Sign up error:', signUpError);
            toast({
              title: "Account creation failed",
              description: signUpError.message,
              variant: "destructive",
            });
            return { error: signUpError };
          }
          
          if (signUpData.user && !signUpData.session) {
            // User created but not automatically signed in
            console.log('User created, need to sign in');
            toast({
              title: "Admin account created",
              description: "Please try signing in again.",
            });
            return { error: { message: "Account created, please sign in again" } };
          }
          
          if (signUpData.session) {
            console.log('User created and signed in automatically');
            toast({
              title: "Admin account created and signed in",
              description: "Welcome to the admin dashboard!",
            });
            return { error: null };
          }
        } else {
          // Other sign in errors
          toast({
            title: "Sign in failed",
            description: signInError.message,
            variant: "destructive",
          });
          return { error: signInError };
        }
      } else if (signInData.user) {
        console.log('Sign in successful');
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in catch error:', error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await supabase.auth.signOut();
      setIsAdmin(false);
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
