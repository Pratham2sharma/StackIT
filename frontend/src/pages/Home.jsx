import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [statsVisible, setStatsVisible] = useState(false);



  const AnimatedCounter = ({ target, suffix = '+' }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsVisible) return;
      
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCount(Math.floor(current));
      }, 16);

      return () => clearInterval(timer);
    }, [target, statsVisible]);

    return <span>{count}{suffix}</span>;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5, rootMargin: '0px 0px -100px 0px' }
    );

    const statsElement = document.getElementById('stats');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);



  const features = [
    {
      icon: '❓',
      title: 'Ask Anything',
      text: 'Post questions on any topic and get answers from our knowledgeable community. No question is too simple or too complex.'
    },
    {
      icon: '🎯',
      title: 'Quality Answers',
      text: 'Our voting system ensures the best answers rise to the top, helping you find reliable information quickly.'
    },
    {
      icon: '🌟',
      title: 'Build Reputation',
      text: 'Earn reputation points by asking great questions and providing helpful answers. Become a trusted community member.'
    },
    {
      icon: '🔍',
      title: 'Easy Discovery',
      text: 'Find answers to similar questions through our powerful search and topic organization system.'
    },
    {
      icon: '💬',
      title: 'Engage & Learn',
      text: 'Comment, discuss, and collaborate with other learners to deepen your understanding of any topic.'
    },
    {
      icon: '🛡️',
      title: 'Safe Space',
      text: 'Our moderation system ensures a respectful, harassment-free environment for productive learning.'
    }
  ];

  const footerSections = [
    {
      title: 'Community',
      links: [
        'Browse Questions',
        'Popular Topics',
        'Top Contributors',
        'Recent Activity',
        'Community Guidelines'
      ]
    },
    {
      title: 'Support',
      links: [
        'Help Center',
        'Getting Started',
        'FAQ',
        'Contact Us',
        'Report Issue'
      ]
    },
    {
      title: 'Platform',
      links: [
        'API Documentation',
        'Mobile App',
        'Browser Extension',
        'Status Page',
        'Careers'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-animated animate-gradient text-white relative overflow-hidden">

      

      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-1 bg-orange-500/60 rounded-full animate-float" 
            style={{
              left: `${10 + i * 10}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-7xl font-black animate-slide-up mb-6 leading-tight">
            <span className="text-white">🚀</span>
            <span className="text-gradient animate-gradient-text"> Learn Together, Grow Together </span>
            <span className="text-white">🌟</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/95 animate-pulse-custom max-w-3xl mx-auto mb-12 leading-relaxed">
            💡 Join StackIt, the collaborative Q&A platform where knowledge flows freely and every question leads to discovery. Connect with brilliant minds worldwide! 🌍
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-full btn-gradient animate-gradient-text text-white font-bold shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/60 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
            >
              🚀 Start Asking Questions
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-orange-500/30 text-white hover:bg-orange-500/20 hover:border-orange-500/80 hover:-translate-y-1 transition-all duration-300 font-semibold"
            >
              🌟 Explore Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8 text-center relative z-10" id="stats">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6">
            <div className="text-6xl font-black text-gradient mb-2">
              <AnimatedCounter target={10} suffix="K+" />
            </div>
            <div className="text-white/90 font-medium text-lg">Questions Answered</div>
          </div>
          <div className="p-6">
            <div className="text-6xl font-black text-gradient mb-2">
              <AnimatedCounter target={5} suffix="K+" />
            </div>
            <div className="text-white/90 font-medium text-lg">Active Members</div>
          </div>
          <div className="p-6">
            <div className="text-6xl font-black text-gradient mb-2">
              <AnimatedCounter target={50} suffix="+" />
            </div>
            <div className="text-white/90 font-medium text-lg">Topics Covered</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 my-16 bg-white/10 backdrop-blur-sm relative z-10" id="features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-white mb-4">
            ✨ Why Choose StackIt? ✨
          </h2>
          <p className="text-xl text-white/80 text-center max-w-3xl mx-auto mb-16">
            Experience the power of community-driven learning with our intuitive platform designed for knowledge sharing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/8 backdrop-blur-xl rounded-3xl p-10 text-center border border-orange-500/20 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:scale-105 hover:bg-orange-500/10 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 group"
              >
                <div className="w-20 h-20 mx-auto mb-8 btn-gradient animate-gradient-text rounded-full flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed group-hover:text-white/90 transition-colors">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center bg-white/10 backdrop-blur-sm relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            🎉 Ready to Join the Community? 🎉
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            🌟 Start your learning journey today. Ask questions, share knowledge, and connect with curious minds from around the world. Your next breakthrough is just one question away! 💫
          </p>
          <Link 
            to="/register" 
            className="px-10 py-5 text-xl rounded-full btn-gradient animate-gradient-text text-white font-bold shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/60 hover:-translate-y-1 hover:scale-105 transition-all duration-300"
          >
            🎯 Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 py-16 px-8 border-t border-orange-500/20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div className="max-w-sm">
              <h3 className="text-orange-500 text-xl font-bold mb-4">About StackIt</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                StackIt is a collaborative Q&A platform designed to foster knowledge sharing and community learning. Join thousands of curious minds exploring topics together.
              </p>
              <div className="flex gap-4">
                {['📘', '🐦', '💼', '📷'].map((icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-orange-500 text-xl font-bold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-white/80 hover:text-orange-500 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; 2025 StackIt. Built for learners, by learners.
            </p>
            <div className="flex gap-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((link, index) => (
                <a key={index} href="#" className="text-white/70 hover:text-orange-500 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;