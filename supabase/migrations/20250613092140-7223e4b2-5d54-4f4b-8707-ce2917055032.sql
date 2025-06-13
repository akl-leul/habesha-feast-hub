
-- First, let's make sure the admin user exists in the admin_users table
INSERT INTO public.admin_users (email, username, password_hash, role)
VALUES (
  'abateisking@gmail.com',
  'abate_admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: 'password'
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- Also ensure RLS policies are properly set for orders and bookings so admins can access them
DROP POLICY IF EXISTS "Admins can read and update orders" ON public.orders;
CREATE POLICY "Admins can read and update orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admins can read and update bookings" ON public.bookings;
CREATE POLICY "Admins can read and update bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );
