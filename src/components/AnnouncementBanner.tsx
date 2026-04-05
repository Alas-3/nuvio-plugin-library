import './Components.css';

type AnnouncementStatus = 'warning' | 'ann' | 'notice';

interface AnnouncementBannerProps {
  status: AnnouncementStatus;
  message: string;
}

const statusLabel: Record<AnnouncementStatus, string> = {
  warning: 'Warning',
  ann: 'Announcement',
  notice: 'Notice',
};

export const AnnouncementBanner = ({ status, message }: AnnouncementBannerProps) => {
  return (
    <section className={`announcement-banner status-${status} animate-fade-in`} role="status" aria-live="polite">
      <span className="announcement-label">{statusLabel[status]}</span>
      <p className="announcement-message">{message}</p>
    </section>
  );
};
