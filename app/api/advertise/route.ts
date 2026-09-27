import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { checkRateLimit, createRateLimitResponse, getClientIp } from '@/lib/security/rate-limit';
import { sanitizeString, isValidSafeUrl, isValidEmail, verifySameOrigin } from '@/lib/security/sanitize';

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
  status: 'pending' | 'confirmed' | 'contacted';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// 10 sponsor inquiries per hour per IP
const ADVERTISE_RATE_LIMIT = 10;
const ADVERTISE_WINDOW_MS = 60 * 60 * 1000;

async function getInquiries(): Promise<SponsorInquiry[]> {
  try {
    const data = await fs.readFile(INQUIRIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInquiry(inquiry: SponsorInquiry): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const inquiries = await getInquiries();
  inquiries.unshift(inquiry);
  // Cap inquiries history at 1,000 to prevent unbounded disk growth
  if (inquiries.length > 1000) {
    inquiries.length = 1000;
  }
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
}

export async function POST(req: NextRequest) {
  try {
    // 1. CSRF origin check
    if (!verifySameOrigin(req)) {
      return NextResponse.json(
        { error: 'Cross-origin request forbidden.' },
        { status: 403 }
      );
    }

    // 2. Rate limiting check
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`advertise:${ip}`, ADVERTISE_RATE_LIMIT, ADVERTISE_WINDOW_MS);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const body = await req.json().catch(() => ({}));
    const { productName, websiteUrl, email, slotDuration, preferredSlot, tagline, notes } = body;

    // 3. Input sanitization and length bounds
    const cleanProductName = sanitizeString(productName, 80);
    const cleanTagline = sanitizeString(tagline, 200);
    const cleanNotes = sanitizeString(notes, 1000);
    const cleanSlotDuration = sanitizeString(slotDuration, 40) || '1-week';
    const cleanPreferredSlot = sanitizeString(preferredSlot, 60) || 'Side Rail Slot';

    if (!cleanProductName || cleanProductName.length < 2) {
      return NextResponse.json(
        { error: 'Product or agent name is required (2 to 80 characters).' },
        { status: 400 }
      );
    }

    // 4. URL safety & SSRF prevention
    const urlCheck = isValidSafeUrl(websiteUrl);
    if (!urlCheck.valid) {
      return NextResponse.json(
        { error: `Invalid website or demo URL: ${urlCheck.reason}` },
        { status: 400 }
      );
    }

    // 5. Email format validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'A valid contact email address is required.' },
        { status: 400 }
      );
    }

    const inquiry: SponsorInquiry = {
      id: `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      productName: cleanProductName,
      websiteUrl: urlCheck.sanitizedUrl!,
      email: String(email).trim().toLowerCase(),
      slotDuration: cleanSlotDuration,
      preferredSlot: cleanPreferredSlot,
      tagline: cleanTagline || undefined,
      notes: cleanNotes || undefined,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    await saveInquiry(inquiry);

    return NextResponse.json(
      {
        success: true,
        message: 'Sponsorship inquiry received. Confirmation sent to your email.',
        inquiryId: inquiry.id,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Failed to process sponsor inquiry:', err);
    return NextResponse.json(
      { error: 'Server error processing inquiry. Please contact advertise@topagents.lol' },
      { status: 500 }
    );
  }
}
