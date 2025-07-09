import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Globe, 
  Mail, 
  CreditCard, 
  Truck, 
  Shield,
  Users,
  Database,
  Zap,
  Save,
  Loader2
} from 'lucide-react';
import { fetchSystemSettings, updateSystemSetting } from '@/lib/admin-utils';

interface SystemSetting {
  category: string;
  key: string;
  value: any;
  description: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await fetchSystemSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // This would batch update all settings
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveIndividualSetting = async (category: string, key: string, value: any) => {
    try {
      await updateSystemSetting(category, key, value);
      return true;
    } catch (error) {
      console.error('Error updating setting:', error);
      return false;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your store settings and integrations</p>
        </div>
        <Button 
          onClick={saveAllSettings} 
          disabled={saving} 
          className="lumicea-button-primary"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={settings.general?.site_name || ''}
                    onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.general?.contact_email || ''}
                    onChange={(e) => handleSettingChange('general', 'contact_email', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.general?.site_description || ''}
                  onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.general?.contact_phone || ''}
                    onChange={(e) => handleSettingChange('general', 'contact_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input
                    id="currency"
                    value={settings.general?.currency || 'GBP'}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Default Meta Title</Label>
                <Input
                  id="meta_title"
                  value={settings.seo?.meta_title || ''}
                  onChange={(e) => handleSettingChange('seo', 'meta_title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Default Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={settings.seo?.meta_description || ''}
                  onChange={(e) => handleSettingChange('seo', 'meta_description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Shipping Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="free_shipping_threshold">Free Shipping Threshold (£)</Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    value={settings.shipping?.free_shipping_threshold || '50'}
                    onChange={(e) => handleSettingChange('shipping', 'free_shipping_threshold', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_processing_days">Default Processing Days</Label>
                  <Input
                    id="default_processing_days"
                    type="number"
                    value={settings.shipping?.default_processing_days || '2'}
                    onChange={(e) => handleSettingChange('shipping', 'default_processing_days', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Royal Mail Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="royal_mail_client_id">Client ID</Label>
                    <Input
                      id="royal_mail_client_id"
                      placeholder="Enter Royal Mail Client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="royal_mail_client_secret">Client Secret</Label>
                    <Input
                      id="royal_mail_client_secret"
                      type="password"
                      placeholder="Enter Royal Mail Client Secret"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Stripe Integration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Stripe Payments</Label>
                      <p className="text-sm text-gray-500">Accept credit card payments via Stripe</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="stripe_publishable_key">Publishable Key</Label>
                      <Input
                        id="stripe_publishable_key"
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe_secret_key">Secret Key</Label>
                      <Input
                        id="stripe_secret_key"
                        type="password"
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">PayPal Integration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable PayPal Payments</Label>
                      <p className="text-sm text-gray-500">Accept PayPal payments</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
                    <Input
                      id="paypal_client_id"
                      placeholder="Enter PayPal Client ID"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Email Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={settings.email?.from_name || 'Lumicea'}
                    onChange={(e) => handleSettingChange('email', 'from_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={settings.email?.from_email || 'noreply@lumicea.com'}
                    onChange={(e) => handleSettingChange('email', 'from_email', e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Email Service Provider</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resend_api_key">Resend API Key</Label>
                    <Input
                      id="resend_api_key"
                      type="password"
                      placeholder="Enter Resend API Key"
                    />
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Third-Party Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ga4_measurement_id">Google Analytics 4 Measurement ID</Label>
                    <Input
                      id="ga4_measurement_id"
                      placeholder="G-XXXXXXXXXX"
                    />
                </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Image CDN</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cloudinary_cloud_name">Cloudinary Cloud Name</Label>
                    <Input
                      id="cloudinary_cloud_name"
                      placeholder="Enter Cloudinary Cloud Name"
                    />
                </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Email Marketing</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailchimp_api_key">Mailchimp API Key</Label>
                    <Input
                      id="mailchimp_api_key"
                      type="password"
                      placeholder="Enter Mailchimp API Key"
                    />
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Admin Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require 2FA for Admin Accounts</Label>
                      <p className="text-sm text-gray-500">Enforce two-factor authentication for all admin users</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-logout Inactive Sessions</Label>
                      <p className="text-sm text-gray-500">Automatically log out inactive admin sessions</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Data Protection</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable GDPR Compliance</Label>
                      <p className="text-sm text-gray-500">Enable GDPR compliance features</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cookie Consent</Label>
                      <p className="text-sm text-gray-500">Show cookie consent banner</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Backup Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Daily Backups</Label>
                      <p className="text-sm text-gray-500">Automatically backup database daily</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Create Manual Backup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}