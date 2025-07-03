import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard,
  MapPin,
  Gem,
  Save,
  Sparkles,
  Heart,
  Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UserPreferences {
  material: string;
  gemstone: string;
  size: string;
  gauge: string;
  autoApply: boolean;
}

const materialOptions = [
  { id: 'silver-940', name: '940 Argentium Silver', description: 'Premium tarnish-resistant silver' },
  { id: 'gold-14k', name: '14k Gold Filled', description: 'Luxurious gold layer bonded to brass' },
  { id: 'rose-gold-14k', name: '14k Rose Gold Filled', description: 'Romantic rose gold with warm tones' },
  { id: 'titanium', name: 'Titanium', description: 'Ultra-lightweight and biocompatible' },
];

const gemstoneOptions = [
  { id: 'none', name: 'No Gemstone', description: 'Classic metal finish' },
  { id: 'amethyst', name: 'Amethyst', description: 'Beautiful purple quartz crystal' },
  { id: 'sapphire', name: 'Sapphire', description: 'Precious gemstone symbolizing wisdom' },
  { id: 'opal', name: 'Opal', description: 'Mesmerizing stone with play-of-color' },
  { id: 'moonstone', name: 'Moonstone', description: 'Ethereal stone with blue sheen' },
  { id: 'turquoise', name: 'Turquoise', description: 'Vibrant blue-green protective stone' },
];

const sizeOptions = [
  { id: '6mm', name: '6mm', description: 'Petite features, first piercing' },
  { id: '7mm', name: '7mm', description: 'Most common size, everyday wear' },
  { id: '8mm', name: '8mm', description: 'Standard comfort fit' },
  { id: '9mm', name: '9mm', description: 'Larger features, statement piece' },
  { id: '10mm', name: '10mm', description: 'Bold, dramatic look' },
];

const gaugeOptions = [
  { id: '22g', name: '22G (0.6mm)', description: 'Thinnest option' },
  { id: '20g', name: '20G (0.8mm)', description: 'Standard for new piercings' },
  { id: '18g', name: '18G (1.0mm)', description: 'Popular choice' },
  { id: '16g', name: '16G (1.2mm)', description: 'Slightly thicker' },
  { id: '14g', name: '14G (1.6mm)', description: 'Thickest option' },
];

export function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    material: 'silver-940',
    gemstone: 'none',
    size: '7mm',
    gauge: '20g',
    autoApply: true,
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    restockAlerts: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || '',
        });
      }

      // Load preferences from localStorage for now
      const savedPreferences = localStorage.getItem('lumicea_preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }

    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = () => {
    setSaving(true);
    try {
      localStorage.setItem('lumicea_preferences', JSON.stringify(preferences));
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Error saving preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    setSaving(true);
    try {
      localStorage.setItem('lumicea_notifications', JSON.stringify(notifications));
      alert('Notification preferences saved!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('Error saving notification preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumicea-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <div className="w-16 h-16 bg-lumicea-gold rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-lumicea-navy" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Account Settings
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Manage your account preferences and customize your jewelry shopping experience.
            </p>
          </div>
        </section>

        {/* Settings Content */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-lumicea-navy" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-sm text-gray-500">
                        Email address cannot be changed. Contact support if you need to update this.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+44 123 456 7890"
                      />
                    </div>

                    <Button onClick={handleSaveProfile} disabled={saving} className="lumicea-button-primary">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gem className="h-5 w-5 text-lumicea-navy" />
                      <span>Product Preferences</span>
                    </CardTitle>
                    <p className="text-gray-600">
                      Set your default preferences for jewelry specifications. These will be automatically applied to products when you shop.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Auto-Apply Toggle */}
                    <div className="flex items-center justify-between p-4 bg-lumicea-navy/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">Auto-Apply Preferences</h4>
                        <p className="text-sm text-gray-600">
                          Automatically apply your preferences to all products and update them based on your purchases
                        </p>
                      </div>
                      <Switch
                        checked={preferences.autoApply}
                        onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoApply: checked }))}
                      />
                    </div>

                    <Separator />

                    {/* Material Preference */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Preferred Material</Label>
                      <Select
                        value={preferences.material}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, material: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {materialOptions.map((material) => (
                            <SelectItem key={material.id} value={material.id}>
                              <div>
                                <div className="font-medium">{material.name}</div>
                                <div className="text-sm text-gray-500">{material.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gemstone Preference */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Preferred Gemstone</Label>
                      <Select
                        value={preferences.gemstone}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, gemstone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gemstoneOptions.map((gemstone) => (
                            <SelectItem key={gemstone.id} value={gemstone.id}>
                              <div>
                                <div className="font-medium">{gemstone.name}</div>
                                <div className="text-sm text-gray-500">{gemstone.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Size Preference */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Preferred Size</Label>
                      <Select
                        value={preferences.size}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, size: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sizeOptions.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              <div>
                                <div className="font-medium">{size.name}</div>
                                <div className="text-sm text-gray-500">{size.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Gauge Preference */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Preferred Gauge</Label>
                      <Select
                        value={preferences.gauge}
                        onValueChange={(value) => setPreferences(prev => ({ ...prev, gauge: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gaugeOptions.map((gauge) => (
                            <SelectItem key={gauge.id} value={gauge.id}>
                              <div>
                                <div className="font-medium">{gauge.name}</div>
                                <div className="text-sm text-gray-500">{gauge.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">How it works</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            When auto-apply is enabled, these preferences will be automatically selected when you view products, 
                            add items to your wishlist, or add to cart. Your preferences will also be updated automatically 
                            based on your first purchase to better match your style.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSavePreferences} disabled={saving} className="lumicea-button-primary">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-lumicea-navy" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Order Updates</h4>
                          <p className="text-sm text-gray-600">Receive notifications about your order status</p>
                        </div>
                        <Switch
                          checked={notifications.orderUpdates}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, orderUpdates: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Promotions & Sales</h4>
                          <p className="text-sm text-gray-600">Get notified about special offers and discounts</p>
                        </div>
                        <Switch
                          checked={notifications.promotions}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, promotions: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">New Products</h4>
                          <p className="text-sm text-gray-600">Be the first to know about new jewelry releases</p>
                        </div>
                        <Switch
                          checked={notifications.newProducts}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, newProducts: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Restock Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified when wishlist items are back in stock</p>
                        </div>
                        <Switch
                          checked={notifications.restockAlerts}
                          onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, restockAlerts: checked }))}
                        />
                      </div>
                    </div>

                    <Button onClick={handleSaveNotifications} disabled={saving} className="lumicea-button-primary">
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Notification Preferences'}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-lumicea-navy" />
                      <span>Security Settings</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Password</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Last changed: Never
                        </p>
                        <Button variant="outline">Change Password</Button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline">Enable 2FA</Button>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Login Sessions</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Manage your active login sessions
                        </p>
                        <Button variant="outline">View Sessions</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}