import { BloodGroup, UrgencyLevel, RequestStatus } from '../types';

export const BLOOD_GROUPS: BloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const URGENCY_LEVELS: UrgencyLevel[] = [
  'Standard',
  'Urgent',
  'Critical',
];

export const REQUEST_STATUS: RequestStatus[] = [
  'Pending',
  'In Progress',
  'Fulfilled',
  'Cancelled',
];

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export interface DistrictInfo {
  nameEn: string;
  nameBn: string;
  division: string;
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  // Rangpur Division
  { nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur' },
  { nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur' },
  { nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur' },
  { nameEn: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur' },
  { nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur' },
  { nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur' },
  { nameEn: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur' },
  { nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur' },
  { nameEn: 'Uttar Dinajpur', nameBn: 'উত্তর দিনাজপুর', division: 'Rangpur' },

  // Dhaka Division
  { nameEn: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka' },
  { nameEn: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka' },
  { nameEn: 'Narayanganj', nameBn: 'নারায়াণগঞ্জ', division: 'Dhaka' },
  { nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka' },
  { nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka' },
  { nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka' },
  { nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', division: 'Dhaka' },
  { nameEn: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka' },
  { nameEn: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka' },
  { nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka' },
  { nameEn: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka' },
  { nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka' },
  { nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka' },

  // Chattogram Division
  { nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram' },
  { nameEn: 'Coxs Bazar', nameBn: 'কক্সবাজার', division: 'Chattogram' },
  { nameEn: 'Cumilla', nameBn: 'কুমিল্লা', division: 'Chattogram' },
  { nameEn: 'Feni', nameBn: 'ফেনী', division: 'Chattogram' },
  { nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram' },
  { nameEn: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chattogram' },
  { nameEn: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chattogram' },
  { nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chattogram' },
  { nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', division: 'Chattogram' },
  { nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', division: 'Chattogram' },
  { nameEn: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chattogram' },

  // Rajshahi Division
  { nameEn: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi' },
  { nameEn: 'Bogura', nameBn: 'বগুড়া', division: 'Rajshahi' },
  { nameEn: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi' },
  { nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi' },
  { nameEn: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi' },
  { nameEn: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi' },
  { nameEn: 'Chapai Nawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi' },
  { nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi' },

  // Khulna Division
  { nameEn: 'Khulna', nameBn: 'খুলনা', division: 'Khulna' },
  { nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna' },
  { nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna' },
  { nameEn: 'Magura', nameBn: 'মাগুরা', division: 'Khulna' },
  { nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna' },
  { nameEn: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna' },
  { nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna' },
  { nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna' },
  { nameEn: 'Narail', nameBn: 'নড়াইল', division: 'Khulna' },
  { nameEn: 'Jashore', nameBn: 'যশোর', division: 'Khulna' },

  // Barishal Division
  { nameEn: 'Barishal', nameBn: 'বরিশাল', division: 'Barishal' },
  { nameEn: 'Bhola', nameBn: 'ভোলা', division: 'Barishal' },
  { nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barishal' },
  { nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barishal' },
  { nameEn: 'Barguna', nameBn: 'বরগুনা', division: 'Barishal' },
  { nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', division: 'Barishal' },

  // Sylhet Division
  { nameEn: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet' },
  { nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet' },
  { nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet' },
  { nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet' },

  // Mymensingh Division
  { nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh' },
  { nameEn: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh' },
  { nameEn: 'Netrokona', nameBn: 'নেত্রকোণা', division: 'Mymensingh' },
  { nameEn: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh' },
];

export const DEMO_CREDENTIALS = [
  {
    role: 'admin' as const,
    title: 'Super Admin',
    email: 'rakibul@dropoflife.com',
    password: 'admin123',
    badge: 'Platform Governance',
    description: 'System-wide analytics, hospital verification, emergency escalation radar',
    color: 'from-rose-900 to-rose-700 text-rose-100 border-rose-500/40',
  },
  {
    role: 'donor' as const,
    title: 'Life Saver Donor',
    email: 'rakibulhasan@gmail.com',
    password: '123456',
    badge: 'Donor / Citizen',
    description: 'Availability beacon, donor profile, emergency request tracking, digital card',
    color: 'from-red-600 to-rose-500 text-white border-red-400/40',
  },
  {
    role: 'provider' as const,
    title: 'Blood Bank / Hospital',
    email: 'hospital@dropoflife.org',
    password: '123456',
    badge: 'Healthcare Provider',
    description: 'Real-time blood stock inventory, verified alerts, blood donation camps',
    color: 'from-cyan-900 to-teal-800 text-cyan-100 border-cyan-500/40',
  },
];

// Blood compatibility matrix data:
// Who can give blood to whom, and who can receive blood from whom
export const BLOOD_COMPATIBILITY = {
  'O-': {
    giveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor!
    receiveFrom: ['O-'],
    summary: 'Universal Red Blood Cell Donor! Critical for all emergency trauma patients.',
  },
  'O+': {
    giveTo: ['O+', 'A+', 'B+', 'AB+'],
    receiveFrom: ['O+', 'O-'],
    summary: 'Most requested blood group. Can donate to all positive blood types.',
  },
  'A-': {
    giveTo: ['A-', 'A+', 'AB-', 'AB+'],
    receiveFrom: ['A-', 'O-'],
    summary: 'Can donate red blood cells to A and AB types (both positive and negative).',
  },
  'A+': {
    giveTo: ['A+', 'AB+'],
    receiveFrom: ['A+', 'A-', 'O+', 'O-'],
    summary: 'One of the most common blood types; can receive from 4 different groups.',
  },
  'B-': {
    giveTo: ['B-', 'B+', 'AB-', 'AB+'],
    receiveFrom: ['B-', 'O-'],
    summary: 'Relatively rare blood group; crucial for B and AB recipients.',
  },
  'B+': {
    giveTo: ['B+', 'AB+'],
    receiveFrom: ['B+', 'B-', 'O+', 'O-'],
    summary: 'High demand in South Asia; can donate to B+ and AB+ recipients.',
  },
  'AB-': {
    giveTo: ['AB-', 'AB+'],
    receiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    summary: 'Rarest blood group; universal plasma donor for medical emergencies.',
  },
  'AB+': {
    giveTo: ['AB+'],
    receiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Universal recipient!
    summary: 'Universal Red Blood Cell Recipient! Can receive blood from any blood group.',
  },
};
