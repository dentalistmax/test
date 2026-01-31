import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {Youtube, Music, Facebook, Instagram, Linkedin, Globe, Heart, Info } from 'lucide-react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  User, 
  GraduationCap, 
  Stethoscope, 
  UserCheck, 
  BookOpen, 
  Briefcase,  
  Wrench, 
  Store as StoreIcon, 
  Building2, 
  Users,
  Upload,
  X,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

type RoleType = 'Patient' | 'Student' | 'Dentist' | 'Mentor' | 'Instructor' | 'Consultant' | 'Nurse' | 'Technician' | 'Store' | 'Company' | 'Recruiter';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  country?: string;
  governorate?: string;
  yearsOfExperience?: string;
  cv?: FileList;
  academicYear?: string;
  university?: string;
  specialty?: string;
  locationPreferred?: string;
}

const roleCategories = [
  { name: 'Patient' as RoleType, icon: User, color: 'from-cyan-500 to-teal-600' },
  { name: 'Student' as RoleType, icon: GraduationCap, color: 'from-blue-500 to-cyan-600' },
  { name: 'Dentist' as RoleType, icon: Stethoscope, color: 'from-teal-500 to-emerald-600' },
  { name: 'Mentor' as RoleType, icon: UserCheck, color: 'from-emerald-500 to-teal-600' },
  { name: 'Instructor' as RoleType, icon: BookOpen, color: 'from-cyan-500 to-blue-600' },
  { name: 'Consultant' as RoleType, icon: Briefcase, color: 'from-teal-500 to-cyan-600' },
  { name: 'Nurse' as RoleType, icon: Heart, color: 'from-pink-500 to-rose-600' },
  { name: 'Technician' as RoleType, icon: Wrench, color: 'from-slate-500 to-gray-600' },
  { name: 'Store' as RoleType, icon: StoreIcon, color: 'from-orange-500 to-amber-600' },
  { name: 'Company' as RoleType, icon: Building2, color: 'from-indigo-500 to-blue-600' },
  { name: 'Recruiter' as RoleType, icon: Users, color: 'from-purple-500 to-indigo-600' },
];

export default function RegistrationForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedRole(null);
    setSelectedFile(null);
    setSubmitError(null);
    reset();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('cv') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedRole) {
      setSubmitError('Please select a role');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);
    
    try {
      const collectionName = `registrations_${selectedRole}`;
      
      // Create object with only defined values (Firebase doesn't accept undefined)
      const dataToSave: any = {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        role: selectedRole,
        createdAt: serverTimestamp(),
      };
      
      // Add optional fields only if they have values
      if (data.country) dataToSave.country = data.country;
      if (data.governorate) dataToSave.governorate = data.governorate;
      if (data.yearsOfExperience) dataToSave.yearsOfExperience = data.yearsOfExperience;
      if (data.academicYear) dataToSave.academicYear = data.academicYear;
      if (data.university) dataToSave.university = data.university;
      if (data.specialty) dataToSave.specialty = data.specialty;
      if (data.locationPreferred) dataToSave.locationPreferred = data.locationPreferred;
      
      await addDoc(collection(db, collectionName), dataToSave);
      
      console.log('Registration submitted:', { role: selectedRole, ...data });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        handleBack();
      }, 3000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      setSubmitError('Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getFormFields = () => {
    switch (selectedRole) {
      case 'Patient':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Country */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="country" className="block text-slate-700 mb-2 font-medium">
                Country
              </label>
              <input
                id="country"
                type="text"
                {...register('country', { required: 'Country is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your country"
              />
              {errors.country && (
                <p className="text-red-500 mt-1 text-sm">{errors.country.message}</p>
              )}
            </motion.div>

            {/* Governorate */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="governorate" className="block text-slate-700 mb-2 font-medium">
                Governorate
              </label>
              <input
                id="governorate"
                type="text"
                {...register('governorate', { required: 'Governorate is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your governorate"
              />
              {errors.governorate && (
                <p className="text-red-500 mt-1 text-sm">{errors.governorate.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload Resume (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Student':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Academic Year */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="academicYear" className="block text-slate-700 mb-2 font-medium">
                Academic Year
              </label>
              <div className="relative">
                <select
                  id="academicYear"
                  {...register('academicYear', { required: 'Academic Year is required' })}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border-2 border-slate-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                >
                  <option value="">Select academic year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              {errors.academicYear && (
                <p className="text-red-500 mt-1 text-sm">{errors.academicYear.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload Resume (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Dentist':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="yearsOfExperience" className="block text-slate-700 mb-2 font-medium">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  id="yearsOfExperience"
                  {...register('yearsOfExperience', { required: 'Please select your experience' })}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border-2 border-slate-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                >
                  <option value="">Select years of experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              {errors.yearsOfExperience && (
                <p className="text-red-500 mt-1 text-sm">{errors.yearsOfExperience.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Mentor':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Location Preferred */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="locationPreferred" className="block text-slate-700 mb-2 font-medium">
                Location Preferred
              </label>
              <input
                id="locationPreferred"
                type="text"
                {...register('locationPreferred', { required: 'Location Preferred is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your preferred location"
              />
              {errors.locationPreferred && (
                <p className="text-red-500 mt-1 text-sm">{errors.locationPreferred.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Instructor':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="yearsOfExperience" className="block text-slate-700 mb-2 font-medium">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  id="yearsOfExperience"
                  {...register('yearsOfExperience', { required: 'Please select your experience' })}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border-2 border-slate-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                >
                  <option value="">Select years of experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              {errors.yearsOfExperience && (
                <p className="text-red-500 mt-1 text-sm">{errors.yearsOfExperience.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Consultant':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="yearsOfExperience" className="block text-slate-700 mb-2 font-medium">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  id="yearsOfExperience"
                  {...register('yearsOfExperience', { required: 'Please select your experience' })}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border-2 border-slate-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                >
                  <option value="">Select years of experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              {errors.yearsOfExperience && (
                <p className="text-red-500 mt-1 text-sm">{errors.yearsOfExperience.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Nurse':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="yearsOfExperience" className="block text-slate-700 mb-2 font-medium">
                Years of Experience
              </label>
              <div className="relative">
                <select
                  id="yearsOfExperience"
                  {...register('yearsOfExperience', { required: 'Please select your experience' })}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-white to-slate-50 border-2 border-slate-300 hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm hover:shadow-md cursor-pointer appearance-none pr-10"
                >
                  <option value="">Select years of experience</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11-15">11-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
              {errors.yearsOfExperience && (
                <p className="text-red-500 mt-1 text-sm">{errors.yearsOfExperience.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );

      case 'Technician':
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* University */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="university" className="block text-slate-700 mb-2 font-medium">
                University
              </label>
              <input
                id="university"
                type="text"
                {...register('university', { required: 'University is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your university"
              />
              {errors.university && (
                <p className="text-red-500 mt-1 text-sm">{errors.university.message}</p>
              )}
            </motion.div>

            {/* Specialty */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="specialty" className="block text-slate-700 mb-2 font-medium">
                Specialty
              </label>
              <input
                id="specialty"
                type="text"
                {...register('specialty', { required: 'Specialty is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your specialty"
              />
              {errors.specialty && (
                <p className="text-red-500 mt-1 text-sm">{errors.specialty.message}</p>
              )}
            </motion.div>

            {/* Location Preferred */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="locationPreferred" className="block text-slate-700 mb-2 font-medium">
                Location Preferred
              </label>
              <input
                id="locationPreferred"
                type="text"
                {...register('locationPreferred', { required: 'Location Preferred is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your preferred location"
              />
              {errors.locationPreferred && (
                <p className="text-red-500 mt-1 text-sm">{errors.locationPreferred.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* CV Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload CV
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );


      default:
        // Default form for other roles (similar to Patient)
        return (
          <>
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="mobile" className="block text-slate-700 mb-2 font-medium">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                {...register('mobile', { required: 'Mobile number is required' })}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Enter your mobile number"
              />
              {errors.mobile && (
                <p className="text-red-500 mt-1 text-sm">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-slate-700 mb-2 font-medium">
                Upload Resume (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register('cv')}
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="cv"
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Upload size={18} />
                  Choose File
                </label>
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                    <span className="text-slate-700 text-sm">{selectedFile.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={removeFile}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 via-teal-600 to-teal-700 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
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

      {/* Header */}
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

      {/* Main Content */}
      <div className="flex items-center justify-center p-8 relative z-10">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl"
            >
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-white mb-3">Select Your Role</h1>
                <p className="text-white/90 text-lg">Choose the category that best describes you</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roleCategories.map((role, index) => (
                  <motion.button
                    key={role.name}
                    onClick={() => handleRoleSelect(role.name)}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all text-center border-2 border-white/20 hover:border-white/40 group`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md mx-auto`}>
                      <role.icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-white mb-1">{role.name}</h3>
                    <p className="text-white/70 text-sm">Register as {role.name.toLowerCase()}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-200">
                {/* Back Button */}
                <motion.button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-slate-600 hover:text-teal-600 mb-6 transition-colors"
                  whileHover={{ x: -5 }}
                >
                  <ArrowLeft size={20} />
                  <span>Change Role</span>
                </motion.button>

                {/* Header */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${roleCategories.find(r => r.name === selectedRole)?.color} flex items-center justify-center`}>
                      {(() => {
                        const RoleIcon = roleCategories.find(r => r.name === selectedRole)?.icon || User;
                        return <RoleIcon className="text-white" size={28} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-slate-800">{selectedRole} Registration</h2>
                      <p className="text-slate-500">Complete your profile information</p>
                    </div>
                  </div>
                  <div className="h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full w-20" />
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {getFormFields()}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-medium shadow-md hover:shadow-xl relative overflow-hidden group mt-8 transition-all ${
                      isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600'
                    } text-white`}
                    whileHover={!isLoading ? { scale: 1.02 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-500"
                      initial={{ x: "-100%" }}
                      whileHover={!isLoading ? { x: 0 } : {}}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Registration
                          <CheckCircle2 size={20} />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-6 bg-red-50 border-2 border-red-300 rounded-xl p-6 text-center"
                  >
                    <p className="font-medium text-red-800">{submitError}</p>
                  </motion.div>
                )}

                {/* Success Message */}
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-xl p-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-block text-5xl mb-2"
                    >
                      <CheckCircle2 className="text-teal-600" size={48} />
                    </motion.div>
                    <p className="font-medium text-slate-800 text-lg">Registration Successful!</p>
                    <p className="text-sm text-slate-600 mt-1">Welcome to DentlistMax</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

<div className="flex items-center justify-center gap-6 mb-8 mt-20">
  {[
    { icon: <Youtube size={22} />, href: "https://youtube.com/@dentlistmax?si=xCIfR5Yo82spiRN_", color: "hover:text-[#FF0000]" },
    { icon: <Instagram size={20} />, href: "https://www.instagram.com/dentlistmax?igsh=a3ZpNW4wdDdsZ3Bx&utm_source=qr", color: "hover:text-[#E1306C]" },
    // أيقونة تيك توك باستخدام Music كبديل ذكي أو SVG مخصص
    { icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>),href: "https://www.tiktok.com/@dentlistmax_?_r=1&_t=ZS-93Qgl0L5xDE", color: "hover:shadow-[...rgba(156,163,175,0.3)]" }, 
    { icon: <Facebook size={20} strokeWidth={1.5}/>, href: "https://www.facebook.com/share/1AaEYM1Xtr/?mibextid=wwXIfr", color: "hover:shadow-[...rgba(156,163,175,0.3)]" }, 
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
        © 2026 <span className="font-bold">Future Coders</span>
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
    
  );
}