import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Users,
  Send,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';

// Import React Quill dynamically using React.lazy
const ReactQuill = React.lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  segment_id: string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  recipients_count: number;
  opened_count: number;
  clicked_count: number;
  status: string;
  created_at: string;
  created_by: string; // Added created_by field
}

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  customer_count: number;
}

// Updated Template variables for insertion with `store_name` removed
const TEMPLATE_VARIABLES = [
  { id: 'first_name', label: 'First Name', description: 'Customer\'s first name' },
  { id: 'last_name', label: 'Last Name', description: 'Customer\'s last name' },
  { id: 'email', label: 'Email', description: 'Customer\'s email address' },
  { id: 'order_number', label: 'Order Number', description: 'Most recent order number' },
  { id: 'total_spent', label: 'Total Spent', description: 'Customer\'s lifetime spend' },
  { id: 'current_date', label: 'Current Date', description: 'The current date' },
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: '',
    segment_id: 'all',
    scheduled_at: '',
    status: 'draft',
  });

  // Quill editor modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  useEffect(() => {
    loadData();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;
      setCampaigns(campaignsData || []);

      // Fetch customer segments
      const { data: segmentsData, error: segmentsError } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (segmentsError) throw segmentsError;
      setSegments(segmentsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert('You must be logged in to save a campaign.');
      return;
    }

    try {
      setSaving(true);

      const formData = {
        ...campaignForm,
        scheduled_at: campaignForm.scheduled_at || null,
        segment_id: campaignForm.segment_id === 'all' ? null : campaignForm.segment_id,
      };

      if (editingCampaign) {
        // Exclude created_by on update
        const { error } = await supabase
          .from('email_campaigns')
          .update(formData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
      } else {
        // Add created_by on insert
        const { error } = await supabase
          .from('email_campaigns')
          .insert([{ ...formData, created_by: currentUser.id }]);

        if (error) throw error;
      }

      await loadData();
      setDialogOpen(false);
      resetForm();
      alert(editingCampaign ? 'Campaign updated successfully!' : 'Campaign created successfully!');
    } catch (error) {
      console.error('Error saving campaign:', error);
      alert('Error saving campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCampaignForm({
      name: '',
      subject: '',
      content: '',
      segment_id: 'all',
      scheduled_at: '',
      status: 'draft',
    });
    setEditingCampaign(null);
  };

  const editCampaign = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setCampaignForm({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      segment_id: campaign.segment_id || 'all',
      scheduled_at: campaign.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : '',
      status: campaign.status,
    });
    setDialogOpen(true);
  };

  const previewCampaign = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setPreviewDialogOpen(true);
  };

  // Insert template variable into content
  const insertTemplateVariable = (variableId: string) => {
    let variableText = `{{${variableId}}}`;

    // Handle special variables that need dynamic data
    if (variableId === 'current_date') {
      variableText = formatDate(new Date().toISOString(), 'PPP'); // Formats a readable date
    }

    setCampaignForm(prev => ({
      ...prev,
      content: prev.content + ` ${variableText}`
    }));
  };

  const openPreviewInNewTab = () => {
    if (!editingCampaign && !campaignForm.content) return;

    const content = editingCampaign ? editingCampaign.content : campaignForm.content;
    const subject = editingCampaign ? editingCampaign.subject : campaignForm.subject;

    // Create a new window
    const previewWindow = window.open('', '_blank');
    if (!previewWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this site to preview the campaign.');
      return;
    }

    // Create HTML content with basic styling
    const safeContent = content
      .replace(/\{\{first_name\}\}/g, 'John')
      .replace(/\{\{last_name\}\}/g, 'Doe')
      .replace(/\{\{email\}\}/g, 'john.doe@example.com')
      .replace(/\{\{order_number\}\}/g, 'LUM-12345')
      .replace(/\{\{total_spent\}\}/g, '£250.00')
      .replace(/\{\{current_date\}\}/g, formatDate(new Date().toISOString(), 'PPP'))
      .replace(/\{\{[^}]+\}\}/g, '[Variable]');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Preview: ${subject}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-container {
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 20px;
              background-color: #fff;
            }
            .email-header {
              background-color: #10105A;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .email-body {
              padding: 20px;
            }
            .email-footer {
              background-color: #f5f5f5;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-radius: 0 0 5px 5px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #10105A;
            }
            a {
              color: #D3A84C;
              text-decoration: none;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .preview-note {
              background-color: #f8f9fa;
              border: 1px solid #ddd;
              padding: 10px;
              margin-bottom: 20px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="preview-note">
            <strong>PREVIEW MODE</strong> - This is how your email will appear to recipients. Template variables have been replaced with sample values.
          </div>
          <div class="email-container">
            <div class="email-header">
              <h2>${subject}</h2>
            </div>
            <div class="email-body">
              ${safeContent}
            </div>
            <div class="email-footer">
              <p>© ${new Date().getFullYear()} Lumicea. All rights reserved.</p>
              <p><a href="#">Unsubscribe</a> | <a href="#">View in browser</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Write to the new window
    previewWindow.document.open();
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  };

  const sendTestEmail = async () => {
    if (!currentUser) {
      alert('You must be logged in to send a test email.');
      return;
    }

    if (!editingCampaign && !campaignForm.content) {
      alert('Please create campaign content before sending a test email.');
      return;
    }

    try {
      setSendingTest(true);

      const content = editingCampaign ? editingCampaign.content : campaignForm.content;
      const subject = editingCampaign ? editingCampaign.subject : campaignForm.subject;

      console.log("Sending test email to:", currentUser.email);

      // Call the Supabase Edge Function to send the test email
      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: {
          recipient_email: currentUser.email,
          subject: subject || "Test Email",
          html_content: content || "<p>This is a test email</p>",
          sender_name: 'Lumicea',
          sender_email: 'noreply@lumicea.com'
        }
      });

      if (error) {
        console.error("Error sending test email:", error);
        throw error;
      }

      console.log("Test email response:", data);
      alert(`Test email sent to ${currentUser.email}. Please check your inbox.`);
    } catch (error) {
      console.error('Error sending test email:', error);
      alert(`Error sending test email: ${error.message || 'Unknown error'}`);
    } finally {
      setSendingTest(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Campaign deleted successfully!');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Error deleting campaign. Please try again.');
    }
  };

  const sendCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to send this campaign now? This action cannot be undone.')) return;

    try {
      setSending(true);

      // In a real application, this would call an API endpoint to send the campaign
      // For now, we'll just update the status
      const { error } = await supabase
        .from('email_campaigns')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      await loadData();
      alert('Campaign sent successfully!');
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Error sending campaign. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const scheduleCampaign = async (id: string) => {
    if (!editingCampaign?.scheduled_at) {
      alert('Please set a scheduled date and time first.');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('email_campaigns')
        .update({
          status: 'scheduled',
          scheduled_at: editingCampaign.scheduled_at,
        })
        .eq('id', id);

      if (error) throw error;
      await loadData();
      setDialogOpen(false);
      alert('Campaign scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      alert('Error scheduling campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCampaignStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Edit },
      'scheduled': { label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: Calendar },
      'sending': { label: 'Sending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'sent': { label: 'Sent', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Function to safely render campaign content for preview
  const renderCampaignPreview = (content: string) => {
    // Replace template variables with safe preview text
    const safeContent = content
      .replace(/\{\{first_name\}\}/g, 'John')
      .replace(/\{\{last_name\}\}/g, 'Doe')
      .replace(/\{\{email\}\}/g, 'john.doe@example.com')
      .replace(/\{\{order_number\}\}/g, 'LUM-12345')
      .replace(/\{\{total_spent\}\}/g, '£250.00')
      .replace(/\{\{current_date\}\}/g, formatDate(new Date().toISOString(), 'PPP'))
      .replace(/\{\{[^}]+\}\}/g, '[Variable]'); // Replace any other template variables

    return { __html: safeContent };
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
          <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
          <p className="text-gray-600">Create and manage email marketing campaigns</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
              <DialogDescription>
                Create or edit an email marketing campaign
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campaign Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      value={campaignForm.name}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Summer Sale 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject Line *</Label>
                    <Input
                      id="subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Don't miss our summer sale!"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment_id">Customer Segment</Label>
                  <Select
                    value={campaignForm.segment_id}
                    onValueChange={(value) => setCampaignForm(prev => ({ ...prev, segment_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      {segments.map((segment) => (
                        <SelectItem key={segment.id} value={segment.id}>
                          {segment.name} ({segment.customer_count} customers)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Email Content *</Label>
                  <div className="border rounded-md">
                    {/* React.lazy and Suspense for ReactQuill */}
                    <Suspense fallback={<div>Loading editor...</div>}>
                      <ReactQuill
                        theme="snow"
                        value={campaignForm.content}
                        onChange={(content) => setCampaignForm(prev => ({ ...prev, content }))}
                        modules={modules}
                        formats={formats}
                        placeholder="Compose your email content here..."
                        style={{ height: '300px' }}
                      />
                    </Suspense>
                  </div>
                  {/* Spacing below the editor has been increased with mt-4 */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {TEMPLATE_VARIABLES.map(variable => (
                      <Badge
                        key={variable.id}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => insertTemplateVariable(variable.id)}
                        title={variable.description}
                      >
                        Insert {variable.label}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Use template variables like {'{{'} variable_name {'}}'}  to personalize your email.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Schedule Send (Optional)</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={campaignForm.scheduled_at}
                    onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">
                    Leave blank to save as draft. You can send or schedule later.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendTestEmail}
                    disabled={sendingTest || !campaignForm.content}
                  >
                    {sendingTest ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={openPreviewInNewTab}
                    disabled={!campaignForm.content}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview in New Tab
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="lumicea-button-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save as Draft
                      </>
                    )}
                  </Button>
                  {editingCampaign && campaignForm.scheduled_at && (
                    <Button
                      type="button"
                      onClick={() => scheduleCampaign(editingCampaign.id)}
                      disabled={saving}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Campaign Preview</DialogTitle>
              <DialogDescription>
                {editingCampaign?.subject}
              </DialogDescription>
            </DialogHeader>

            <div className="border rounded-lg p-6 bg-white">
              <div className="prose max-w-none">
                {/* Safe HTML preview with template variables replaced */}
                <div dangerouslySetInnerHTML={renderCampaignPreview(editingCampaign?.content || '')} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                Close Preview
              </Button>
              <Button
                onClick={openPreviewInNewTab}
                disabled={!editingCampaign?.content}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Send className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.filter(c => c.status === 'scheduled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.reduce((sum, c) => sum + (c.recipients_count || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-gray-500">{campaign.subject}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.segment_id ? (
                        <Badge variant="outline">
                          {segments.find(s => s.id === campaign.segment_id)?.name || 'Unknown Segment'}
                        </Badge>
                      ) : (
                        <Badge variant="outline">All Customers</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className="text-sm">
                          Sent: {formatDate(campaign.sent_at || campaign.created_at, 'PPp')}
                        </div>
                      ) : campaign.status === 'scheduled' ? (
                        <div className="text-sm">
                          Scheduled: {formatDate(campaign.scheduled_at || '', 'PPp')}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Not scheduled</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {getCampaignStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      {campaign.status === 'sent' ? (
                        <div className="text-sm">
                          <div>Sent: {campaign.recipients_count || 0}</div>
                          <div>Opened: {campaign.opened_count || 0} ({campaign.recipients_count ? Math.round((campaign.opened_count / campaign.recipients_count) * 100) : 0}%)</div>
                          <div>Clicked: {campaign.clicked_count || 0} ({campaign.recipients_count ? Math.round((campaign.clicked_count / campaign.recipients_count) * 100) : 0}%)</div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No data yet</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => previewCampaign(campaign)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        {campaign.status === 'draft' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => editCampaign(campaign)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendCampaign(campaign.id)}
                              disabled={sending}
                            >
                              {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                            </Button>
                          </>
                        )}
                        {['draft', 'scheduled'].includes(campaign.status) && (
                          <Button size="sm" variant="outline" onClick={() => deleteCampaign(campaign.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No campaigns found</h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first email campaign
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Library Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Media Library</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Media Library</h3>
            <p className="text-gray-500 mb-4">
              Upload and manage images for your email campaigns
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
