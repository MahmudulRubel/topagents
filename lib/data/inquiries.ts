import fs from 'fs/promises';
import path from 'path';

export interface SponsorInquiry {
  id: string;
  productName: string;
  websiteUrl: string;
  email: string;
  slotDuration: string;
  preferredSlot?: string;
  tagline?: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'confirmed';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

/**
 * Reads all sponsor inquiries from disk (data/inquiries.json).
 */
export async function getInquiries(): Promise<SponsorInquiry[]> {
  try {
    const data = await fs.readFile(INQUIRIES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves a new or updated inquiry to resilient local storage.
 */
export async function saveInquiry(inquiry: SponsorInquiry): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const inquiries = await getInquiries();
  
  const existingIdx = inquiries.findIndex((i) => i.id === inquiry.id);
  if (existingIdx >= 0) {
    inquiries[existingIdx] = inquiry;
  } else {
    inquiries.unshift(inquiry);
  }

  // Cap at 1,000 records
  if (inquiries.length > 1000) {
    inquiries.length = 1000;
  }

  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

/**
 * Updates status and optional notes on an inquiry.
 */
export async function updateInquiryStatus(
  id: string,
  status: 'pending' | 'contacted' | 'confirmed',
  adminNotes?: string
): Promise<SponsorInquiry | null> {
  const inquiries = await getInquiries();
  const target = inquiries.find((i) => i.id === id);
  if (!target) return null;

  target.status = status;
  if (adminNotes !== undefined) {
    target.notes = adminNotes;
  }

  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  return target;
}
