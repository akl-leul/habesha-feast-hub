
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
      
      // Clean up any existing auth state first
      await supabase.auth.signOut();
      
      // For admin user, ensure they exist in Supabase Auth
      if (email === 'abateisking@gmail.com') {
        console.log('Admin email detected, ensuring user exists');
        
        // First try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        // If sign in fails with invalid credentials, try to create the user
        if (signInError && signInError.message.includes('Invalid login credentials')) {
          console.log('User does not exist, creating admin user...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                role: 'admin'
              }
            }
          });
          
          if (signUpError) {
            console.error('Sign up error:', signUpError);
            
            // If user already exists but email not confirmed, handle it
            if (signUpError.message.includes('User already registered')) {
              console.log('User exists but may need confirmation, trying sign in again...');
              
              // Try signing in again
              const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (retryError) {
                toast({
                  title: "Sign in failed",
                  description: "Admin account may need email confirmation. Please check your email or contact support.",
                  variant: "destructive",
                });
                return { error: retryError };
              }
              
              if (retryData.user) {
                console.log('Retry sign in successful for:', retryData.user.email);
                toast({
                  title: "Signed in successfully",
                  description: "Welcome back!",
                });
                return { error: null };
              }
            } else {
              toast({
                title: "Account creation failed",
                description: signUpError.message,
                variant: "destructive",
              });
              return { error: signUpError };
            }
          }
          
          if (signUpData.user) {
            console.log('Admin user created successfully:', signUpData.user.email);
            
            // If user was created but needs confirmation, let them know
            if (!signUpData.session) {
              toast({
                title: "Account created",
                description: "Please check your email to confirm your account, or sign in if already confirmed.",
              });
              
              // Try to sign in immediately in case email confirmation is disabled
              const { data: immediateSignIn, error: immediateError } = await supabase.auth.signInWithPassword({
                email,
                password,
              });
              
              if (!immediateError && immediateSignIn.user) {
                console.log('Immediate sign in successful');
                toast({
                  title: "Signed in successfully",
                  description: "Welcome!",
                });
                return { error: null };
              }
            } else {
              toast({
                title: "Account created and signed in",
                description: "Welcome!",
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
          console.log('Sign in successful for:', signInData.user.email);
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
          });
          return { error: null };
        }
      } else {
        // For non-admin users, just try to sign in normally
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
          console.log('Sign in successful for:', data.user.email);
          toast({
            title: "Signed in successfully",
            description: "Welcome back!",
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
