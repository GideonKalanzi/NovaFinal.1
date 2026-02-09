import React, { useState, FormEvent } from 'react';
import { Leaf, Package2, Phone, Mail, MapPin, ChevronDown, Recycle, Shield, TreePine, Settings, DollarSign } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider, useProducts } from './contexts/ProductContext';
import { ContactProvider, useContacts } from './contexts/ContactContext';
import { ThemeToggle } from './components/ThemeToggle';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

const iconMap = {
  Package2,
  Recycle,
  Shield
};

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { products } = useProducts();
  const { addMessage } = useContacts();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  if (isAuthenticated && isAdmin) {
    return <AdminPanel />;
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add message to admin panel
      addMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      await emailjs.send(
        'service_09koayl',
        'template_fi7qfq8',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'XXSBJ_YNd20tVclnR'
      );

      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Email error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Toaster position="top-right" />
      {/* Navigation */}
      <nav className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800 dark:text-green-400">Nova Eco-Packaging</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-8">
                <button onClick={() => scrollToSection('home')} className="text-green-800 dark:text-green-400 hover:text-green-600">Home</button>
                <button onClick={() => scrollToSection('products')} className="text-green-800 dark:text-green-400 hover:text-green-600">Products</button>
                <button onClick={() => scrollToSection('about')} className="text-green-800 dark:text-green-400 hover:text-green-600">About</button>
                <button onClick={() => scrollToSection('contact')} className="text-green-800 dark:text-green-400 hover:text-green-600">Contact</button>
              </div>
              <ThemeToggle />
              <button
                onClick={() => setShowAdminLogin(true)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Admin Login"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-32 bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 dark:text-green-400 mb-6">
              Sustainable Packaging Solutions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Leading the revolution in eco-friendly packaging with innovative, biodegradable solutions for a greener tomorrow.
            </p>
            <button
              onClick={() => scrollToSection('products')}
              className="flex items-center space-x-2 bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors"
            >
              Explore Our Products
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-green-800 dark:text-green-400 mb-16">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => {
              const IconComponent = iconMap[product.icon as keyof typeof iconMap] || Package2;
              return (
                <div key={product.id} className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8 text-center">
                  <IconComponent className="h-12 w-12 mx-auto text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-green-600 font-bold text-lg">
                    <DollarSign className="h-5 w-5" />
                    <span>{product.price.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">About Nova Eco-Packaging</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                NOVA-ECO PACKAGING (U) LTD is a youth run start-up that was conceived in 2019 to innovate
                new affordable and environmentally friendly solutions to product packaging especially for Small
                and Medium Enterprises (SMEs). Since then, our company has evolved from a small informal
                entity into a formally established business. We have established a dedicated production facility,
                enabling us to innovate better products, serve our customers better and further our vision of a
                changed packaging industry landscape that priotizes innovation and sustainability to empower
                businesses and individuals to make a positive & lasting Impact on the environment.
                We are striving to become the leading provider of eco-packaging solutions in the region,
                fostering a culture of innovation and sustainability and inspire a national movement towards a
                waste free future.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <TreePine className="h-6 w-6 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">100% Sustainable Materials</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <Recycle className="h-6 w-6 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Fully Biodegradable Products</span>
              </div>
              <div className="flex items-center space-x-4">
                <Shield className="h-6 w-6 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Environmental Certifications</span>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&q=80&w=800"
                alt="Sustainable Packaging"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-green-800 dark:text-green-400 mb-16">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    +256764684872(Available on Whastapp) <br />
                    +256779526240 <br />
                    +256705746439 <br />
                    +256704561630
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">ecofairpackaging@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-400">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Kampala workshop: Nasser road, Ddembelyo house 2nd floor. <br />
                    Mbarara workshop: Rwebikoona Market No.61
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 dark:bg-green-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-6 w-6" />
            <span className="text-xl font-bold">Nova Packaging</span>
          </div>
          <p className="text-green-200 dark:text-green-300">© 2025 Nova Packaging. All rights reserved.</p>
        </div>
      </footer>

      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContactProvider>
          <ProductProvider>
            <AppContent />
          </ProductProvider>
        </ContactProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;