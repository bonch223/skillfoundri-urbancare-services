export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  city: string;
  province: string;
  country: string;
  latitude?: number;
  longitude?: number;
  userType: 'individual' | 'small_business';
  isVerified: boolean;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  preferredLanguage: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType?: string;
  businessDescription?: string;
  businessRegistrationNumber?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  websiteUrl?: string;
  facebookPage?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
  isVerified: boolean;
  verificationDocuments?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  bio?: string;
  yearsOfExperience: number;
  hourlyRate?: number;
  skills: string[];
  serviceCategories: string[];
  portfolioImages: string[];
  portfolioDescription?: string;
  isAvailable: boolean;
  workingHours: Record<string, { start: string; end: string; available: boolean }>;
  maxDistanceKm: number;
  totalJobsCompleted: number;
  averageRating: number;
  totalReviews: number;
  responseTimeMinutes: number;
  completionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  isVerified: boolean;
  verificationLevel: 'basic' | 'verified' | 'premium';
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  insuranceVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  taskType: 'physical' | 'virtual' | 'hybrid';
  budget: number;
  budgetType: 'fixed' | 'hourly' | 'negotiable';
  commissionRate: number;
  locationAddress?: string;
  latitude?: number;
  longitude?: number;
  isRemote: boolean;
  preferredStartDate?: Date;
  preferredStartTime?: string;
  estimatedDurationHours?: number;
  urgency: 'urgent' | 'soon' | 'flexible';
  skillsRequired: string[];
  experienceLevel: 'any' | 'beginner' | 'intermediate' | 'expert';
  teamSizeNeeded: number;
  specialRequirements?: string;
  attachmentUrls: string[];
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedProviderId?: string;
  assignedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  viewsCount: number;
  bidsCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Bid {
  id: string;
  taskId: string;
  providerId: string;
  bidType: 'accept_budget' | 'custom_quote';
  amount: number;
  message: string;
  estimatedCompletionTime?: string;
  includesMaterials: boolean;
  warrantyOffered?: string;
  additionalServices: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  responseMessage?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Payment {
  id: string;
  taskId: string;
  clientId: string;
  providerId: string;
  amount: number;
  commissionAmount: number;
  providerAmount: number;
  paymentMethod: 'gcash' | 'gotyme' | 'bpi' | 'cash';
  paymentReference?: string;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'failed';
  heldAt?: Date;
  releaseScheduledAt?: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  title?: string;
  comment?: string;
  reviewType: 'client_to_provider' | 'provider_to_client';
  communicationRating?: number;
  qualityRating?: number;
  timelinessRating?: number;
  valueRating?: number;
  isPublic: boolean;
  isFlagged: boolean;
  flaggedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  taskId?: string;
  senderId: string;
  recipientId: string;
  messageType: 'text' | 'image' | 'document' | 'system';
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: Date;
  isSystemMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  relatedTaskId?: string;
  relatedUserId?: string;
  isPushSent: boolean;
  isEmailSent: boolean;
  isSmsSent: boolean;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode: number;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface TaskFilters extends PaginationParams {
  category?: string;
  minBudget?: number;
  maxBudget?: number;
  urgency?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  status?: string;
  isRemote?: boolean;
}

