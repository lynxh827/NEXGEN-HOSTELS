
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { useBooking } from "@/contexts/BookingContext";
import RoomCard from "@/components/RoomCard";
import FacilityCard from "@/components/FacilityCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { rooms, facilities } = useBooking();
  const navigate = useNavigate();
  
  // Display featured rooms and facilities (first 3 of each)
  const featuredRooms = rooms.slice(0, 3);
  const featuredFacilities = facilities.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation bar */}
      <Navbar />
      
      {/* Hero section */}
      <Hero />
      
      {/* Featured Rooms Section */}
      <section id="rooms" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Rooms</h2>
            <p className="text-lg text-gray-600">Comfortable living spaces designed for students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map(room => (
              <div key={room.id} onClick={() => navigate(`/room/${room.id}`)}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/student/dashboard')} 
              size="lg"
              className="bg-nexgen-600 hover:bg-nexgen-700"
            >
              View All Rooms
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Facilities Section */}
      <section id="facilities" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Facilities</h2>
            <p className="text-lg text-gray-600">Modern amenities to enhance your student experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFacilities.map(facility => (
              <div key={facility.id} onClick={() => navigate(`/facility/${facility.id}`)}>
                <FacilityCard facility={facility} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate('/student/dashboard')} 
              size="lg"
              variant="outline"
              className="border-nexgen-600 text-nexgen-600 hover:bg-nexgen-50"
            >
              Explore All Facilities
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-nexgen-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About NexGen Complex</h2>
            <p className="text-lg text-gray-700 mb-8">
              NexGen Complex offers premium student accommodation designed to enhance your academic journey. 
              Our modern facilities, comfortable rooms, and vibrant community create the perfect environment for students to thrive.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Modern Rooms</h3>
                <p className="text-gray-600">Well-designed rooms with all the amenities you need for comfortable living and studying.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Facilities</h3>
                <p className="text-gray-600">Access to gym, swimming pool, study areas, and recreational spaces.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Safe Community</h3>
                <p className="text-gray-600">24/7 security, supportive staff, and a vibrant student community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-nexgen-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your stay?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your room today and join our community of students pursuing academic excellence in a supportive environment.
          </p>
          <Button 
            onClick={() => navigate('/login')} 
            size="lg"
            className="bg-white text-nexgen-900 hover:bg-gray-100"
          >
            Get Started
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NexGen Complex</h3>
              <p className="text-gray-400">Premium student accommodation for modern learners.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="#rooms" className="hover:text-white">Rooms</a></li>
                <li><a href="#facilities" className="hover:text-white">Facilities</a></li>
                <li><a href="/login" className="hover:text-white">Login</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">123 University Avenue</p>
              <p className="text-gray-400">Cityville, State 12345</p>
              <p className="text-gray-400">info@nexgencomplex.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} NexGen Complex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
