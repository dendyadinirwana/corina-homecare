import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../ui/Card';

export interface MiniDoctorCardProps {
  className?: string;
}

export const MiniDoctorCard: React.FC<MiniDoctorCardProps> = ({ className }) => {
  return (
    <Card
      data-testid="mini-doctor-card"
      variant="card"
      padding="sm"
      className={`flex items-center gap-3.5 bg-card/70 border border-border-subtle/80 ${className || ''}`}
    >
      <div className="relative shrink-0">
        <img
          src="/doctor-profile.jpg"
          alt="Corina Wulandari"
          data-testid="mini-doctor-avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#34C759] border-2 border-white rounded-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h2
            data-testid="mini-doctor-name"
            className="text-sm font-bold text-ink-primary truncate tracking-tight"
          >
            Corina Wulandari
          </h2>
          <div
            data-testid="mini-doctor-rating"
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink-primary shrink-0"
          >
            <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
            <span>4.9</span>
          </div>
        </div>

        <p
          data-testid="mini-doctor-specialty"
          className="text-xs text-ink-secondary truncate mt-0.5 font-medium"
        >
          Spesialis Penyakit Dalam • Homecare
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span
            data-testid="mini-doctor-patients"
            className="text-[11px] text-ink-muted font-normal"
          >
            180+ Pasien ditangani
          </span>
          <span className="text-[10px] text-ink-muted">•</span>
          <span className="text-[11px] text-ink-muted font-normal">
            SIP IDI Aktif
          </span>
        </div>
      </div>
    </Card>
  );
};

export default MiniDoctorCard;
