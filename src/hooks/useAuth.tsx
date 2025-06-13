
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
      
      // For admin user, try to sign in or create account
      if (email === 'abateisking@gmail.com') {
        console.log('Admin email detected');
        
        // Try to sign in first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          console.log('User does not exist, creating admin user...');
          
          // Try to create the user
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
          
          if (signUpData.user) {
            console.log('Admin user created successfully');
            toast({
              title: "Admin account created",
              description: "You can now sign in with your credentials.",
            });
            
            // Try to sign in immediately after creation
            const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (newSignInError) {
              toast({
                title: "Please try signing in again",
                description: "Account created successfully. Please sign in now.",
              });
              return { error: newSignInError };
            }
            
            if (newSignInData.user) {
              toast({
                title: "Signed in successfully",
                description: "Welcome to the admin dashboard!",
              });
              return { error: null };
            }
          }
        } else if (signInError) {
          console.error('Sign in error:', signInError);
          toast({
            title: "Sign in failed",
            description: signInError.message,
            variant: "destructive",
          });
          return { error: signInError };
        } else if (signInData.user) {
          console.log('Sign in successful');
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          return { error: null };
        }
      } else {
        // For non-admin users
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          console.error('Sign in error:', error);
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
          return { error };
        }
        
        if (data.user) {
          toast({
            title: "Signed in successfully",
            description: "Welcome!",
          });
        }
        
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
