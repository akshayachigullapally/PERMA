import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LinkIcon, 
  ChartBarIcon, 
  QrCodeIcon, 
  ShieldCheckIcon,
  TrophyIcon,
  DocumentIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: LinkIcon,
      title: 'One Link for Everything',
      description: 'Share your entire online presence with a single, memorable URL: perma.in/yourname'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Track clicks, views, and engagement with detailed analytics and insights'
    },
    {
      icon: QrCodeIcon,
      title: 'Dynamic QR Codes',
      description: 'Generate branded QR codes with time limits and custom styling'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Privacy & Security',
      description: 'Password protection, link expiry, and zero-knowledge encryption'
    },
    {
      icon: TrophyIcon,
      title: 'Gamification',
      description: 'Earn badges, maintain streaks, and complete AI-powered missions'
    },
    {
      icon: DocumentIcon,
      title: 'ATS Resume Builder',
      description: 'Generate professional resumes with embedded QR codes and recruiter tracking'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      image: '👩‍💻',
      quote: 'Perma simplified my job search. One link in my email signature gives recruiters access to everything.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Design Lead',
      image: '🎨',
      quote: 'The analytics helped me understand which portfolio pieces actually get viewed. Game changer!'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Research Scientist',
      image: '🔬',
      quote: 'Perfect for academic networking. I can share my papers, talks, and contact info instantly.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Up to 10 links',
        'Basic analytics',
        'Standard QR codes',
        'Public directory listing',
        'Mobile app access'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$5',
      period: 'per month',
      features: [
        'Unlimited links',
        'Advanced analytics',
        'Branded QR codes',
        'Custom domain',
        'Priority support',
        'Resume builder',
        'Talent marketplace'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per user',
      features: [
        'Everything in Pro',
        'Bulk user management',
        'SCIM/SSO integration',
        'Advanced compliance',
        'Dedicated support',
        'Custom branding'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-white font-bold text-xl">Perma</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/sign-in" className="text-white hover:text-gray-200 transition-colors">
                Sign In
              </Link>
              <Link to="/sign-up" className="btn-primary text-white px-6 py-2 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your identity.{' '}
            <span className="gradient-text">All in one link.</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Share smarter. Connect faster. Make every user's online presence instantly accessible, 
            secure, trackable and—even a little fun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/sign-up" className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold flex items-center space-x-2">
              <span>Start Building Your Perma</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <div className="text-gray-200">
              Free forever • No credit card required
            </div>
          </div>
          
          {/* Demo Link */}
          <div className="glass-effect rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 text-white">
              <LinkIcon className="h-5 w-5 text-gray-300" />
              <span className="font-mono text-lg">perma.in/yourname</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Everything you need to shine online
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-effect rounded-xl p-6 card-hover">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Loved by professionals worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-effect rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">{testimonial.image}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-200 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-200 text-center mb-16">
            Start free, upgrade when you're ready
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`
                  glass-effect rounded-xl p-8 relative
                  ${plan.popular ? 'ring-2 ring-purple-400' : ''}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300 ml-2">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-200">
                      <CheckIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.name === 'Enterprise' ? (
                  <button 
                    className={`
                      w-full py-3 px-6 rounded-lg font-semibold transition-all
                      ${plan.popular 
                        ? 'btn-primary text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                      }
                    `}
                  >
                    {plan.cta}
                  </button>
                ) : (
                  <Link to="/sign-up">
                    <button 
                      className={`
                        w-full py-3 px-6 rounded-lg font-semibold transition-all
                        ${plan.popular 
                          ? 'btn-primary text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                        }
                      `}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-effect rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Join thousands of professionals who are already using Perma to showcase their work
            </p>
            <Link to="/sign-up" className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold">
              Create Your Perma Link
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-white font-bold text-lg">Perma</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your identity. All in one link. Share smarter. Connect faster.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-gray-300 text-sm">
              © 2025 Perma. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
