"use client";

import { Office } from "@/types";

interface OfficeMapProps {
  office: Office;
  className?: string;
}

export function OfficeMap({ office, className = "" }: OfficeMapProps) {
  const coords = office.mapLink.match(/q=([-\d.]+),([-\d.]+)/);
  if (!coords) return null;

  const lat = coords[1];
  const lng = coords[2];

  return (
    <div className={`overflow-hidden rounded-xl ${className}`}>
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1`}
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`${office.city} Office`}
      />
    </div>
  );
}
