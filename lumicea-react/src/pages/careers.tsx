import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, PoundSterling, Star, Users, Heart, Send, Coffee, Leaf, Mail, FileText, Phone, PenTool, CheckCircle, } from 'lucide-react';

const openPositions = [
  {
    title: 'Senior Jewelry Artisan',
    department: 'Production',
    location: 'London, UK',
    type: 'Full-time',
    salary: '£35,000 - £45,000',
    description: 'We\'re looking for an experienced jewelry artisan with expertise in metalwork and gemstone setting to join our production team.',
    responsibilities: [
      'Create high-quality handcrafted jewelry pieces from start to finish',
      'Work with precious metals including silver, gold, and rose gold',
      'Set gemstones with precision and attention to detail',
      'Maintain quality standards throughout the production process',
      'Contribute to new design development and prototyping'
    ],
    requirements: [
      'Minimum 3 years of experience in jewelry making',
      'Proficiency in metalsmithing techniques and gemstone setting',
      'Strong attention to detail and commitment to quality',
      'Ability to work independently and as part of a team',
      'Portfolio demonstrating technical skills and craftsmanship'
    ]
  },
  {
    title: 'E-Commerce Specialist',
    department: 'Marketing',
    location: 'London, UK (Hybrid)',
    type: 'Full-time',
    salary: '£30,000 - £38,000',
    description: 'Join our digital team to help grow our online presence and improve the customer shopping experience.',
    responsibilities: [
      'Manage and optimize product listings on our website',
      'Create compelling product descriptions and content',
      'Analyze customer behavior data to improve conversion rates',
      'Implement and test new features to enhance user experience',
      'Collaborate with marketing team on promotional strategies'
    ],
    requirements: [
      'Experience in e-commerce or digital marketing',
      'Understanding of SEO and content optimization',
      'Strong writing and communication skills',
      'Analytical mindset and attention to detail',
      'Familiarity with e-commerce platforms and analytics tools'
    ]
  },
  {
    title: 'Customer Experience Associate',
    department: 'Customer Service',
    location: 'Remote (UK-based)',
    type: 'Part-time',
    salary: '£12 - £14 per hour',
    description: 'Help deliver exceptional service to our customers through email, chat, and phone support.',
    responsibilities: [
      'Respond to customer inquiries about products, orders, and policies',
      'Process orders, returns, and exchanges efficiently',
      'Provide personalized recommendations and product guidance',
      'Resolve customer issues with empathy and professionalism',
      'Gather customer feedback to improve products and services'
    ],
    requirements: [
      'Previous customer service experience preferred',
      'Excellent written and verbal communication skills',
      'Problem-solving abilities and patience',
      'Availability to work some weekends and evenings',
      'Passion for jewelry and attention to detail'
    ]
  }
];

const benefits = [
  {
    icon: Heart,
    title: 'Employee Discount',
    description: 'Enjoy a generous 50% discount on all Lumicea products.'
  },
  {
    icon: Coffee,
    title: 'Flexible Working',
    description: 'We offer flexible hours and hybrid working arrangements for most positions.'
  },
  {
    icon: Star,
    title: 'Growth Opportunities',
    description: 'Regular training and development to help you advance your career.'
  },
  {
    icon: Users,
    title: 'Collaborative Culture',
    description: 'Work with a diverse team of creative and passionate individuals.'
  },
];

