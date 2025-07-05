@@ .. @@
 export async function isUserAdmin(): Promise<boolean> {
   try {
     const { data: { user } } = await supabase.auth.getUser();
-    if (!user) return false;
+    if (!user) {
+      return false;
+    }
     
     const { data, error } = await supabase
       .from('user_profiles')
       .select('role')
       .eq('id', user.id)
       .single();
     
-    if (error || !data) return false;
-    return data.role === 'admin';
+    if (error || !data) {
+      return false;
+    }
+    
+    // Check if the user's email is in the list of admin emails, or if their role is 'admin'
+    const adminEmails = ['admin@lumicea.com', 'swyatt@lumicea.com', 'olipg@hotmail.co.uk'];
+    return data.role === 'admin' || adminEmails.includes(user.email || '');
   } catch (error) {
     console.error('Error checking admin status:', error);
     return false;
   }
 }