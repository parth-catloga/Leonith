"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactDetails } from "./contactDetails";

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "company", label: "Company Name", type: "text", autoComplete: "organization" },
  { name: "email", label: "Email Address", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
];

const inputClass =
  "w-full border-b border-black/30 bg-transparent pb-3 pt-2 text-sm tracking-[-0.03em] outline-none transition-colors placeholder:text-black/45 focus:border-black";

// No form backend yet, so sending opens the visitor's email app with the
// enquiry already written out to Leonith.
export default function ContactForm() {
  const [isSent, setIsSent] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Arriving from a tile in the showroom (?tile=...) starts the message for you.
  useEffect(() => {
    const tile = new URLSearchParams(window.location.search).get("tile");
    if (tile && messageRef.current && !messageRef.current.value) {
      messageRef.current.value = `I'd like to know more about ${tile}.`;
    }
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const subject = `Website enquiry from ${value("name")}`;
    const body = [
      `Name: ${value("name")}`,
      `Company: ${value("company") || "-"}`,
      `Email: ${value("email")}`,
      `Phone: ${value("phone") || "-"}`,
      "",
      value("message"),
    ].join("\n");

    window.location.href = `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsSent(true);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="sr-only">{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            required={field.required}
            placeholder={field.label + (field.required ? " *" : "")}
            className={inputClass}
          />
        </label>
      ))}

      <label className="block sm:col-span-2">
        <span className="sr-only">Message</span>
        <textarea
          ref={messageRef}
          name="message"
          rows={5}
          required
          placeholder="Message *"
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <button
          type="submit"
          className="h-12 rounded-full bg-black px-10 text-xs uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80"
        >
          Send
        </button>
        {isSent && (
          <p role="status" className="text-xs tracking-[-0.03em] text-black/60">
            Your email app should open with the enquiry ready to send.
          </p>
        )}
      </div>
    </form>
  );
}
