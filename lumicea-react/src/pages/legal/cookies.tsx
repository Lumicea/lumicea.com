import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function CookiesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Shield className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Information about how we use cookies on our website.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="lumicea-container">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What Are Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored however this may downgrade or 'break' certain elements of the site's functionality.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We use cookies for a variety of reasons detailed below. Unfortunately, in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
                </p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">The Cookies We Set</h3>
                
                <h4 className="text-lg font-semibold mb-2">Account related cookies</h4>
                <p>
                  If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out however in some cases they may remain afterwards to remember your site preferences when logged out.
                </p>
                
                <h4 className="text-lg font-semibold mb-2">Login related cookies</h4>
                <p>
                  We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
                </p>
                
                <h4 className="text-lg font-semibold mb-2">Orders processing related cookies</h4>
                <p>
                  This site offers e-commerce or payment facilities and some cookies are essential to ensure that your order is remembered between pages so that we can process it properly.
                </p>
                
                <h4 className="text-lg font-semibold mb-2">Forms related cookies</h4>
                <p>
                  When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
                </p>
                
                <h4 className="text-lg font-semibold mb-2">Site preferences cookies</h4>
                <p>
                  In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences.
                </p>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Third Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
                </p>
                
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>
                    This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
                  </li>
                  <li>
                    From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimizations our users appreciate the most.
                  </li>
                  <li>
                    As we sell products it's important for us to understand statistics about how many of the visitors to our site actually make a purchase and as such this is the kind of data that these cookies will track. This is important to you as it means that we can accurately make business predictions that allow us to monitor our advertising and product costs to ensure the best possible price.
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>More Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                </p>
                <p>
                  However if you are still looking for more information then you can contact us through one of our preferred contact methods:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Email: privacy@lumicea.com</li>
                  <li>Phone: +44 (0) 123 456 789</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default CookiesPage;