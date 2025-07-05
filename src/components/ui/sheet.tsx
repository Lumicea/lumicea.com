@@ .. @@
 const SheetContent = React.forwardRef<
   React.ElementRef<typeof SheetPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & VariantProps<typeof sheetVariants>
->(({ className, children, side = 'right', ...props }, ref) => (
+>(({ className, children, side = 'righ  )
t', ...props }, ref) => {
+  // Ensure SheetContent is scrollable
    <div className="fixed inset-0 z-50 flex">
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          sheetVariants({ side }), 
          "overflow-y-auto max-h-screen", // Add scrolling capability
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </div>
   </SheetPortal>
-));
+  );
+});