export type UserRole = 'donor' | 'provider' | 'admin';

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type UrgencyLevel = 'Routine' | 'Standard' | 'Urgent' | 'Critical';

export type RequestStatus =
  | 'Pending'
  | 'In Progress'
  | 'Fulfilled'
  | 'Cancelled';

export type ComponentType =
  | 'Whole Blood'
  | 'Red Blood Cells'
  | 'Platelets'
  | 'Plasma';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  bloodGroup?: BloodGroup;
  gender?: string;
  isAvailable: boolean;
  lastDonationDate?: string;
  division?: string;
  district?: string;
  upazila?: string;
  note?: string;
  rating?: number;
  reviewCount?: number;
  isSuspended?: boolean;
  suspendedReason?: string;
  organizationName?: string;
  licenseNumber?: string;
  isVerified: boolean;
  totalDonations: number;
  avatarUrl?: string;
  createdAt?: string;
  lastRequestedAt?: string | null;
}

export interface DonorReview {
  _id: string;
  donorId: string;
  donorName?: string;
  reviewerName: string;
  reviewerContact?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ComplaintReport {
  _id: string;
  type: 'misbehavior' | 'website_issue';
  category: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reporterName: string;
  reporterContact?: string;
  description: string;
  status: 'Pending' | 'Investigating' | 'Resolved' | 'Dismissed';
  adminNotes?: string;
  createdAt: string;
}


export interface BloodRequest {
  _id: string;
  id?: string;
  requesterId?: string;
  requesterName: string;
  requesterPhone?: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  unitsRequired?: number;
  urgencyLevel: UrgencyLevel;
  urgency?: UrgencyLevel;
  hospitalName: string;
  hospitalAddress: string;
  location?: string;
  district: string;
  division?: string;
  reason: string;
  notes?: string;
  contactNumber: string;
  contactPhone?: string;
  requiredDate: string;
  neededDate?: string;
  status: RequestStatus;
  matchedDonorsCount: number;
  assignedDonors: string[];
  targetDonorId?: string;
  targetDonorAltId?: string;
  targetDonorEmail?: string;
  targetDonorPhone?: string;
  targetDonorName?: string;
  createdAt: string;
}

export interface InventoryItem {
  _id: string;
  providerId: string;
  providerName: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  unitsInStock: number;
  criticalThreshold: number;
  lastUpdated: string;
}

export interface BloodCamp {
  _id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  venueAddress: string;
  district: string;
  division: string;
  startDate: string;
  endDate: string;
  targetUnits: number;
  collectedUnits: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  contactPhone: string;
  volunteersCount: number;
  registeredVolunteers: string[];
}

export interface PlatformAnalytics {
  totalDonors: number;
  availableDonors: number;
  totalProviders: number;
  activeRequests: number;
  fulfilledRequests: number;
  totalUnitsInStock: number;
  totalLivesSaved: number;
  totalCampsOrganized: number;
  recentRequests: BloodRequest[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
