export const contactDetails = {
  email: "info@leonith.in",
  phone: "+91 82383 75000",
  phoneHref: "+918238375000",
  addressLines: ["8 A National Highway,", "Morbi, Gujarat, India 363641"],
};

// Enquiries go straight to the sales WhatsApp with the message already filled in.
export const whatsappLink = (message: string) =>
  `https://wa.me/${contactDetails.phoneHref.replace("+", "")}?text=${encodeURIComponent(message)}`;
