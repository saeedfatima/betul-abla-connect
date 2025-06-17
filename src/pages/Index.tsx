
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '../components/Layout';

const Index = () => {
  const services = [
    {
      title: "Orphan Care",
      description: "Providing comprehensive care, education, and monthly allowances to orphaned children in Northern Nigeria.",
      icon: "👶"
    },
    {
      title: "Monthly Feeding",
      description: "Regular feeding programs ensuring nutritional support for vulnerable families and communities.",
      icon: "🍲"
    },
    {
      title: "Clean Water Access",
      description: "Drilling boreholes to provide clean, safe drinking water to rural communities.",
      icon: "💧"
    },
    {
      title: "Educational Support",
      description: "Supporting education initiatives and providing school supplies to underprivileged children.",
      icon: "📚"
    }
  ];

  const stats = [
    { number: "500+", label: "Orphans Supported" },
    { number: "50+", label: "Boreholes Drilled" },
    { number: "10,000+", label: "People Served" },
    { number: "15", label: "Communities Reached" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Bringing Hope to Communities
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Betul Abla Foundation is dedicated to humanitarian care, supporting orphans and providing clean water access to communities in Northern Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-ngo-primary-700" asChild>
              <Link to="/services">Our Services</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-ngo-primary-700" asChild>
              <Link to="/contact">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold text-ngo-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We focus on sustainable humanitarian interventions that create lasting positive change in communities across Northern Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow gradient-card border-0">
                <CardHeader>
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle className="text-xl text-ngo-primary-700">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-ngo-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Based in Belgium, Betul Abla Foundation operates with a clear mission to provide humanitarian support where it's needed most. We focus on sustainable interventions that create lasting change in the lives of orphaned children and underserved communities.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Through our comprehensive programs in Kano State, Jigawa, and surrounding areas, we address critical needs including child welfare, food security, clean water access, and educational support.
              </p>
              <Button size="lg" className="bg-ngo-primary-500 hover:bg-ngo-primary-600" asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-ngo-primary-700 mb-6">Key Focus Areas</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-ngo-primary-500 rounded-full mr-3"></div>
                  <span>Orphan care and monthly allowances</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-ngo-primary-500 rounded-full mr-3"></div>
                  <span>Community feeding programs</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-ngo-primary-500 rounded-full mr-3"></div>
                  <span>Borehole construction for clean water</span>
                </li>
                <li className="flex items-center">
                  <div className="w-3 h-3 bg-ngo-primary-500 rounded-full mr-3"></div>
                  <span>Educational support initiatives</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-ngo-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Together, we can create lasting change in the lives of those who need it most. Get involved today and be part of our humanitarian mission.
          </p>
          <Button size="lg" variant="secondary" className="text-ngo-primary-700" asChild>
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
