import ArrowFillButton from "@/components/ui/arrow-fill-button";

type PillLinkProps = {
  href: string;
  children: string;
};

export default function PillLink({ href, children }: PillLinkProps) {
  return (
    <ArrowFillButton
      btnText={children}
      href={href}
      bgColor="#171717"
      textColor="#fffbf5"
      fillBgColor="#fffbf5"
      fillTextColor="#171717"
      hoverFillBgColor="#fffbf5"
      hoverFillTextColor="#171717"
      arrowColor="#171717"
      hoverArrowColor="#171717"
    />
  );
}
