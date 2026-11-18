// Content for /sustainability, based on the Leonith catalogue's sustainability page.
//
// SAMPLE FIGURES: every number on this page (40% renewable, 20% recycled, 1.5 MWp solar,
// 15% lower emissions since 2020, 100% water, 100% waste, 250+ people) is a typical figure for
// a large porcelain slab plant, filled in as a stand-in. None of them are confirmed for Leonith.
// Replace each with the factory's real value, or remove the claim, before the site goes live:
// unproven green claims count as greenwashing. The same goes for every certificate marked
// `confirmed: false`.

export const sustainabilityIntro = {
  title: "Surfaces that are kind to the Earth",
  text: "At Leonith, sustainability isn't a passing trend. It's how we make every slab in Morbi. We choose natural raw materials, power our plant with 40% renewable energy, recycle 100% of our process water and return 100% of production waste to the line. And because a Leonith slab never needs sealing and lasts for decades, the most sustainable surface is often the one you never have to replace.",
};

// The five pillars from the catalogue, each with the figure that proves it.
export const pillars = [
  { icon: "recycle", title: "Recycled materials", value: "20%", label: "recycled content in every slab" },
  { icon: "sun", title: "Renewable energy", value: "1.5 MWp", label: "of solar panels on our factory" },
  { icon: "leaf", title: "Carbon reduction", value: "15%", label: "lower emissions since 2020" },
  { icon: "water", title: "Water recycling", value: "100%", label: "of process water reused" },
  { icon: "waste", title: "Waste reduction", value: "100%", label: "of production waste recovered" },
] as const;

export type PillarIcon = (typeof pillars)[number]["icon"];

// How we make it. Wrap phrases in **double asterisks** for bold. Figures are samples (see top).
// DRAFT WORDING: the processes described here (kiln heat recovery, closed-loop water, where raw
// materials come from, offcuts going back into the mix) are typical for porcelain plants but are
// NOT confirmed for Leonith. Check each sentence with the factory and cut what isn't true.
export const practices = [
  {
    title: "Energy",
    text: "Our Morbi plant runs on **1.5 MWp of rooftop solar**, covering **40% of the electricity** we use. Heat from the kilns is recovered to dry the slabs before firing.",
  },
  {
    title: "Water",
    text: "Water used to grind raw materials and polish slabs is filtered and **reused in a closed loop**, so **100%** of it goes back into production instead of leaving the plant.",
  },
  {
    title: "Raw materials and waste",
    text: "Slabs are made from **natural clays, feldspars and sands**, sourced largely from Gujarat. Offcuts and rejected slabs are crushed and **returned to the mix**, recovering **100%** of production waste.",
  },
];

// Product facts already stated across the site: these are true today and need no figures.
export const productBenefits = [
  {
    title: "Built to last",
    text: "Porcelain resists **scratches, heat, stains and sunlight**, so a Leonith surface looks the same in ten years as on the day it was fitted. A surface you never replace is the lowest-impact surface of all.",
  },
  {
    title: "No sealants, no chemicals",
    text: "Slabs are **non-porous**, so they never need sealing or special products. A wipe with **water and a neutral detergent** keeps them clean, with nothing harsh going down the drain.",
  },
  {
    title: "Less material on site",
    text: "Large formats up to **1600 × 3200 mm** mean far fewer joints, so less adhesive and grout. **5 mm slabs** go straight over existing tiles, avoiding demolition and the waste it creates.",
  },
];

// `confirmed: true` only for certificates Leonith is known to hold. Check the rest before publishing
// and delete any that don't apply.
export const certifications = [
  { name: "NSF", text: "Our 1600 × 3200 mm slab is certified safe for food contact on kitchen countertops.", confirmed: true },
  { name: "ISO 9001", text: "Quality management system across production.", confirmed: false },
  { name: "ISO 14001", text: "Environmental management system that monitors and reduces our impact.", confirmed: false },
  { name: "ISO 45001", text: "Health and safety management system for everyone at the plant.", confirmed: false },
  { name: "CE", text: "Conforms to European standards for ceramic tiles (EN 14411).", confirmed: false },
  { name: "GREENGUARD Gold", text: "Low chemical emissions for healthier indoor air.", confirmed: false },
];

export const people = {
  title: "People and Morbi",
  text: "Leonith employs **250+ people** in Morbi, at the heart of India's ceramic district. We invest in **safety training**, skills development and the local community, because a responsible surface starts with the people who make it.",
};
