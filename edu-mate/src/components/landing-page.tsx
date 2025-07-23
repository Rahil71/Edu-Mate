import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import heroEducationImg from "./../assets/hero-bg.png";
import Logo from "./../assets/horizontal_logo.png";
import avatar1 from "./../assets/avatars/avatar1.jpg";
import avatar2 from "./../assets/avatars/avatar2.jpg";
import avatar3 from "./../assets/avatars/avatar3.jpg";
import avatar4 from "./../assets/avatars/avatar4.jpg";


export function LandingPage() {

  const avatars = [avatar1, avatar2, avatar3, avatar4];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradient-start to-background-gradient-end text-primary-text px-6 py-12 relative overflow-hidden font-sans">
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-10 backdrop-blur-sm bg-black/20 rounded-b-xl shadow-md">
        <img
          src={Logo}
          alt="EduMate Logo"
          className="h-11 w-auto"
        />
        <Link
          to="/login"
          className="px-5 py-2 rounded-full bg-white text-button-text-dark shadow hover:bg-gray-100 transition font-semibold"
        >
          Sign In
        </Link>
      </header>

      {/* Main Grid */}
      <main className="mt-20 md:mt-36 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        
        {/* Left: Textual Content */}
        <div className="text-center lg:text-left space-y-8">
          {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-3 animate-fade-in">
            <div className="flex -space-x-2">
              {avatars.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt={`User ${i + 1}`}
                  className="h-8 w-8 rounded-full ring-2 ring-white object-cover bg-gray-200"
                />
              ))}
            </div>
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-300">Trusted by educators globally</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
            Revolutionizing Learning with <span className="text-accent-orange">EduMate</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
            A smart platform built for teachers, students, and institutions to learn, manage, and grow together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2 animate-fade-in-up">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-button-text-light rounded-full shadow-lg hover:shadow-xl transition duration-300 font-semibold text-lg group"
            >
              Login
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-button-text-dark rounded-full shadow-lg hover:bg-gray-100 transition duration-300 font-semibold text-lg"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="w-full h-full mb-4 flex justify-center items-center animate-fade-in-up">
          <img
            src={heroEducationImg}
            alt="Digital classroom illustration"
            className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-xl shadow-lg"
          />
        </div>
      </main>
    </div>
  );
}
