export async function isUserAdmin(): Promise<boolean> {
   try {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) {
       return false;
     }
    
     const { data, error } = await supabase
       .from('user_profiles')
       .select('role')
       .eq('id', user.id)
       .single();
    
     if (error || !data) {
      // If we can't determine the role from the database, check if the email is in the admin list
      const adminEmails = ['admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk'];
      return adminEmails.includes(user.email || '');
    }
    
    // Check if the user's role is 'admin' or if their email is in the list of admin emails
    const adminEmails = ['admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk'];
    return data.role === 'admin' || adminEmails.includes(user.email || '');
   } catch (error) {
     console.error('Error checking admin status:', error);
     return false;
   }
}