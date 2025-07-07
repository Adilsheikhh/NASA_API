import React from 'react';
import { motion } from 'framer-motion';
import { Telescope, Heart, ExternalLink, Github, Mail, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      category: "Resources",
      items: [
        { label: "NASA API", href: "https://api.nasa.gov/", external: true },
        { label: "Google Gemini", href: "https://gemini.google.com/", external: true },
        { label: "Next.js", href: "https://nextjs.org/", external: true },
      ]
    },
    {
      category: "Project",
      items: [
        { label: "GitHub", href: "#", external: true },
        { label: "Documentation", href: "#", external: false },
        { label: "Report Issues", href: "#", external: true },
      ]
    },
    {
      category: "Connect",
      items: [
        { label: "Contact", href: "mailto:contact@example.com", external: true },
        { label: "Twitter", href: "#", external: true },
        { label: "LinkedIn", href: "#", external: true },
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Telescope className="w-8 h-8 text-blue-300" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">NASA Image Explorer</h3>
                <p className="text-sm text-blue-200">Powered by AI</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Exploring the cosmos through NASA&apos;s amazing astronomical images, 
              enhanced with AI-powered explanations to make space science accessible to everyone.
            </p>
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <Sparkles className="w-4 h-4" />
              <span>Making astronomy accessible</span>
            </div>
          </motion.div>

          {/* Links Sections */}
          {links.map((section, sectionIndex) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-blue-300">{section.category}</h4>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (sectionIndex + 1) * 0.1 + itemIndex * 0.05 }}
                  >
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : "_self"}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item.label}
                      </span>
                      {item.external && (
                        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Images Explored", value: "1000+" },
              { label: "AI Explanations", value: "500+" },
              { label: "Daily Visitors", value: "50+" },
              { label: "Learning Sessions", value: "200+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold text-blue-300 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="border-t border-white/10 bg-black/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>© {currentYear} NASA Image Explorer</span>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="w-4 h-4 text-red-400 fill-current" />
                </motion.div>
                <span>for space enthusiasts</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
