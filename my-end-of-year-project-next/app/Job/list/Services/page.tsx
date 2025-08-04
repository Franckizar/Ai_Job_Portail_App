'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  DollarSign,
  Star,
  CheckCircle,
  Search,
  Filter,
  ClipboardList,
  FileText,
  Settings,
  Syringe,
  Phone,
  Calendar,
  MapPin
} from 'lucide-react';

interface Service {
  id: number;
  serviceName: string;
  serviceCode: string;
  description: string;
  category: string;
  basePrice: number;
  duration: string;
  isActive: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

type CategoryType = 'PREVENTIVE' | 'SURGICAL' | 'COSMETIC' | 'RESTORATIVE';

const DentalServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const categories = ['ALL', 'PREVENTIVE', 'SURGICAL', 'COSMETIC', 'RESTORATIVE'] as const;

  const categoryColors: Record<CategoryType | 'DEFAULT', string> = {
    PREVENTIVE: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    SURGICAL: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
    COSMETIC: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    RESTORATIVE: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200',
    DEFAULT: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
  };

  const categoryIcons: Record<CategoryType, React.ReactElement> = {
    PREVENTIVE: <ClipboardList className="w-6 h-6" />,
    SURGICAL: <Syringe className="w-6 h-6" />,
    COSMETIC: <Star className="w-6 h-6" />,
    RESTORATIVE: <Settings className="w-6 h-6" />
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://wambs-clinic.onrender.com/api/v1/auth/services/all');
        const data: Service[] = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const colorClass = categoryColors[service.category as CategoryType] || categoryColors.DEFAULT;
    const icon = categoryIcons[service.category as CategoryType] || <FileText className="w-6 h-6" />;

    return (
      <div className={`${colorClass} rounded-2xl p-6 border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-blue-600">{icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                {service.serviceName}
              </h3>
              <span className="text-sm text-gray-500 font-medium">
                {service.serviceCode}
              </span>
            </div>
          </div>
          <div className="bg-white/70 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              {service.category}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mb-4 text-sm leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{service.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <DollarSign className="w-4 h-4" />
            <span className="font-bold text-lg">${service.basePrice}</span>
          </div>
        </div>

        {service.notes && (
          <div className="bg-white/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600 italic">
              💡 {service.notes}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Available</span>
          </div>
          <button className="bg-white/80 hover:bg-white px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200">
            Book Now
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'ALL' ? 'All Services' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* Light-colored Footer */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-t border-gray-200 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Us</h3>
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Mon-Fri: 8am - 6pm</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">123 Dental St, Smile City</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition">Home</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition">Services</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition">About Us</a></li>
                <li><a href="#" className="text-gray-700 hover:text-blue-600 transition">Patient Info</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h3>
              <p className="text-gray-700 mb-4">Ready to schedule your visit?</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Book Online
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Dental Clinic. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalServicesPage;