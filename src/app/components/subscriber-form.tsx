import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface SubscriberFormData {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  interests: string[];
  experience: string;
  feedback: string;
  attachment?: FileList;
}

export default function SubscriberForm() {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<SubscriberFormData>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onSubmit = async (data: SubscriberFormData) => {
    try {
      await addDoc(collection(db, "Waiting_list_Regiterations"), {
        email: data.email,
        fullName: data.fullName || "Subscriber",
        phone: data.phone || "",
        role: data.role || "",
        interests: data.interests || [],
        experience: data.experience || "",
        feedback: data.feedback || "",
        createdAt: serverTimestamp(),
      });
      alert("تم الاشتراك بنجاح في القائمة البريدية!");
      setIsSubmitted(true);
      // Reset form and success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedFile(null);
        reset();
      }, 3000);
    } catch (error) {
      console.error("خطأ في الاتصال بقاعدة البيانات:", error);
      alert("حدث خطأ في الاشتراك. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('attachment') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-500 via-teal-600 to-teal-700 relative overflow-hidden">
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
      </div>

      {/* Header with Back Button */}
      <div className="relative z-10 p-6">
        <Link to="/">
          <motion.button
            className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl text-white font-medium border-2 border-white/30 shadow-lg"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Home
          </motion.button>
        </Link>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border-2 border-white/20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Subscriber Information
          </motion.h1>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-white to-teal-200 mb-6"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />
          <motion.p
            className="text-white/90 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Help us understand your needs better by completing this form.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-white/90 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.fullName.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div>
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
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-white/90 mb-2 font-medium">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.phone.message}
                </motion.p>
              )}
            </div>

            {/* Role - Multiple Choice (Radio) */}
            <div>
              <label className="block text-white/90 mb-3 font-medium">
                What is your role?
              </label>
              <div className="space-y-3">
                {['Dentist', 'Dental Hygienist', 'Office Manager', 'Other'].map((roleOption) => (
                  <label
                    key={roleOption}
                    className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <input
                      type="radio"
                      value={roleOption}
                      {...register('role', { required: 'Please select your role' })}
                      className="w-5 h-5 text-teal-500 focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-white">{roleOption}</span>
                  </label>
                ))}
              </div>
              {errors.role && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.role.message}
                </motion.p>
              )}
            </div>

            {/* Interests - Multiple Choice (Checkboxes) */}
            <div>
              <label className="block text-white/90 mb-3 font-medium">
                What features are you most interested in?
              </label>
              <div className="space-y-3">
                {[
                  'Patient Management',
                  'Appointment Scheduling',
                  'Billing & Invoicing',
                  'Treatment Planning',
                  'Analytics & Reports',
                ].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-3 cursor-pointer bg-white/10 backdrop-blur-sm p-4 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={interest}
                      {...register('interests')}
                      className="w-5 h-5 text-teal-500 rounded focus:ring-2 focus:ring-teal-300"
                    />
                    <span className="text-white">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience - Dropdown */}
            <div>
              <label htmlFor="experience" className="block text-white/90 mb-2 font-medium">
                Years of Experience in Dental Field
              </label>
              <select
                id="experience"
                {...register('experience', { required: 'Please select your experience level' })}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg"
              >
                <option value="">Select experience level</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
              {errors.experience && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-teal-100 mt-2 bg-red-400/40 px-3 py-1 rounded-lg"
                >
                  {errors.experience.message}
                </motion.p>
              )}
            </div>

            {/* Feedback - Text Area */}
            <div>
              <label htmlFor="feedback" className="block text-white/90 mb-2 font-medium">
                Additional Comments or Suggestions
              </label>
              <textarea
                id="feedback"
                {...register('feedback')}
                rows={4}
                className="w-full px-5 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-transparent transition-all shadow-lg resize-none"
                placeholder="Share any additional thoughts or suggestions..."
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white/90 mb-2 font-medium">
                Upload a File (Optional)
              </label>
              <div className="flex items-center">
                <input
                  id="attachment"
                  type="file"
                  {...register('attachment')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="attachment"
                  className="bg-teal-500 text-white py-4 px-6 rounded-xl font-bold shadow-xl relative overflow-hidden group cursor-pointer"
                >
                  <motion.div
                    className="absolute inset-0 bg-teal-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <Upload size={16} />
                    Upload File
                  </span>
                </label>
                {selectedFile && (
                  <div className="ml-4 flex items-center">
                    <span className="text-white/80">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
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
              <span className="relative z-10">Submit Information</span>
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
                <p className="font-medium">Thank you for submitting your information!</p>
                <p className="text-sm text-white/80">We'll be in touch soon.</p>
              </motion.div>
            )}
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}