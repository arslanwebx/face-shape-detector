"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

function validate(values: FormData) {
  const errors: FieldErrors = {};
  const name = String(values.get("name") ?? "").trim();
  const email = String(values.get("email") ?? "").trim();
  const subject = String(values.get("subject") ?? "").trim();
  const message = String(values.get("message") ?? "").trim();

  if (name.length < 2) errors.name = "Enter your name using at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (subject.length < 3) errors.subject = "Enter a subject using at least 3 characters.";
  if (message.length < 20) errors.message = "Write at least 20 characters so we can understand the issue.";

  return errors;
}

export default function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const subjectRef = useRef<HTMLInputElement>(null);
  const submissionControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const subject = new URLSearchParams(window.location.search).get("subject");
    if (subject && subjectRef.current && !subjectRef.current.value) subjectRef.current.value = subject.slice(0, 160);
  }, []);

  useEffect(() => () => submissionControllerRef.current?.abort(), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setStatusMessage("");

    if (Object.keys(nextErrors).length) {
      setStatus("error");
      setStatusMessage("Check the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    submissionControllerRef.current?.abort();
    const controller = new AbortController();
    submissionControllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values)),
        signal: controller.signal,
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) throw new Error(result?.message ?? "Your message could not be sent. Please try again or use the email link below.");

      form.reset();
      setErrors({});
      setStatus("success");
      setStatusMessage("Your message was sent successfully. We will reply by email when a response is needed.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof DOMException && error.name === "AbortError" ? "The request timed out. Please try again or use the email link below." : error instanceof Error ? error.message : "Your message could not be sent. Please use the email link below.");
    } finally {
      window.clearTimeout(timeout);
      if (submissionControllerRef.current === controller) submissionControllerRef.current = null;
    }
  };

  const field = (name: FieldName) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <label>Name<input name="name" autoComplete="name" maxLength={100} required {...field("name")} />{errors.name && <span id="name-error" className="field-error">{errors.name}</span>}</label>
        <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required {...field("email")} />{errors.email && <span id="email-error" className="field-error">{errors.email}</span>}</label>
      </div>
      <label>Subject<input ref={subjectRef} name="subject" maxLength={160} required {...field("subject")} />{errors.subject && <span id="subject-error" className="field-error">{errors.subject}</span>}</label>
      <label>Message<textarea name="message" rows={7} minLength={20} maxLength={5000} required {...field("message")} />{errors.message && <span id="message-error" className="field-error">{errors.message}</span>}</label>
      <label className="honeypot" aria-hidden="true">Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      <p className="form-note">Do not include a face photo, facial measurements, medical information, passwords, or other sensitive material.</p>
      {statusMessage && <p className={status === "success" ? "success-message" : "error-message"} role={status === "error" ? "alert" : "status"} aria-live="polite">{statusMessage}</p>}
      <button className="button" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Send message"}</button>
      <p className="form-fallback">If the form is unavailable, email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.</p>
    </form>
  );
}
