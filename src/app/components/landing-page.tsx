import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {Youtube, Music, Facebook, Instagram, Linkedin, Globe, Heart, Info, Users, Eye, Zap, ChevronDown } from 'lucide-react';
/* import logo from 'figma:asset/6223fe5032d8da144d9baf903ed2611b2a580f46.png'; */
import { ImageWithFallback } from './figma/ImageWithFallback';
import logo from '/images/logo.jpeg';
import { db } from "../../firebaseConfig"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface FormData {
  name: string;
  email: string;
}

interface Course {
  id: number;
  name: string;
  image: string;
  description: string;
  duration: string;
  level: string;
  
}


/* Card Block */
const courses: Course[] = [
  {
    id: 1,
    name: "Impacted Tooth Extraction",
    // Use a relative path that points to your images folder
    image: "images/course-1.jpeg", 
    description: "Gain confidence in managing impacted teeth through structured surgical protocols, clinical tips, and case discussions.",
    duration: "Dr.Thomas Momen",
    level: "Online course"
  },
  {
    id: 2,
    name: "Clinical Decision-Making in Medically Compromised Dental Patients",
    image: "images/course-2.jpeg",
    description: "Enhance your confidence in managing patients with complex medical conditions. This course covers systematic assessment, evidence-based treatment modifications, and emergency preparedness to ensure safe, predictable dental care in medically compromised individuals.",
    duration: "Dr. Shahad Salah",
    level: "Online course"
  },
  {
    id: 3,
    name: "Digital Mastery program",
    image: "images/course-3.jpeg",
    description: "Master modern workflows to elevate patient care and profitability, Master modern digital workflows and transform your restorative practice",
    duration: "Dr. Esraa Elsayed",
    level: "Online Course"
  },
  {
    id: 4,
    name: "Clinical Decision-Making in Medically Compromised Dental Patients",
    image: "images/course-4.jpeg",
    description: "Introduction to orthodontic diagnosis, treatment planning, and basic appliance therapy. Learn to identify malocclusions and understand treatment mechanics.",
    duration: "Dr. Shahad Salah",
    level: "Online course"
  },
  /* {
    id: 5,
    name:"Digital Mastery program",
    image: "https://images.unsplash.com/photo-1758205308179-4e00e0e4060b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBzdXJnZXJ5JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODgwNTQwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Master modern workflows to elevate patient care and profitability 
Master modern digital workflows and transform your restorative practice",
    duration: "Dr. Esraa Elsayed",
    level: "Online Course"
  },
  {
    id: 6,
    name: "Clinical Decision-Making in Medically Compromised Dental Patients",
    image: "https://images.unsplash.com/photo-1598256989809-394fa4f6cd26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcnRob2RvbnRpY3MlMjB0ZWV0aCUyMGNhcmV8ZW58MXx8fHwxNzY4ODIxNDk0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Introduction to orthodontic diagnosis, treatment planning, and basic appliance therapy. Learn to identify malocclusions and understand treatment mechanics.",
    duration: "Online course Salah",
    level: "Online course Salah"
  },
  {
    id: 7,
    name: "Impacted Tooth Extraction",
    image: "https://images.unsplash.com/photo-1758205307783-f31fe8499814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBlZHVjYXRpb24lMjB0cmFpbmluZ3xlbnwxfHx8fDE3Njg4MjE0OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Master the latest techniques in dental implant placement and restoration. This comprehensive course covers surgical protocols, bone grafting, and immediate loading concepts.",
    duration: "Online course 
",
    level: "Online course"
  },
  {
    id: 8,
    name: "Clinical Decision-Making in Medically Compromised Dental Patients",
    image: "https://images.unsplash.com/photo-1758653500342-5476c8ec3da6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwcHJhY3RpY2UlMjBtZWRpY2FsfGVufDF8fHx8MTc2ODgyMTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Enhance your confidence in managing patients with complex medical conditions. This course covers systematic assessment, evidence-based treatment modifications, and emergency preparedness to ensure safe, predictable dental care in medically compromised individuals.",
    duration: "Online course Salah",
    level: "Online course"
  } */

];

// Counter Component with countdown animation
function CounterDisplay({ endValue }: { endValue: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let currentValue = 0;
    const increment = Math.ceil(endValue / 60);

    interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= endValue) {
        setCount(endValue);
        clearInterval(interval);
      } else {
        setCount(currentValue);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [endValue]);

  return (
    <motion.div
      className="text-4xl font-bold text-white tabular-nums"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {count.toLocaleString()}
    </motion.div>
  );
}

