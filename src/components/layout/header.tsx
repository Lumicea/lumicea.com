                              <SheetClose asChild>
                                <Button as={Link} to="/admin" size="sm" className="w-full lumicea-button-primary">
                                  Admin Dashboard
                                </Button>
                              </SheetClose>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <SheetClose asChild>
                            <Button as={Link} to="/login" className="flex-1 lumicea-button-secondary">
                              Sign In
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button as={Link} to="/signup" className="flex-1 lumicea-button-primary">
                              Sign Up
                            </Button>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  <div className="px-4 space-y-1 flex-1 overflow-y-auto">
                    <SheetClose asChild>
                      <Link to="/categories/nose-rings" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Nose Rings</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/categories/earrings" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Earrings</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/collections" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Collections</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/custom" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Custom Orders</span>
                      </Link>
                    </SheetClose>
                    
                    <div className="border-t my-2 border-gray-200"></div>
                    
                    <SheetClose asChild>
                      <Link to="/about" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">About</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/blog" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Blog</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/contact" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Contact</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/size-guide" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Size Guide</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/care" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Care Instructions</span>
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/gift-cards" className="flex items-center p-3 rounded-lg hover:bg-lumicea-navy/5">
                        <span className="font-medium">Gift Cards</span>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}