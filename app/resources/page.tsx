import raw from '@/data/resources.json'

type Resource = { id: string; title: string; url: string; category: keyof typeof groups | string }
const resources = raw as Resource[]

const groups = {
  profile: 'Profiles',
  project: 'Projects',
  writing: 'Writing',
  media: 'Media',
  other: 'Other'
} as const

export default function ResourcesPage() {
  const byCat: Record<string, Resource[]> = {}
  for (const r of resources) {
    const key = (r.category in groups ? r.category : 'other') as string
    ;(byCat[key] ||= []).push(r)
  }
  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Resources</h1>
      {Object.entries(byCat).map(([key, items]) => (
        <div key={key}>
          <h2 className="text-xl font-medium">{groups[key as keyof typeof groups]}</h2>
          <ul className="list-disc pl-5">
            {(items || []).map((r: Resource) => (
              <li key={r.id}><a className="text-teal-700" href={r.url}>{r.title}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
