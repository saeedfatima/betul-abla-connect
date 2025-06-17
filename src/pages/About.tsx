
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '../components/Layout';

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Amina Hassan",
      position: "Executive Director",
      description: "Leading humanitarian efforts with over 15 years of experience in NGO management.",
      location: "Brussels, Belgium"
    },
    {
      name: "Ibrahim Mohammed",
      position: "Field Coordinator",
      description: "Overseeing on-ground operations in Northern Nigeria with local community expertise.",
      location: "Kano, Nigeria"
    },
    {
      name: "Fatima Usman",
      position: "Programs Manager",
      description: "Managing orphan care and feeding programs with a focus on sustainable impact.",
      location: "Jigawa, Nigeria"
    }
  ];

  const milestones = [
    { year: "2015", event: "Foundation established in Brussels, Belgium" },
    { year: "2016", event: "First orphan care program launched in Kano State" },
    { year: "2018", event: "100th orphan enrolled in our care program" },
    { year: "2020", event: "First borehole project completed" },
    { year: "2022", event: "Expanded operations to Jigawa State" },
    { year: "2024", event: "500+ orphans supported, 50+ boreholes completed" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Learn about our journey, mission, and the dedicated team working to create positive change in Northern Nigeria.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-ngo-primary-700 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Betul Abla Foundation is dedicated to providing comprehensive humanitarian support to vulnerable communities 
                  in Northern Nigeria. We focus on orphan care, food security, clean water access, and educational empowerment 
                  to create sustainable, positive change in the lives of those who need it most.
                </p>
              </CardContent>
            </Card>

            <Card className="gradient-card border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-ngo-primary-700 flex items-center">
                  <span className="text-3xl mr-3">🌟</span>
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be a leading humanitarian organization that transforms communities through sustainable interventions, 
                  ensuring every child has access to care, education, and opportunities to thrive, while communities have 
                  access to basic necessities like clean water and food security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Our Story
            </h2>
            
            <div className="prose prose-lg mx-auto text-gray-700">
              <p className="text-xl mb-6">
                Founded in 2015 in Brussels, Belgium, Betul Abla Foundation emerged from a deep commitment to address 
                the humanitarian challenges facing communities in Northern Nigeria, particularly in Kano and Jigawa states.
              </p>
              
              <p className="mb-6">
                Our founders, driven by the principles of compassion and social responsibility, recognized the urgent need 
                for sustainable interventions in areas of child welfare, food security, and basic infrastructure. What began 
                as a small initiative to support orphaned children has grown into a comprehensive humanitarian organization 
                touching thousands of lives.
              </p>
              
              <p className="mb-6">
                Operating from our headquarters in Belgium while maintaining strong field presence in Nigeria, we bridge 
                international resources with local expertise to ensure our programs are culturally appropriate, sustainable, 
                and impactful.
              </p>
              
              <p>
                Today, we are proud to support over 500 orphans, have constructed more than 50 boreholes, and continue 
                to serve thousands of community members through our various programs. Our work is guided by transparency, 
                accountability, and a deep respect for the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Our Journey
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0 w-24 text-right">
                    <span className="text-2xl font-bold text-ngo-primary-600">{milestone.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 bg-ngo-primary-500 rounded-full mx-6 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Our Leadership Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-ngo-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-ngo-primary-700">{member.name}</CardTitle>
                  <p className="text-ngo-secondary-600 font-semibold">{member.position}</p>
                  <p className="text-sm text-gray-500">{member.location}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "❤️", title: "Compassion", description: "We approach every situation with empathy and understanding" },
              { icon: "🤝", title: "Integrity", description: "We maintain the highest standards of honesty and transparency" },
              { icon: "🌱", title: "Sustainability", description: "We focus on long-term solutions that create lasting impact" },
              { icon: "🤲", title: "Respect", description: "We honor the dignity and culture of every community we serve" }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-ngo-primary-700 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
