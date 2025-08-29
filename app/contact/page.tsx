import type { Metadata } from 'next'
import ContactPageClient from './contact-client'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Taylor Arndt. Send a message, ask questions, or discuss collaboration opportunities.',
}

export default function ContactPage() {
  return <ContactPageClient />
}