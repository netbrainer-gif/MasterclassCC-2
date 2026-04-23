import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email, source = 'landing' } = await request.json();

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from('email_subscribers')
    .insert({ email, source });

  if (dbError && dbError.code !== '23505') {
    console.error('Supabase error:', dbError);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  await resend.emails.send({
    from: 'Netbrainer AI <onboarding@resend.dev>',
    to: email,
    subject: 'Your Dental AI Roadmap is here',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1c1e1a;">
        <h2 style="margin-bottom:8px;">Welcome to Netbrainer AI</h2>
        <p>Thanks for signing up. Your <strong>Dental AI Roadmap</strong> is on its way — it covers the 5 AI systems every independent practice should implement, in the right order.</p>
        <p>In the meantime, if you have questions or want to book your free 30-minute strategy call, just reply to this email.</p>
        <p style="margin-top:32px;color:#666;font-size:13px;">You're receiving this because you signed up at netbrainerai.com. Unsubscribe anytime.</p>
      </div>
    `,
  });

  return Response.json({ ok: true });
}
