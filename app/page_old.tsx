export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Hi — I’m Taylor Arndt</h1>
      <p>Welcome to my personal website. Use the navigation to explore About, Contact, Media, and Resources.</p>
      <ul className="list-disc pl-5">
        <li><a className="text-teal-700" href="/resources">All resources about me</a></li>
        <li><a className="text-teal-700" href="/about">Learn more about me</a></li>
        <li><a className="text-teal-700" href="/contact">Get in touch</a></li>
      </ul>
    </section>
  )
}