export function CareersPage() {
  const [selectedPosition, setSelectedPosition] = React.useState<number | null>(null);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-lumicea-gradient text-white py-16">
          <div className="lumicea-container text-center">
            <Briefcase className="h-16 w-16 text-lumicea-gold mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Build your career with a company that values craftsmanship, creativity, and individual growth.
            </p>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-navy/10 text-lumicea-navy">Why Choose Lumicea</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Culture & Benefits
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building a team of passionate individuals who share our values and vision for beautiful, sustainable jewelry.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Our Values</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lumicea-gold/10 flex items-center justify-center mt-0.5">
                          <Star className="h-4 w-4 text-lumicea-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Excellence in Craftsmanship</h4>
                          <p className="text-gray-600">We are committed to the highest standards of quality in everything we create.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lumicea-gold/10 flex items-center justify-center mt-0.5">
                          <Heart className="h-4 w-4 text-lumicea-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Passion for Our Art</h4>
                          <p className="text-gray-600">We love what we do and it shows in every piece we create.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lumicea-gold/10 flex items-center justify-center mt-0.5">
                          <Leaf className="h-4 w-4 text-lumicea-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Sustainability First</h4>
                          <p className="text-gray-600">We prioritize environmental responsibility in all our decisions.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lumicea-gold/10 flex items-center justify-center mt-0.5">
                          <Users className="h-4 w-4 text-lumicea-gold" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Inclusive Community</h4>
                          <p className="text-gray-600">We celebrate diversity and create a welcoming environment for all.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits & Perks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-lumicea-navy rounded-full flex items-center justify-center mb-3">
                            <benefit.icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 text-sm">
                        <strong>Additional benefits include:</strong> Health insurance, pension contributions, 
                        25 days annual leave, wellness programs, and professional development allowance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="relative py-10">
              <div className="absolute inset-0 bg-lumicea-navy/5 rounded-2xl"></div>
              <div className="relative p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment to Diversity & Inclusion</h3>
                <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
                  At Lumicea, we believe that diversity drives creativity and innovation. We are committed to 
                  building an inclusive workplace where all employees feel valued, respected, and empowered to 
                  contribute their unique perspectives. We actively seek candidates from varied backgrounds and 
                  experiences to join our team.
                </p>
                <Badge variant="outline" className="bg-lumicea-navy text-white border-none">Equal Opportunity Employer</Badge>
              </div>
            </div>
          </div>
        </section>
        
        {/* Open Positions */}
        <section className="py-16 bg-gray-50">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-lumicea-gold/10 text-lumicea-gold">Join Us</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Current Opportunities
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our open positions and find where your skills and passion align with our mission.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {openPositions.map((position, index) => (
                <Card 
                  key={index} 
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPosition === index ? 'ring-2 ring-lumicea-navy' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedPosition(selectedPosition === index ? null : index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-lumicea-navy/10 text-lumicea-navy">{position.department}</Badge>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span className="text-xs">{position.location}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <PoundSterling className="h-4 w-4 mr-1" />
                        <span>{position.salary}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{position.description}</p>
                    
                    <Button className="w-full lumicea-button-primary">
                      {selectedPosition === index ? 'View Less' : 'Learn More'}
                    </Button>
                    
                    {selectedPosition === index && (
                      <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Responsibilities:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {position.responsibilities.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {position.requirements.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <Button className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Don't see a position that fits your skills?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always interested in connecting with talented individuals who are passionate about our mission.
                Send us your resume and tell us how you could contribute to the Lumicea team.
              </p>
              <Button className="lumicea-button-primary">
                <Mail className="h-4 w-4 mr-2" />
                Submit Open Application
              </Button>
            </div>
          </div>
        </section>
        
        {/* Application Process */}
        <section className="py-16">
          <div className="lumicea-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Application Process
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                What to expect when you apply to join the Lumicea team.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-lumicea-navy/10 hidden md:block"></div>
                
                <div className="space-y-12">
                  {/* Step 1 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-start md:items-center">
                      <div className="w-16 h-16 rounded-full bg-lumicea-navy text-white flex items-center justify-center shadow-lg z-10">
                        <FileText className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-grow md:ml-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">1. Application Review</h3>
                        <p className="text-gray-700">
                          After you submit your application, our team will carefully review your resume and cover letter.
                          This typically takes 1-2 weeks, after which we'll contact you if your skills and experience align with our needs.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-start md:items-center">
                      <div className="w-16 h-16 rounded-full bg-lumicea-navy text-white flex items-center justify-center shadow-lg z-10">
                        <Phone className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-grow md:ml-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">2. Initial Interview</h3>
                        <p className="text-gray-700">
                          The first interview is typically a 30-minute video call with our HR team to discuss your background,
                          career aspirations, and how your skills might fit our current needs.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-start md:items-center">
                      <div className="w-16 h-16 rounded-full bg-lumicea-navy text-white flex items-center justify-center shadow-lg z-10">
                        <PenTool className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-grow md:ml-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">3. Skills Assessment</h3>
                        <p className="text-gray-700">
                          Depending on the role, you may be asked to complete a skills assessment or practical task.
                          For creative roles, we'll review your portfolio. For technical positions, we may have specific skill tests.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Step 4 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-start md:items-center">
                      <div className="w-16 h-16 rounded-full bg-lumicea-navy text-white flex items-center justify-center shadow-lg z-10">
                        <Users className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-grow md:ml-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">4. Team Interview</h3>
                        <p className="text-gray-700">
                          Meet with the team you'll be working with, including your potential manager.
                          This is an opportunity to ask questions and get a feel for the team culture.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Step 5 */}
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 flex items-start md:items-center">
                      <div className="w-16 h-16 rounded-full bg-lumicea-navy text-white flex items-center justify-center shadow-lg z-10">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                    </div>
                    <Card className="flex-grow md:ml-4">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">5. Offer & Onboarding</h3>
                        <p className="text-gray-700">
                          Successful candidates will receive an offer, and once accepted, our HR team will guide you
                          through the onboarding process to ensure a smooth transition into your new role at Lumicea.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 bg-lumicea-gradient text-white">
          <div className="lumicea-container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Join Our Team?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Explore our current openings and become part of a company that values creativity, craftsmanship, and sustainability.
            </p>
            <Button size="lg" className="bg-white text-lumicea-navy hover:bg-gray-100">
              <Briefcase className="h-5 w-5 mr-2" />
              View All Positions
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default CareersPage;
