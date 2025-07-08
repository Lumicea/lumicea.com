import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Monitor, Headphones, MousePointer, AlignLeft, MessageSquare, FileText, Code } from 'lucide-react';

export function AccessibilityPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Eye className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Accessibility
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Our commitment to creating an inclusive and accessible experience for all users.
            </p>
          </div>
        </section>

        {/* Commitment Statement */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Our Commitment</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Inclusive Design for Everyone
              </h2>
              <p className="text-lg text-gray-600">
                At Lumicea, we believe that beautiful jewelry should be accessible to everyone, and so should our website. 
                We are committed to ensuring our digital presence is accessible to people of all abilities.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-8">
                <p className="text-gray-700 mb-6">
                  We strive to meet and exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                  Our team is dedicated to ongoing improvements to enhance the usability and accessibility of our website 
                  for all visitors, including those who rely on assistive technologies.
                </p>
                <p className="text-gray-700 mb-6">
                  We recognize that accessibility is a journey, not a destination. We are committed to regularly 
                  reviewing, testing, and improving our website to ensure we provide an inclusive experience for all users.
                </p>
                <p className="text-gray-700">
                  If you encounter any barriers or have suggestions for improving our accessibility, we welcome your 
                  feedback. Please contact us using the information at the bottom of this page.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Accessibility Features */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-gold/10 text-lumicea-gold">Features</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Accessible Design Elements
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our website includes the following features to enhance accessibility.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <Monitor className="h-5 w-5 text-lumicea-navy" />
                    </div>
                    <CardTitle>Responsive Design</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our website is fully responsive, providing an optimal viewing experience across a wide range of devices.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <AlignLeft className="h-5 w-5 text-lumicea-navy" />
                    </div>
                    <CardTitle>Readable Text</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We maintain appropriate text contrast ratios and use readable font sizes to ensure content is legible for all users.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <MousePointer className="h-5 w-5 text-lumicea-navy" />
                    </div>
                    <CardTitle>Keyboard Navigation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    All interactive elements are accessible via keyboard, with visible focus states for navigation without a mouse.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-lumicea-navy/10 flex items-center justify-center">
                      <Headphones className="h-5 w-5 text-lumicea-navy" />
                    </div>
                    <CardTitle>Screen Reader Compatible</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We use semantic HTML and ARIA attributes to ensure compatibility with screen readers and other assistive technologies.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Accessibility Guidelines */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Standards</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Accessibility Guidelines
              </h2>
              <p className="text-lg text-gray-600">
                We follow these principles to ensure our website remains accessible to all users.
              </p>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Perceivable</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        All non-text content has appropriate text alternatives
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Content can be presented in different ways without losing information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Color is not used as the only visual means of conveying information
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Text has sufficient contrast against its background
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Operable</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        All functionality is available from a keyboard
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Users have enough time to read and use content
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Content does not flash in a way that could cause seizures
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Users can easily navigate, find content, and determine where they are
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Understandable</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Text is readable and understandable
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Web pages appear and operate in predictable ways
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Users are helped to avoid and correct mistakes
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Robust</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        Content is compatible with current and future user tools
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        HTML is properly nested and attributes are properly formatted
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        ARIA roles and properties are correctly implemented
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Accessibility Statement */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container max-w-4xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-gold/10 text-lumicea-gold">Official Statement</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Accessibility Statement
              </h2>
            </div>
            
            <Card>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-lumicea-navy mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance Status</h3>
                    <p className="text-gray-700">
                      Lumicea strives to meet WCAG 2.1 Level AA standards for web accessibility. We are committed to 
                      ensuring our website is accessible to people with disabilities, including those with visual, 
                      auditory, physical, speech, cognitive, language, learning, and neurological disabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Code className="h-5 w-5 text-lumicea-navy mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Technical Specifications</h3>
                    <p className="text-gray-700">
                      Our website uses HTML5, CSS3, and JavaScript in compliance with W3C standards. We use ARIA attributes 
                      where appropriate to enhance accessibility for users of screen readers and other assistive technologies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BarChart className="h-5 w-5 text-lumicea-navy mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Methods</h3>
                    <p className="text-gray-700">
                      We regularly evaluate our website using a combination of automated testing tools, manual testing, 
                      and user testing with assistive technologies. We test with popular screen readers including 
                      JAWS, NVDA, and VoiceOver, and we validate our code against W3C standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MessageSquare className="h-5 w-5 text-lumicea-navy mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Feedback Process</h3>
                    <p className="text-gray-700 mb-4">
                      We welcome your feedback on the accessibility of our website. Please let us know if you encounter 
                      any barriers or have suggestions for improvement. Your input helps us identify areas where we can enhance accessibility.
                    </p>
                    <div className="bg-lumicea-navy/5 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 text-lumicea-navy mr-2" />
                          <a href="mailto:accessibility@lumicea.com" className="text-lumicea-navy hover:underline">
                            accessibility@lumicea.com
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-lumicea-navy mr-2" />
                          <a href="tel:+441234567890" className="text-lumicea-navy hover:underline">
                            +44 (0) 123 456 7890
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    This statement was last updated on July 15, 2024. We review our accessibility statement annually 
                    and update it as our website and technologies evolve.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Resources Section */}
        <section className="py-16">
          <div className="lumicea-container max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Accessibility Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              These resources may be helpful for users with specific accessibility needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-lumicea-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-6 w-6 text-lumicea-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Learn how to adjust your browser settings for better accessibility.
                  </p>
                  <a href="https://www.w3.org/WAI/users/browsing" target="_blank" rel="noopener noreferrer" className="text-lumicea-navy hover:underline text-sm">
                    Browser Accessibility Settings
                  </a>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-lumicea-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Headphones className="h-6 w-6 text-lumicea-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assistive Technologies</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Information about screen readers and other assistive technologies.
                  </p>
                  <a href="https://www.w3.org/WAI/people-use-web/tools-techniques" target="_blank" rel="noopener noreferrer" className="text-lumicea-navy hover:underline text-sm">
                    Assistive Technology Guide
                  </a>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 bg-lumicea-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-lumicea-navy" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">WCAG Guidelines</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Learn more about the standards we follow to make our site accessible.
                  </p>
                  <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-lumicea-navy hover:underline text-sm">
                    WCAG 2.1 Guidelines
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default AccessibilityPage;