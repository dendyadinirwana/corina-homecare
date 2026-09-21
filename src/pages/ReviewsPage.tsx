import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Heart,
  Activity,
  SlidersHorizontal,
  PenLine,
  Check,
  ChevronDown,
  ThumbsUp,
} from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { useReviewStore } from '../store/reviewStore';

const CATEGORIES = [
  { id: 'semua', label: 'Semua' },
  { id: 'kunjungan-rumah', label: 'Kunjungan Rumah' },
  { id: 'rawat-lansia', label: 'Rawat Lansia' },
  { id: 'cek-lab', label: 'Cek Lab' },
] as const;

export const ReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reviews, likeReview } = useReviewStore();
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<'terbaru' | 'tertinggi'>('terbaru');

  // Filter reviews based on category
  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    if (activeCategory !== 'semua') {
      const targetCategory = CATEGORIES.find((c) => c.id === activeCategory)?.label;
      if (targetCategory) {
        result = result.filter(
          (r) => r.category?.toLowerCase() === targetCategory.toLowerCase()
        );
      }
    }
    if (sortBy === 'tertinggi') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [reviews, activeCategory, sortBy]);

  // Rating breakdown stats for 128 total reviews
  const ratingDistribution = [
    { stars: 5, percentage: 92, count: 118 },
    { stars: 4, percentage: 6, count: 8 },
    { stars: 3, percentage: 2, count: 2 },
    { stars: 2, percentage: 0, count: 0 },
    { stars: 1, percentage: 0, count: 0 },
  ];

  return (
    <MobileFrame
      title="Ulasan Pasien"
      showBack={true}
      onBack={() => navigate('/profil')}
      rightAction={
        <button
          type="button"
          aria-label="Filter Ulasan"
          data-testid="btn-filter-icon"
          className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-ink-primary hover:bg-black/5 active:scale-95 btn-tactile transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5 text-ink-primary" />
        </button>
      }
      contentClassName="p-4 space-y-4 pb-24"
    >
      {/* 1. Aggregate Rating Card */}
      <Card
        data-testid="aggregate-rating-card"
        className="p-5 bg-card border border-border-hairline rounded-3xl space-y-4 shadow-sm"
        radius="3xl"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span
                data-testid="aggregate-score"
                className="text-4xl font-extrabold text-ink-primary tracking-tight"
              >
                4.9
              </span>
              <span className="text-sm font-semibold text-ink-muted">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <StarRating rating={4.9} size="sm" interactive={false} />
            </div>
            <p
              data-testid="total-reviews-count"
              className="text-xs font-medium text-ink-secondary pt-0.5"
            >
              128 Ulasan
            </p>
          </div>

          <div
            data-testid="satisfaction-badge"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#E8F8EE] text-[#1E3322] border border-[#C5E9D1] text-xs font-bold tracking-tight shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>✓ 99% Puas</span>
          </div>
        </div>

        {/* Rating Breakdown Progress Bars (5★ to 1★) */}
        <div data-testid="rating-bars" className="space-y-1.5 pt-1 border-t border-border-hairline">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 text-xs">
              <span className="w-5 text-right font-medium text-ink-secondary">
                {item.stars}★
              </span>
              <div className="flex-1 h-2 bg-border-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB800] rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right font-semibold text-ink-muted text-[11px]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. 3 Aspect Metric Cards */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-muted px-1">
          Aspek Penilaian
        </h2>
        <div className="grid grid-cols-3 gap-2.5">
          <Card
            data-testid="aspect-punctuality"
            className="p-3 min-h-[44px] text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1 shadow-2xs"
            radius="2xl"
          >
            <Clock className="w-4 h-4 text-forest mb-0.5" />
            <div className="text-[11px] font-semibold text-ink-secondary leading-tight text-center line-clamp-1">
              Ketepatan Waktu
            </div>
            <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
              <span>4.8</span>
              <span className="text-[#FFB800]">★</span>
            </div>
          </Card>

          <Card
            data-testid="aspect-empathy"
            className="p-3 min-h-[44px] text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1 shadow-2xs"
            radius="2xl"
          >
            <Heart className="w-4 h-4 text-forest mb-0.5" />
            <div className="text-[11px] font-semibold text-ink-secondary leading-tight text-center line-clamp-1">
              Sikap & Empati
            </div>
            <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
              <span>4.9</span>
              <span className="text-[#FFB800]">★</span>
            </div>
          </Card>

          <Card
            data-testid="aspect-explanation"
            className="p-3 min-h-[44px] text-center bg-card border border-border-hairline rounded-2xl flex flex-col items-center justify-center space-y-1 shadow-2xs"
            radius="2xl"
          >
            <Activity className="w-4 h-4 text-forest mb-0.5" />
            <div className="text-[11px] font-semibold text-ink-secondary leading-tight text-center line-clamp-1">
              Penjelasan Medis
            </div>
            <div className="text-sm font-bold text-ink-primary flex items-center justify-center gap-0.5">
              <span>4.9</span>
              <span className="text-[#FFB800]">★</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Filter Category Pills */}
      <div className="space-y-1.5 pt-1">
        <div
          data-testid="category-filter-pills"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                data-testid={`filter-pill-${category.id}`}
                onClick={() => setActiveCategory(category.id)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-quick btn-tactile cursor-pointer ${
                  isActive
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-card text-ink-secondary border border-border-hairline hover:bg-card-hover'
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Review Feed Header */}
      <div className="flex items-center justify-between pt-2 px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-ink-primary">
            Ulasan Terverifikasi
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-forest/10 text-forest text-[11px] font-bold">
            {filteredReviews.length}
          </span>
        </div>

        <div className="flex items-center gap-1 text-xs font-medium text-ink-secondary">
          <span>Urutkan:</span>
          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'terbaru' | 'tertinggi')}
              aria-label="Urutkan Ulasan"
              className="appearance-none bg-transparent pr-5 py-1 text-xs font-semibold text-ink-primary cursor-pointer focus:outline-none"
            >
              <option value="terbaru">Terbaru</option>
              <option value="tertinggi">Tertinggi</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-ink-secondary pointer-events-none absolute right-0" />
          </div>
        </div>
      </div>

      {/* 5. Review Feed Cards */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <Card className="p-8 text-center text-ink-secondary bg-card rounded-2xl">
            <p className="text-sm">Belum ada ulasan untuk kategori ini.</p>
          </Card>
        ) : (
          filteredReviews.map((review) => {
            const isLiked = Boolean(review.isLiked);
            const helpfulCount = review.helpfulCount ?? review.likes ?? 0;

            return (
              <Card
                key={review.id}
                data-testid="review-card"
                className="p-4 bg-card border border-border-hairline rounded-2xl space-y-3 shadow-2xs"
                radius="2xl"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Patient avatar initials */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs tracking-tight shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: review.avatarBg || '#E8F8EE',
                        color: review.avatarColor || '#1E3322',
                      }}
                    >
                      {review.initials || 'PA'}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-ink-primary leading-snug">
                          {review.patientName}
                        </span>
                        {review.verified && (
                          <span
                            title="Terverifikasi"
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#E8F8EE] text-[#1E3322] text-[10px] font-bold"
                          >
                            ✓ Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-muted">
                        {review.category || 'Kunjungan Rumah'} • {review.date}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <StarRating rating={review.rating} size="sm" interactive={false} />
                </div>

                {/* Review Text */}
                <p className="text-xs text-ink-primary leading-relaxed">
                  {review.content}
                </p>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {review.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-canvas text-ink-secondary text-[10px] font-medium border border-border-hairline"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Helpful Action Button */}
                <div className="flex items-center justify-between pt-1 border-t border-border-hairline">
                  <button
                    type="button"
                    data-testid={`btn-like-${review.id}`}
                    onClick={() => likeReview(review.id)}
                    className={`min-h-[44px] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold transition-colors btn-tactile cursor-pointer ${
                      isLiked
                        ? 'bg-[#E8F8EE] text-forest'
                        : 'text-ink-secondary hover:bg-black/5'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-forest text-forest' : 'text-ink-secondary'
                      }`}
                    />
                    <span>👍 Membantu ({helpfulCount})</span>
                  </button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* 6. Sticky Bottom Action Bar */}
      <div
        data-testid="sticky-reviews-footer"
        className="sticky bottom-0 inset-x-0 bg-surface/95 backdrop-blur-md border-t border-border-hairline p-4 z-20 flex items-center justify-center mt-auto shadow-sm -mx-4 -mb-4"
      >
        <Button
          variant="lime"
          size="lg"
          fullWidth
          data-testid="btn-write-review"
          className="font-bold text-sm shadow-md min-h-[44px] flex items-center justify-center gap-2"
          onClick={() => navigate('/ulasan/tulis')}
        >
          <PenLine className="w-4 h-4" />
          <span>Tulis Ulasan</span>
        </Button>
      </div>
    </MobileFrame>
  );
};

export default ReviewsPage;
