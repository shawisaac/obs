// ─────────────────────────────────────────────
// CHEMIN : src/components/ui/SectionHeader.tsx
// En-tête de section réutilisable
// ─────────────────────────────────────────────
interface Props {
  label?: string
  title: string
  sub?: string
}

export default function SectionHeader({ label, title, sub }: Props) {
  return (
    <div className="reveal text-center mb-10 md:mb-12">
      {label && <p className="section-label mb-2">{label}</p>}
      <div className="section-divider" />
      <h2 className="section-title">{title}</h2>
      {sub && <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">{sub}</p>}
    </div>
  )
}