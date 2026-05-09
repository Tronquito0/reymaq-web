export default function SectionHeader({ eyebrow, title, description, dark = false }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      {eyebrow && <p className="eyebrow mx-auto mb-3">{eyebrow}</p>}
      <h2 className={`section-title ${dark ? "text-white" : "text-graphite"}`}>{title}</h2>
      {description && (
        <p className={`mt-4 text-base leading-7 ${dark ? "text-white/70" : "text-steel"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
