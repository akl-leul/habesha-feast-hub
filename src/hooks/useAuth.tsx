
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
            // Check admin_users table for other admin emails
            try {
              const { data } = await supabase
                .from('admin_users')
                .select('email')
                .eq('email', session.user.email)
                .single();
              console.log('Admin check result:', data);
              setIsAdmin(!!data);
            } catch (error) {
              console.log('Admin check failed:', error);
              setIsAdmin(false);
            }
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
      // The onAuthStateChange will handle the session setup
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
      
      // For admin user, try to sign up first to ensure the user exists
      if (email === 'abateisking@gmail.com') {
        console.log('Admin email detected, ensuring user exists');
        
        // Try to sign up (this will fail if user already exists, which is fine)
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        // Wait a moment for the user to be created
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Now try to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // If it's an email not confirmed error for admin, let's try to confirm it
        if (error.message.includes('Email not confirmed') && email === 'abateisking@gmail.com') {
          console.log('Admin email not confirmed, this is expected for development');
          toast({
            title: "Admin Setup",
            description: "Admin account needs email confirmation. Please check Supabase auth settings or contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
        return { error };
      }
      
      if (data.user) {
        console.log('Sign in successful for:', data.user.email);
        toast({
          title: "Signed in successfully",
          description: "Welcome back!",
        });
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
