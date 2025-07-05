@@ .. @@
 
 useEffect(() => {
   checkUser();
   fetchNotifications();
-}, []); // Remove functions from dependency array to avoid circular reference
+}, []); // Dependencies removed to avoid circular reference
 
   const checkUser = async () => {
     try {
@@ .. @@
                           {user.email === 'admin@lumicea.com' || user.email === 'swyatt@lumicea.com' || user.email === 'olipg@hotmail.co.uk' ? (
                             <>
                               <div className="my-1 border-t"></div>
-                              <Link to="/admin" className="flex items-center p-2 rounded-md hover:bg-gray-100">
-                                <Settings className="mr-2 h-4 w-4" />
+                              <Link 
+                                to="/admin" 
+                                className="flex items-center p-2 rounded-md hover:bg-gray-100"
+                                onClick={() => setSidebarOpen(false)} // Close mobile sidebar when navigating
+                              >
+                                <Package className="mr-2 h-4 w-4" />
                                 <span>Admin Dashboard</span>
                               </Link>
                             </>