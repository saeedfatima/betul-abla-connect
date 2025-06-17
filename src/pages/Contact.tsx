
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Layout from '../components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to your backend
    console.log('Contact form submitted:', formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email",
      details: ["info@betulabla.org", "admin@betulabla.org"],
      description: "Send us an email anytime"
    },
    {
      icon: "📞",
      title: "Phone",
      details: ["+32 xxx xxx xxx", "+234 xxx xxx xxxx"],
      description: "Call during business hours"
    },
    {
      icon: "🏢",
      title: "Headquarters",
      details: ["Brussels, Belgium"],
      description: "Main administrative office"
    },
    {
      icon: "📍",
      title: "Field Offices",
      details: ["Kano State, Nigeria", "Jigawa State, Nigeria"],
      description: "Local program implementation"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Get in touch with us to learn more about our programs, volunteer opportunities, or partnership possibilities.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-ngo-primary-700">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this about?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-ngo-primary-500 hover:bg-ngo-primary-600">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-8">
                  We'd love to hear from you. Whether you're interested in our programs, want to volunteer, 
                  or explore partnership opportunities, don't hesitate to reach out.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-l-4 border-l-ngo-primary-500">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="text-2xl mr-4">{info.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{info.description}</p>
                          <div className="space-y-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-ngo-primary-600 font-medium">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                question: "How can I donate to Betul Abla Foundation?",
                answer: "We accept donations through various channels. Please contact us directly for information about donation methods and how your contribution will be used to support our programs."
              },
              {
                question: "Can I volunteer with your organization?",
                answer: "Yes! We welcome volunteers both in Belgium and Nigeria. Volunteer opportunities include program support, administrative assistance, and field work. Contact us to learn about current openings."
              },
              {
                question: "How do you select beneficiaries for your programs?",
                answer: "We use a comprehensive assessment process that includes community consultation, needs assessment, and vulnerability criteria to ensure our support reaches those who need it most."
              },
              {
                question: "How can organizations partner with you?",
                answer: "We're open to partnerships with organizations that share our values and mission. Partnership opportunities include funding, technical support, and program collaboration."
              },
              {
                question: "How do you ensure transparency in your operations?",
                answer: "We maintain detailed records of all our activities, provide regular reports to stakeholders, and are committed to full transparency in our operations and financial management."
              }
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-ngo-primary-700 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-ngo-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join us in our mission to create positive change in communities across Northern Nigeria.
          </p>
          <Button size="lg" variant="secondary" className="text-ngo-primary-700">
            Learn About Our Programs
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
