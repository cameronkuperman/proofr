import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | The Proofr Promise',
    default: 'The Proofr Promise',
  },
  description: 'Our commitment to making college admissions accessible to everyone through scholarships, resources, and community support.',
}

export default function PromiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}