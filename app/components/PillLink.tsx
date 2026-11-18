import CtaButton from "@/components/ui/cta-button";

type PillLinkProps = {
  href: string;
  children: string;
};

export default function PillLink({ href, children }: PillLinkProps) {
  return <CtaButton href={href}>{children}</CtaButton>;
}
