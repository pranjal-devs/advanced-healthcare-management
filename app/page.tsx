'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Users, UserCheck, Shield, Calendar, FileText, Heart, Phone, Mail, MapPin, Star, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN'>('PATIENT');

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HealthCare-Management</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/signin" 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern Healthcare
              <span className="text-blue-600"> Management</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your healthcare operations with our comprehensive platform designed for patients, doctors, and administrators.
            </p>
            
            {/* Role Selection Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-md">
                {(['PATIENT', 'DOCTOR', 'ADMIN'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`px-6 py-3 rounded-md font-medium transition-all ${
                      activeRole === role
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {role === 'PATIENT' && 'For Patients'}
                    {role === 'DOCTOR' && 'For Doctors'}
                    {role === 'ADMIN' && 'For Admins'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic CTA based on selected role */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/auth/signup?role=${activeRole}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors"
              >
                {activeRole === 'PATIENT' && 'Book Your First Appointment'}
                {activeRole === 'DOCTOR' && 'Join Our Medical Network'}
                {activeRole === 'ADMIN' && 'Manage Your Healthcare Facility'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href={`/auth/signin?role=${activeRole}`}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive healthcare management tools designed for modern medical practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Features */}
            <div className="bg-blue-50 rounded-xl p-8">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Patients</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-600">Easy appointment booking</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-600">Digital health records</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-600">Prescription management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-gray-600">Bill tracking & payments</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?role=PATIENT"
                className="inline-flex items-center mt-6 text-blue-600 hover:text-blue-700 font-medium"
              >
                Get Started as Patient <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Doctor Features */}
            <div className="bg-green-50 rounded-xl p-8">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Doctors</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-600">Patient management system</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-600">Schedule optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-600">Clinical decision support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-gray-600">Revenue tracking</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?role=DOCTOR"
                className="inline-flex items-center mt-6 text-green-600 hover:text-green-700 font-medium"
              >
                Join as Doctor <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Admin Features */}
            <div className="bg-purple-50 rounded-xl p-8">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">For Administrators</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-600">Complete system oversight</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-600">Analytics & reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-600">Staff management</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-gray-600">Financial oversight</span>
                </li>
              </ul>
              <Link
                href="/auth/signup?role=ADMIN"
                className="inline-flex items-center mt-6 text-purple-600 hover:text-purple-700 font-medium"
              >
                Start Managing <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">1K+</div>
              <div className="text-gray-600">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-600">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Healthcare Management
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our platform brings together patients, doctors, and healthcare administrators 
                in a seamless digital ecosystem that improves outcomes, reduces costs, and 
                enhances the overall healthcare experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Smart Scheduling</h4>
                    <p className="text-gray-600">AI-powered appointment optimization</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Digital Records</h4>
                    <p className="text-gray-600">Secure, accessible health information</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">HIPAA Compliant</h4>
                    <p className="text-gray-600">Enterprise-grade security & privacy</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Better Care, Better Outcomes
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of healthcare-Managementfessionals and patients who trust our platform 
                for their daily healthcare needs.
              </p>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">4.9/5 from 10,000+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our platform today and experience the future of healthcare management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Your Free Trial
            </Link>
            <Link
              href="#contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600">
              Have questions? We're here to help you get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600">+91 63986 48997</p>
              <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM IST</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600">kandpalpranjal10@gmail.com</p>
              <p className="text-sm text-gray-500">24/7 Email Support</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Office Location</h3>
              <p className="text-gray-600">Dehradun, Uttarakhand</p>
              <p className="text-sm text-gray-500">India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">HealthCare-Management</span>
              </div>
              <p className="text-gray-400">
                Modern healthcare management platform for patients, doctors, and administrators.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signup?role=PATIENT" className="hover:text-white">Book Appointment</Link></li>
                <li><Link href="/features/patients" className="hover:text-white">Patient Portal</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Doctors</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signup?role=DOCTOR" className="hover:text-white">Join Network</Link></li>
                <li><Link href="/features/doctors" className="hover:text-white">Doctor Portal</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy;Pranjal Kandpal 2025 HealthCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}