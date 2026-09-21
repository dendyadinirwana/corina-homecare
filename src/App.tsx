import { useState } from 'react';
import { Bell } from 'lucide-react';
import { MobileFrame } from './components/layout/MobileFrame';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Stepper } from './components/ui/Stepper';
import { IosSwitch } from './components/ui/IosSwitch';
import { StarRating } from './components/ui/StarRating';

export default function App() {
  const [currentStep] = useState(2);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [rating, setRating] = useState(5);

  return (
    <MobileFrame
      title="Personal Homecare"
      showBack={true}
      onBack={() => console.log('Back pressed')}
      rightAction={
        <button
          type="button"
          aria-label="Notifikasi"
          className="w-[44px] h-[44px] flex items-center justify-center text-ink-primary hover:text-ink-secondary btn-tactile rounded-full"
        >
          <Bell className="w-5 h-5 stroke-[2]" />
        </button>
      }
      contentClassName="p-4 space-y-4"
    >
      {/* Stepper Demo */}
      <Card variant="surface" radius="2xl" padding="sm" data-testid="test-card">
        <Stepper
          currentStep={currentStep}
          steps={[
            { number: 1, label: 'Tanggal' },
            { number: 2, label: 'Waktu' },
            { number: 3, label: 'Detail' },
          ]}
        />
      </Card>

      {/* Button Variants Demo */}
      <Card variant="card" radius="2xl" padding="md" className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Pilihan Aksi Layanan
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="lime"
            data-testid="btn-lime"
            fullWidth
            onClick={() => console.log('Lime clicked')}
          >
            Pesan Layanan
          </Button>
          <Button
            variant="forest"
            data-testid="btn-forest"
            fullWidth
            onClick={() => console.log('Forest clicked')}
          >
            Konsultasi
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            variant="outline"
            data-testid="btn-outline"
            fullWidth
            onClick={() => console.log('Outline clicked')}
          >
            Rincian
          </Button>
          <Button
            variant="subtle"
            data-testid="btn-subtle"
            fullWidth
            onClick={() => console.log('Subtle clicked')}
          >
            Bantuan
          </Button>
        </div>
      </Card>

      {/* iOS Switch Demo */}
      <Card variant="surface" radius="2xl" padding="md">
        <IosSwitch
          label="Pengingat Kunjungan Otomatis"
          checked={notificationEnabled}
          onChange={setNotificationEnabled}
        />
      </Card>

      {/* Star Rating Demo */}
      <Card variant="card" radius="2xl" padding="md" className="space-y-2 text-center">
        <h3 className="text-sm font-semibold text-ink-primary">
          Beri Penilaian Dokter
        </h3>
        <div className="flex justify-center items-center py-1">
          <StarRating
            rating={rating}
            onChange={setRating}
            interactive={true}
            size="lg"
            data-testid="interactive-star-rating"
          />
        </div>
        <p className="text-xs text-ink-secondary">
          Nilai terpilih:{' '}
          <span data-testid="rating-value" className="font-semibold text-ink-primary">
            {rating} Bintang
          </span>
        </p>
      </Card>
    </MobileFrame>
  );
}
