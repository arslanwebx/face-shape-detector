import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) return NextResponse.json({ message: "The message is too large." }, { status: 413 });
  if (rateLimited(clientIp(request))) return NextResponse.json({ message: "Too many messages were submitted. Please wait 15 minutes or use the email link." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "The form data was invalid." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();

  if (company) return NextResponse.json({ message: "The submission was rejected." }, { status: 400 });
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || subject.length < 3 || subject.length > 160 || message.length < 20 || message.length > 5000) {
    return NextResponse.json({ message: "Check the form fields and try again." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ message: "Message delivery is temporarily unavailable. Please use the direct email link." }, { status: 503 });
  }

  try {
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [siteConfig.contactEmail],
        reply_to: email,
        subject: `[VisageMetric] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
      cache: "no-store",
    });

    if (!delivery.ok) {
      console.error("Contact delivery failed with provider status", delivery.status);
      return NextResponse.json({ message: "Your message could not be delivered. Please try again or use the direct email link." }, { status: 502 });
    }

    return NextResponse.json({ message: "Message sent." }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Contact delivery request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "Your message could not be delivered. Please use the direct email link." }, { status: 502 });
  }
}
