import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <FileText className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our website and services.
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
                  These Terms of Service ("Terms") govern your use of the Lumicea website (the "Service") operated by Lumicea ("us", "we", or "our").
                </p>
                <p>
                  By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Purchases</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including your name, shipping address, email address, phone number, and payment information.
                </p>
                <p>
                  We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
                </p>
                <p>
                  We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Product Descriptions</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We endeavor to describe and display our products as accurately as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.
                </p>
                <p>
                  The product images shown are for illustration purposes only. The actual product may vary slightly due to the handcrafted nature of our jewelry. Minor variations in color, texture, and stone appearance are inherent characteristics of handmade items and should be expected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Shipping & Delivery</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We ship to addresses within the United Kingdom and internationally. For international orders, please note that your purchase may be subject to import duties and taxes, which are levied once the package reaches the destination country. These additional charges are your responsibility.
                </p>
                <p>
                  Delivery times are estimates only and commence from the date of shipping, rather than the date of order. We are not responsible for delivery delays due to customs processing or other circumstances beyond our control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Returns & Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We offer a 30-day return policy for most items. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
                </p>
                <p>
                  Custom orders and personalized items are not eligible for return unless they arrive damaged or defective.
                </p>
                <p>
                  Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                </p>
                <p>
                  If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain amount of days.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Gift Cards</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Gift cards are valid for 12 months from the date of purchase and can be used for online purchases only. Gift cards cannot be exchanged for cash, except where required by law. Lost, stolen, or damaged gift cards will not be replaced.
                </p>
                <p>
                  We reserve the right to refuse or cancel gift card orders if fraud or an unauthorized transaction is suspected.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Lumicea and its licensors.
                </p>
                <p>
                  The Service is protected by copyright, trademark, and other laws of both the United Kingdom and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Lumicea.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Links To Other Web Sites</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our Service may contain links to third-party web sites or services that are not owned or controlled by Lumicea.
                </p>
                <p>
                  Lumicea has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that Lumicea shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
                </p>
                <p>
                  We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Limitation Of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  In no event shall Lumicea, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Changes</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <p>
                  By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>By email: legal@lumicea.com</li>
                  <li>By phone: +44 (0) 123 456 789</li>
                </ul>
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

export default TermsPage;
