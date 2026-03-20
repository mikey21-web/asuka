import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { checkRateLimit } from '@/lib/rate-limit';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  email: String,
  phone: String,
  occasion: String,
  eventDate: Date,
  sent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);

export async function POST(req: Request) {
  try {
    const { contact, occasion, eventDate } = await req.json();

    if (!contact || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    
    // Save reminder
    const reminder = await Reminder.create({
      phone: contact.includes('@') ? null : contact,
      email: contact.includes('@') ? contact : null,
      occasion,
      eventDate: new Date(eventDate)
    });

    return NextResponse.json({ success: true, id: reminder._id });
  } catch (error) {
    console.error('Reminder API Error:', error);
    return NextResponse.json({ error: 'Failed to set reminder' }, { status: 500 });
  }
}

// In a real app, a CRON job would hit this daily
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get('all') === 'true';

    if (fetchAll) {
      const allReminders = await Reminder.find({}).sort({ eventDate: 1 });
      return NextResponse.json({ reminders: allReminders });
    }

    const today = new Date();
    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(today.getDate() + 14);

    const dueReminders = await Reminder.find({
      eventDate: {
        $lte: fourteenDaysFromNow,
        $gte: today
      },
      sent: false
    });

    for (const reminder of dueReminders) {
      console.log(`[SIMULATED REMINDER] Sending reminder to ${reminder.phone || reminder.email} for ${reminder.occasion} on ${reminder.eventDate}`);
      reminder.sent = true;
      await reminder.save();
    }

    return NextResponse.json({ processed: dueReminders.length, reminders: dueReminders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
}
