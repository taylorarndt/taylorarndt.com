import type { Metadata } from 'next'
import ResourceSubmitClient from './submit-client'

export const metadata: Metadata = {
  title: 'Submit a Resource',
  description: 'Suggest a resource to be included on Taylor Arndt\'s resources page.'
}

export default function SubmitPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900"><span className="text-sky-600">Suggest</span> a Resource</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">If you know a helpful article, profile, or project related to my work, please share it below for review.</p>
      </section>

      <ResourceSubmitClient />
    </div>
  )
}
