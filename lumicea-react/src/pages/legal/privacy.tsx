import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Shield className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="lumicea-container">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Lumicea ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website [www.lumicea.com] or make a purchase from us.
                </p>
                <p>
                  We use your personal data to provide and improve our services. By using our website, you agree to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
                <p>
                  When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                </p>
                <p>
                  Additionally, as you browse the site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site. We refer to this automatically collected information as "Device Information."
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">Order Information</h3>
                <p>
                  When you make a purchase or attempt to make a purchase through the site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as "Order Information."
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">User Account Information</h3>
                <p>
                  When you create an account on our site, we collect your name, email address, password (encrypted), and any preferences you choose to provide us with.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">How We Collect Information</h3>
                <p>We collect information using the following technologies:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    "Cookies" are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit our <a href="/legal/cookies" className="text-lumicea-navy hover:underline">Cookie Policy</a>.
                  </li>
                  <li>
                    "Log files" track actions occurring on the site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We use the Order Information that we collect generally to fulfill any orders placed through the site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Communicate with you;</li>
                  <li>Screen our orders for potential risk or fraud;</li>
                  <li>
                    When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services;
                  </li>
                  <li>
                    Improve and optimize our site (for example, by generating analytics about how our customers browse and interact with the site, and to assess the success of our marketing and advertising campaigns).
                  </li>
                </ul>
                
                <p className="mt-4">
                  We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our site.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Sharing Your Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We share your Personal Information with third parties to help us use your Personal Information, as described above. For example:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    We use Supabase to power our online store—you can read more about how Supabase uses your Personal Information here: <a href="https://supabase.io/privacy" className="text-lumicea-navy hover:underline" target="_blank" rel="noopener noreferrer">https://supabase.io/privacy</a>.
                  </li>
                  <li>
                    We also use Google Analytics to help us understand how our customers use the site—you can read more about how Google uses your Personal Information here: <a href="https://www.google.com/intl/en/policies/privacy/" className="text-lumicea-navy hover:underline" target="_blank" rel="noopener noreferrer">https://www.google.com/intl/en/policies/privacy/</a>.
                  </li>
                </ul>
                
                <p className="mt-4">
                  Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  When you place an order through the site, we will maintain your Order Information for our records unless and until you ask us to delete this information. For user accounts, we retain your information until you request account deletion.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us.
                </p>
                <p className="mt-4">
                  Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the site), or otherwise to pursue our legitimate business interests listed above. Please note that your information will be transferred outside of Europe, including to Canada and the United States.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We have implemented security measures designed to protect your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
                </p>
                <p className="mt-4">
                  The safety and security of your information also depends on you. We urge you to be careful about giving out information in public areas of the site. The information you share in public areas may be viewed by any user of the site.
                </p>
                <p className="mt-4">
                  Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our site. Any transmission of personal information is at your own risk.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Changes</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. If we make material changes to this Privacy Policy, we will notify you by email or by posting a notice on our site prior to the change becoming effective.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at <a href="mailto:privacy@lumicea.com" className="text-lumicea-navy hover:underline">privacy@lumicea.com</a> or by mail using the details provided below:
                </p>
                <p className="mt-4">
                  Lumicea, [Street Address], London, United Kingdom
                </p>
              </CardContent>
            </Card>
            
            <div className="text-sm text-gray-500 mt-8">
              Last updated: July 15, 2024
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default PrivacyPage;