export default function LandingPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, "Waiting_list_Regiterations"), {
        name: data.name,
        email: data.email,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      // Reset form and success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        reset();
      }, 3000);
    } catch (error) {
      console.error("خطأ في حفظ البيانات:", error);
    }
  };

  return (
    <div className="size-full flex flex-col relative overflow-hidden">
      <div className="flex flex-col lg:flex-row relative">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Left Half - Form Section */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-500 via-teal-600 to-teal-700 p-8 lg:p-16 relative">
        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute -top-8 -left-8 w-20 h-20 border-4 border-white/30 rounded-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-8 -right-8 w-16 h-16 bg-white/20 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.h1
            className="text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Coming Soon
          </motion.h1>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-white to-teal-200 mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
          <motion.p
            className="text-white/90 mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Register <span className="font-bold text-white">NOW</span> and be the{' '}
            <span className="font-bold text-white">FIRST</span> to know when our{' '}
            <span className="font-bold text-white">APPLICATION</span> arrives!
          </motion.p>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="name" className="block text-white/90 mb-2 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg"
                placeholder="Enter your name"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label htmlFor="email" className="block text-white/90 mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg"
                placeholder="Enter your email"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              className="w-full bg-teal-500 text-white py-4 px-6 rounded-xl font-bold shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-teal-400"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Notify me!</span>
            </motion.button>

            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl p-5 text-white text-center shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-block text-3xl mb-2"
                >
                  ✓
                </motion.div>
                <p className="font-medium">Thank you for registering!</p>
                <p className="text-sm text-white/80">We'll notify you soon.</p>
              </motion.div>
            )}
          </motion.form>

          {/* Link to Additional Form */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {/* <Link to="/subscribe">
              <motion.button
                className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-medium border-2 border-white/30 shadow-lg mb-3"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                Complete Full Subscriber Form →
              </motion.button>
            </Link> */}
            <Link to="/register">
              <motion.button
                className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-medium border-2 border-white/30 shadow-lg"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                whileTap={{ scale: 0.98 }}
              >
                Professional Registration Form →
              </motion.button>
            </Link>

            {/*add Button to scroll to social media section */}
            <motion.button
              onClick={() => {
                const el = document.getElementById('social-media');
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="w-1/2 mx-auto mt-10 bg-gradient-to-r from-white/6 to-white/3 text-white py-3 px-6 rounded-xl font-semibold border border-white/20 shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-200 group"
              whileTap={{ scale: 0.98 }}
            >
              <span>Follow Us</span>
              <ChevronDown className="text-white group-hover:animate-bounce transition-transform duration-200" size={18} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Half - Logo Section */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-16 relative">
        <motion.div
          className="max-w-md w-full relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {/* Decorative gradient circles behind logo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-teal-50 to-slate-100 rounded-3xl -z-10"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.img
            src={logo}
            alt="DentlistMax Logo"
            className="w-full h-auto relative z-10 drop-shadow-2xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          <motion.div
            className="absolute top-10 right-10 w-3 h-3 bg-teal-400/70 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 left-10 w-4 h-4 bg-slate-400/70 rounded-full"
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute top-1/2 right-5 w-2 h-2 bg-teal-300/70 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </motion.div>
      </div>
      </div>
      
{/* Add Space */}
<footer className="w-full py-10  border-[#00a88f]/20 ">
  <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-4">
    
    {/* خط علوي أخضر مضيء للفصل بصرياً */}
    <div className="w-20 h-1 bg-[#00a88f] rounded-full mb-2 shadow-[0_0_15px_rgba(0,168,143,0.5)]" />
  </div>
</footer>

      {/* Stats/Counters Section */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-16 px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Followers Counter */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="inline-block p-4 bg-blue-500/20 rounded-xl mb-4 group-hover:bg-blue-500/30 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Users className="text-blue-300" size={32} strokeWidth={1.5} />
              </motion.div>
              <CounterDisplay endValue={10200} />
              <p className="text-white/80 text-sm mt-3 font-medium">Followers</p>
            </motion.div>

            {/* Views Counter */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="inline-block p-4 bg-purple-500/20 rounded-xl mb-4 group-hover:bg-purple-500/30 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Eye className="text-purple-300" size={32} strokeWidth={1.5} />
              </motion.div>
              <CounterDisplay endValue={185632} />
              <p className="text-white/80 text-sm mt-3 font-medium">Views</p>
            </motion.div>

            {/* Subscriptions Counter */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="inline-block p-4 bg-yellow-500/20 rounded-xl mb-4 group-hover:bg-yellow-500/30 transition-colors"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Zap className="text-yellow-300" size={32} strokeWidth={1.5} />
              </motion.div>
              <CounterDisplay endValue={675} />
              <p className="text-white/80 text-sm mt-3 font-medium">Subscriptions</p>
            </motion.div>

            {/* Likes Counter */}
            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 shadow-lg hover:shadow-2xl transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="inline-block p-4 bg-red-500/20 rounded-xl mb-4 group-hover:bg-red-500/30 transition-colors"
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.3 }}
              >
                <Heart className="text-red-300" size={32} strokeWidth={1.5} fill="currentColor" />
              </motion.div>
              <CounterDisplay endValue={54385} />
              <p className="text-white/80 text-sm mt-3 font-medium">Likes</p>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="w-full py-10  border-[#00a88f]/20 ">
  <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-4">
    
    {/* خط علوي أخضر مضيء للفصل بصرياً */}
    <div className="w-20 h-1 bg-[#00a88f] rounded-full mb-2 shadow-[0_0_15px_rgba(0,168,143,0.5)]" />
  </div>
</footer>

      {/* Upcoming Courses Section */}
      <div className="bg-gradient-to-br from-slate-500 via-teal-600 to-teal-700 py-16 px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-4">Upcoming Courses</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-cyan-300 mx-auto mb-4" />
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Expand your expertise with our comprehensive dental education programs
            </p>
          </motion.div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-10">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => setSelectedCourse(course)}
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30">
                    <Info className="text-white" size={20} />
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-5">
                  <h3 className="text-white mb-2 text-lg">{course.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-teal-400/30 text-white px-3 py-1 rounded-full">
                      {course.duration}
                    </span>
                    <span className="bg-cyan-400/30 text-white px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
<div id="social-media" className="flex items-center justify-center gap-6 mb-8 mt-20">
  {[
    { icon: <Youtube size={22} />, href: "https://youtube.com/@dentlistmax?si=xCIfR5Yo82spiRN_", color: "hover:text-[#FF0000]" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/dentlistmax?igsh=a3ZpNW4wdDdsZ3Bx&utm_source=qr", color: "hover:text-[#E1306C]" },
    // أيقونة تيك توك باستخدام Music كبديل ذكي أو SVG مخصص
    { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>),href: "https://www.tiktok.com/@dentlistmax_?_r=1&_t=ZS-93Qgl0L5xDE", color: "hover:shadow-[...rgba(156,163,175,0.3)]" }, 
    { icon: <Facebook size={20} strokeWidth={1.5}/>, href: "https://www.facebook.com/share/1AaEYM1Xtr/?mibextid=wwXIfr", color: "hover:text-[#1877F2]" },
    { icon: <Linkedin size={20} strokeWidth={1.5}/>, href: "https://www.linkedin.com/in/dentlist-max-a421032a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app", color: "hover:text-[#0A66C2]" }
  ].map((social, index) => (
    <motion.a
      key={index}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.15, y: -5 }}
      whileTap={{ scale: 0.9 }}
      className={`p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 ${social.color} hover:border-current hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-md`}
    >
      {social.icon}
    </motion.a>
  ))}
</div>

               <footer className="w-full py-10 mt-10 border-t border-[#00a88f]/20">
  <div className="container mx-auto px-6 flex flex-col items-center justify-center">
    
    {/* خط علوي أخضر مضيء للفصل بصرياً */}
    <div className="w-20 h-1 bg-[#00a88f] rounded-full mb-2 shadow-[0_0_15px_rgba(0,168,143,0.5)]" />
    
    <div className="text-center">
      <p className="text-white text-sm md:text-base font-medium tracking-widest">
        © 2026 <span className="font-bold">Future Coders </span>
      </p>
      
      {/* نص فرعي باللون الأخضر لربط الهوية البصرية */}
      <p className="text-[#00a88f] text-[10px] mt-2 uppercase tracking-[0.4em] font-semibold opacity-80">
        Powerd by W.M.D. office
      </p>
    </div>

    {/* نقطة نبض صغيرة توحي بأن الموقع نشط (Live) */}
    <div className="flex items-center gap-2 mt-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a88f] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a88f]"></span>
      </span>
      <span className="text-gray-500 text-[9px] uppercase tracking-tighter">System Active</span>
    </div>
  </div>
</footer>
        
      </div>

      {/* Course Detail Dialog */}
      {selectedCourse && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedCourse(null)}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Image */}
            <div className="relative h-64 overflow-hidden">
              <ImageWithFallback
                src={selectedCourse.image}
                alt={selectedCourse.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 to-transparent" />
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-8">
              <h2 className="text-slate-800 mb-4">{selectedCourse.name}</h2>
              
              <div className="flex gap-3 mb-6">
                <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg font-medium">
                  {selectedCourse.duration}
                </span>
                <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-lg font-medium">
                  {selectedCourse.level}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-slate-800 mb-3">Course Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="flex gap-3">
                {/* <motion.button
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-xl font-medium shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enroll Now
                </motion.button> */}
                <motion.button
                  className="flex-1 bg-slate-200 text-slate-700 py-3 px-6 rounded-xl font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCourse(null)}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

