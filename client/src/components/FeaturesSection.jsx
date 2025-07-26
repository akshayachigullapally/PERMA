import { Link2, Users, BarChart3, Shield, Smartphone, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Link2 className="w-8 h-8 text-blue-400" />,
      title: "Smart Link Management",
      description: "Organize all your online profiles in one intelligent hub"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-400" />,
      title: "Advanced Analytics",
      description: "Track clicks, devices, and engagement with detailed insights"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Secure & Private",
      description: "End-to-end encryption with password protection and link expiry"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-pink-400" />,
      title: "QR Code Generation",
      description: "Generate branded, static, or dynamic QR codes for easy sharing"
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-400" />,
      title: "Team Collaboration",
      description: "Enterprise tools with bulk onboarding and admin controls"
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-400" />,
      title: "AI-Powered",
      description: "Smart recommendations and auto-detection of your online presence"
    }
  ];

  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Perma?</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From students to enterprise teams, Perma adapts to your needs with powerful features and intuitive design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors group">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
