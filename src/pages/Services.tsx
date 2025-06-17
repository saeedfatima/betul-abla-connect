
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '../components/Layout';

const Services = () => {
  const services = [
    {
      title: "Orphan Care & Support",
      description: "Comprehensive care program providing shelter, education, healthcare, and monthly allowances to orphaned children.",
      features: [
        "Monthly financial allowances",
        "Educational support and school fees",
        "Healthcare and medical assistance",
        "Clothing and basic necessities",
        "Psychological support and counseling"
      ],
      locations: ["Kano State", "Jigawa State"],
      beneficiaries: "500+ orphans currently supported"
    },
    {
      title: "Monthly Feeding Programs",
      description: "Regular feeding initiatives ensuring food security for vulnerable families and communities.",
      features: [
        "Monthly food distribution",
        "Nutritional meal programs",
        "Emergency food relief",
        "Community kitchen support",
        "Ramadan special programs"
      ],
      locations: ["Rural communities in Kano", "Remote villages in Jigawa"],
      beneficiaries: "10,000+ people reached monthly"
    },
    {
      title: "Clean Water Access",
      description: "Drilling boreholes and providing sustainable clean water solutions to rural communities.",
      features: [
        "Borehole drilling and construction",
        "Water quality testing",
        "Maintenance and repair services",
        "Community training on water management",
        "Solar-powered water systems"
      ],
      locations: ["Rural Kano communities", "Remote Jigawa villages"],
      beneficiaries: "50+ boreholes constructed"
    },
    {
      title: "Educational Support",
      description: "Supporting education initiatives and providing resources for underprivileged children.",
      features: [
        "School fees assistance",
        "Educational materials and supplies",
        "Scholarship programs",
        "Adult literacy programs",
        "Vocational training support"
      ],
      locations: ["Schools in Kano and Jigawa"],
      beneficiaries: "1,000+ students supported"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Comprehensive humanitarian programs designed to create sustainable positive impact in Northern Nigeria communities.
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl text-ngo-primary-700">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                          <ul className="space-y-1">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-gray-600">
                                <div className="w-2 h-2 bg-ngo-primary-500 rounded-full mr-3"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Service Areas:</h4>
                          <p className="text-gray-600">{service.locations.join(", ")}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Impact:</h4>
                          <p className="text-ngo-primary-600 font-semibold">{service.beneficiaries}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className={`bg-gradient-to-r ${
                  index % 2 === 0 
                    ? 'from-ngo-primary-50 to-ngo-primary-100' 
                    : 'from-ngo-secondary-50 to-ngo-secondary-100'
                } p-8 rounded-lg ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="text-6xl mb-4">
                    {index === 0 && '👶'}
                    {index === 1 && '🍲'}
                    {index === 2 && '💧'}
                    {index === 3 && '📚'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Making a Difference</h3>
                  <p className="text-gray-700">
                    Our {service.title.toLowerCase()} program represents our commitment to sustainable humanitarian intervention. 
                    Through systematic approach and community partnership, we ensure lasting positive impact.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our systematic approach ensures effective program delivery and sustainable impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Assessment", description: "Community needs assessment and beneficiary identification" },
              { step: "2", title: "Planning", description: "Strategic program planning and resource allocation" },
              { step: "3", title: "Implementation", description: "Program execution with local community partnership" },
              { step: "4", title: "Monitoring", description: "Continuous monitoring and impact evaluation" }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-ngo-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{process.title}</h3>
                <p className="text-gray-600">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-ngo-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner With Us
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join our mission to create sustainable change. Whether through donations, volunteering, or partnerships, your support makes a difference.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
