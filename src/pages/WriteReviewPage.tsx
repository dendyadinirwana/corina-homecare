import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, HelpCircle, CheckCircle2 } from 'lucide-react';
import { MobileFrame } from '../components/layout/MobileFrame';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { IosSwitch } from '../components/ui/IosSwitch';
import { useReviewStore } from '../store/reviewStore';
import { useBookingStore } from '../store/bookingStore';

export const WriteReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { addReview } = useReviewStore();
  const draftPatient = useBookingStore((state) => state.draft?.patientName);

  // Form states
  const [mainRating, setMainRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [hygieneRating, setHygieneRating] = useState<number>(5);
  const [friendlinessRating, setFriendlinessRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  // Dynamic feedback copy based on rating
  const getFeedbackBadge = (score: number) => {
    switch (score) {
      case 5:
        return '5.0 • Sangat Puas & Profesional';
      case 4:
        return '4.0 • Puas & Memuaskan';
      case 3:
        return '3.0 • Cukup Baik';
      case 2:
        return '2.0 • Kurang Memuaskan';
      case 1:
        return '1.0 • Perlu Peningkatan';
      default:
        return `${score.toFixed(1)} • Berikan Penilaian`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPatientName = draftPatient
      ? draftPatient.replace(/\s*\(\d+\s*thn\)/i, '').trim()
      : 'Budi Santoso';

    addReview({
      patientName: isAnonymous ? 'Pasien Anonim' : cleanPatientName,
      initials: isAnonymous ? 'PA' : undefined,
      isAnonymous,
      rating: mainRating,
      content:
        comment.trim() ||
        'Pelayanan sangat memuaskan, ramah, dan profesional dalam mendampingi pasien di rumah.',
      category: 'Kunjungan Rumah',
      tags: ['Pelayanan Ramah', 'Tepat Waktu', 'Sangat Higienis'],
      aspectRatings: {
        punctuality: punctualityRating,
        hygiene: hygieneRating,
        empathy: friendlinessRating,
        medicalExplanation: friendlinessRating,
      },
      date: 'Baru saja',
      verified: true,
    });

    navigate('/ulasan');
  };

  return (
    <MobileFrame hideNav={true} contentClassName="p-0">
      {/* 1. Modal Sheet Header */}
      <div className="w-full h-[56px] px-4 flex items-center justify-between border-b border-border-hairline bg-surface sticky top-0 z-20">
        <button
          type="button"
          aria-label="Tutup"
          data-testid="btn-close-modal"
          onClick={() => navigate('/ulasan')}
          className="w-11 h-11 min-w-[44px] min-h-[44px] -ml-2 rounded-full inline-flex items-center justify-center text-ink-primary hover:bg-black/5 active:scale-95 btn-tactile transition-colors cursor-pointer"
        >
          <X className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1
          data-testid="modal-title"
          className="text-[16px] font-bold text-ink-primary tracking-tight text-center"
        >
          Tulis Ulasan Layanan
        </h1>

        <button
          type="button"
          data-testid="link-bantuan"
          onClick={() => alert('Pusat Bantuan Ulasan: Tim kami siap memverifikasi ulasan Anda.')}
          className="min-h-[44px] px-2 -mr-2 inline-flex items-center gap-1 text-xs font-semibold text-forest hover:underline btn-tactile cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Bantuan</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-28">
        {/* 2. Completed Visit Summary Card */}
        <Card
          data-testid="visit-summary-card"
          className="p-3.5 bg-card border border-border-hairline rounded-2xl flex items-center gap-3 shadow-2xs"
          radius="2xl"
        >
          <img
            src="/doctor-profile.jpg"
            alt="Corina Wulandari"
            className="w-12 h-12 rounded-full object-cover border border-border-hairline shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h2 className="text-xs font-bold text-ink-primary truncate">
                Corina Wulandari
              </h2>
              <span
                data-testid="badge-visit-completed"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E8F8EE] text-[#1E3322] border border-[#C5E9D1] text-[10px] font-bold shrink-0"
              >
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                <span>• Kunjungan Selesai</span>
              </span>
            </div>
            <p className="text-[11px] text-ink-muted truncate mt-0.5">
              Kunjungan Medis ke Rumah • 25 Juni 2024
            </p>
          </div>
        </Card>

        {/* 3. Main Question & 5 Big Stars */}
        <Card
          className="p-5 bg-card border border-border-hairline rounded-3xl text-center space-y-3 shadow-sm"
          radius="3xl"
        >
          <h2 className="text-sm font-bold text-ink-primary">
            Bagaimana pengalaman kunjungan Anda?
          </h2>

          <div className="flex justify-center py-1">
            <StarRating
              data-testid="main-star-rating"
              rating={mainRating}
              interactive={true}
              size="lg"
              onChange={(val) => setMainRating(val)}
            />
          </div>

          <div className="flex justify-center">
            <span
              data-testid="feedback-badge"
              className="inline-block px-3.5 py-1.5 rounded-full bg-[#E8F8EE] text-[#1E3322] border border-[#C5E9D1] text-xs font-bold tracking-tight shadow-2xs"
            >
              {getFeedbackBadge(mainRating)}
            </span>
          </div>
        </Card>

        {/* 4. 3 Sub-Aspect Ratings */}
        <Card
          className="p-4 bg-card border border-border-hairline rounded-2xl space-y-3.5 shadow-2xs"
          radius="2xl"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Detail Penilaian Layanan
          </h3>

          <div className="space-y-3 divide-y divide-border-hairline">
            {/* Punctuality */}
            <div
              data-testid="sub-rating-punctuality"
              className="flex items-center justify-between pt-1 first:pt-0"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-ink-primary block">
                  Ketepatan Waktu Kedatangan
                </span>
                <span className="text-[10px] text-ink-muted block">
                  Kesesuaian jadwal janji temu
                </span>
              </div>
              <StarRating
                rating={punctualityRating}
                interactive={true}
                size="sm"
                onChange={(v) => setPunctualityRating(v)}
              />
            </div>

            {/* Hygiene */}
            <div
              data-testid="sub-rating-hygiene"
              className="flex items-center justify-between pt-2.5"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-ink-primary block">
                  Higienitas & Kesiapan Alat Medis
                </span>
                <span className="text-[10px] text-ink-muted block">
                  Sterilitas peralatan & APD
                </span>
              </div>
              <StarRating
                rating={hygieneRating}
                interactive={true}
                size="sm"
                onChange={(v) => setHygieneRating(v)}
              />
            </div>

            {/* Friendliness */}
            <div
              data-testid="sub-rating-friendliness"
              className="flex items-center justify-between pt-2.5"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-ink-primary block">
                  Keramahan & Penjelasan Dokter
                </span>
                <span className="text-[10px] text-ink-muted block">
                  Empati dan kejelasan diagnosa
                </span>
              </div>
              <StarRating
                rating={friendlinessRating}
                interactive={true}
                size="sm"
                onChange={(v) => setFriendlinessRating(v)}
              />
            </div>
          </div>
        </Card>

        {/* 5. Experience Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <label
              htmlFor="review-comment"
              className="text-xs font-bold text-ink-primary"
            >
              Tuliskan Ulasan Pengalaman Anda
            </label>
            <span
              data-testid="char-counter"
              className="text-[11px] font-semibold text-ink-muted"
            >
              {comment.length}/500
            </span>
          </div>

          <textarea
            id="review-comment"
            data-testid="textarea-review-comment"
            rows={4}
            maxLength={500}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan bagaimana pelayanan Ners Corina saat mengunjungi rumah Anda..."
            className="w-full min-h-[100px] p-3.5 text-xs text-ink-primary bg-card border border-border-hairline rounded-2xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest/40 transition-all resize-none placeholder:text-ink-muted leading-relaxed"
          />
        </div>

        {/* 6. Anonymous Patient iOS Switch Card */}
        <Card
          className="p-4 bg-card border border-border-hairline rounded-2xl shadow-2xs"
          radius="2xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5 flex-1 pr-2">
              <span className="text-xs font-bold text-ink-primary block">
                Tampilkan sebagai Pasien Anonim
              </span>
              <p className="text-[11px] text-ink-secondary leading-tight">
                Nama disamarkan menjadi inisial (mis. J.D.) demi privasi Anda.
              </p>
            </div>
            <IosSwitch
              data-testid="switch-anonymous"
              aria-label="Tampilkan sebagai Pasien Anonim"
              checked={isAnonymous}
              onChange={(checked) => setIsAnonymous(checked)}
            />
          </div>
        </Card>

        {/* 7. Sticky Bottom CTA Button */}
        <div
          data-testid="sticky-submit-footer"
          className="fixed bottom-0 inset-x-0 sm:absolute bg-surface/95 backdrop-blur-md border-t border-border-hairline p-4 z-20 flex items-center justify-center shadow-sm"
        >
          <Button
            type="submit"
            variant="lime"
            size="lg"
            fullWidth
            data-testid="btn-submit-review"
            className="font-bold text-sm shadow-md min-h-[44px]"
          >
            Kirim Ulasan Sekarang
          </Button>
        </div>
      </form>
    </MobileFrame>
  );
};

export default WriteReviewPage;
