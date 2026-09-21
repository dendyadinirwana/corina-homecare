import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Review, ReviewStoreState } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    patientName: 'Siti Rahmawati',
    initials: 'SR',
    avatarColor: '#0A4D4A',
    avatarBg: '#E6F4F1',
    verified: true,
    date: '2 hari lalu',
    createdAt: '2024-06-23T10:00:00.000Z',
    rating: 5,
    content:
      'Pelayanan Ners Corina luar biasa sabar dan telaten merawat ibu paska stroke. Tekanan darah dan gula darah terpantau sangat rapi, penjelasan medisnya pun mudah dipahami.',
    category: 'Kunjungan Rumah',
    tags: ['Ramah & Empatik', 'Tepat Waktu'],
    likes: 14,
    helpfulCount: 14,
    isLiked: false,
    aspectRatings: {
      punctuality: 5,
      empathy: 5,
      medicalExplanation: 5,
    },
  },
  {
    id: 'rev-2',
    patientName: 'Bambang Sudirgo',
    initials: 'BS',
    avatarColor: '#B45309',
    avatarBg: '#FEF3C7',
    verified: true,
    date: '1 minggu lalu',
    createdAt: '2024-06-18T14:30:00.000Z',
    rating: 5,
    content:
      'Perawatan luka dekubitus sangat higienis dan tidak sakit. Ners Corina sangat menghormati lansia dan membuat ibu merasa tenang dan nyaman saat dikunjungi.',
    category: 'Rawat Lansia',
    tags: ['Perawatan Higienis', 'Telaten'],
    likes: 9,
    helpfulCount: 9,
    isLiked: false,
    aspectRatings: {
      punctuality: 5,
      empathy: 5,
      hygiene: 5,
    },
  },
  {
    id: 'rev-3',
    patientName: 'dr. Hendra Wijaya',
    initials: 'HW',
    avatarColor: '#6D28D9',
    avatarBg: '#EDE9FE',
    verified: true,
    date: '2 minggu lalu',
    createdAt: '2024-06-11T09:15:00.000Z',
    rating: 5,
    content:
      'Pengambilan sampel darah di rumah sangat cepat, steril, dan hasil tes gula darah & kolesterol dijelaskan secara komprehensif. Pelayanan homecare standar rumah sakit!',
    category: 'Cek Lab',
    tags: ['Hasil Cepat', 'Sangat Steril'],
    likes: 7,
    helpfulCount: 7,
    isLiked: false,
    aspectRatings: {
      punctuality: 5,
      medicalExplanation: 5,
      hygiene: 5,
    },
  },
];

const getSafeStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

function generateInitials(name: string): string {
  const clean = name.replace(/^(dr\.|drg\.|ners)\s+/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const useReviewStore = create<ReviewStoreState>()(
  persist(
    (set) => ({
      reviews: [...INITIAL_REVIEWS],

      addReview: (newReviewData) =>
        set((state) => {
          const rawName = newReviewData.patientName || 'Pasien Anonim';
          const isAnon = Boolean(newReviewData.isAnonymous);
          const displayName = isAnon ? 'Pasien Anonim' : rawName;
          const initials = newReviewData.initials || (isAnon ? 'PA' : generateInitials(rawName));

          const newReview: Review = {
            id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            patientName: displayName,
            initials,
            avatarColor: '#1E3322',
            avatarBg: '#E8F8EE',
            verified: newReviewData.verified ?? true,
            date: newReviewData.date || 'Baru saja',
            createdAt: new Date().toISOString(),
            rating: newReviewData.rating ?? 5,
            content: newReviewData.content || '',
            category: newReviewData.category || 'Kunjungan Rumah',
            tags: newReviewData.tags || [],
            likes: typeof (newReviewData as any).likes === 'number' ? (newReviewData as any).likes : 0,
            helpfulCount:
              typeof (newReviewData as any).helpfulCount === 'number'
                ? (newReviewData as any).helpfulCount
                : typeof (newReviewData as any).likes === 'number'
                ? (newReviewData as any).likes
                : 0,
            isLiked: false,
            isAnonymous: isAnon,
            aspectRatings: newReviewData.aspectRatings,
          };

          return {
            reviews: [newReview, ...state.reviews],
          };
        }),

      likeReview: (id: string) =>
        set((state) => ({
          reviews: state.reviews.map((review) => {
            if (review.id === id) {
              const currentlyLiked = Boolean(review.isLiked);
              const nextLiked = !currentlyLiked;
              const delta = nextLiked ? 1 : -1;
              const nextLikes = Math.max(0, (review.likes || 0) + delta);
              return {
                ...review,
                likes: nextLikes,
                helpfulCount: nextLikes,
                isLiked: nextLiked,
              };
            }
            return review;
          }),
        })),

      resetReviews: () =>
        set({
          reviews: [...INITIAL_REVIEWS],
        }),
    }),
    {
      name: 'homecare-review-storage',
      storage: createJSONStorage(getSafeStorage),
    }
  )
);
