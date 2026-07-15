"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function NewsletterSignup() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("newsletterEmail") ?? "").trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setIsError(true);
      setMessage("Enter a valid email address.");
      return;
    }

    setIsError(false);
    setMessage("Your email app should open. Send the prepared message to complete your request.");
    const subject = "Newsletter subscription request";
    const body = `Please add ${email} to the Face Shape Detector newsletter.`;
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="footer-newsletter">
      <h3>Subscribe for face-shape tips</h3>
      <p>Get occasional guides, practical comparison tips, and detector updates.</p>
      <form onSubmit={submit} noValidate>
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <div className="newsletter-fields">
          <input id="newsletter-email" name="newsletterEmail" type="email" autoComplete="email" placeholder="Email address" required aria-describedby={message ? "newsletter-message" : undefined} />
          <button type="submit">Subscribe</button>
        </div>
        {message && <p id="newsletter-message" className={isError ? "newsletter-message is-error" : "newsletter-message"} role={isError ? "alert" : "status"}>{message}</p>}
      </form>
    </div>
  );
}
