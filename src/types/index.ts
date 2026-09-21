export type ServiceType = 'homecare' | 'teleconsultation' | string;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BookingDraft {
  date: string;
  time: string;
  serviceType: ServiceType;
  patientName: string;
  patientPhone: string;
  address: string;
  landmark: string;
  coordinates: Coordinates;
  complaint: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  sip: string;
  experience: string;
  education: string;
  rating: number;
  reviewCount: number;
  patientCount?: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string;
  consultationFee: number;
  availableToday?: boolean;
  arrivalTimeEstimate?: string;
  bio?: string;
}

export interface ConfirmedBooking extends BookingDraft {
  id: string;
  createdAt: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  doctor?: Partial<DoctorProfile> | { name: string; title?: string };
}

// Alias for flexibility in case other components import Booking
export type Booking = ConfirmedBooking;

export interface AspectRatings {
  punctuality?: number;
  empathy?: number;
  medicalExplanation?: number;
  hygiene?: number;
  [key: string]: number | undefined;
}

export interface Review {
  id: string;
  patientName: string;
  initials?: string;
  avatarColor?: string;
  avatarBg?: string;
  verified: boolean;
  date: string;
  createdAt?: string;
  rating: number;
  content: string;
  category?: string;
  tags?: string[];
  likes: number;
  helpfulCount?: number;
  isLiked?: boolean;
  isAnonymous?: boolean;
  aspectRatings?: AspectRatings;
}

export interface BookingStoreState {
  draft: BookingDraft;
  confirmedBooking: ConfirmedBooking | null;
  setDraft: (partial: Partial<BookingDraft>) => void;
  confirmBooking: () => ConfirmedBooking;
  resetDraft: () => void;
  setConfirmedBooking: (booking: ConfirmedBooking | null) => void;
}

export interface ReviewStoreState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'> | Partial<Review>) => void;
  likeReview: (id: string) => void;
  resetReviews: () => void;
}
