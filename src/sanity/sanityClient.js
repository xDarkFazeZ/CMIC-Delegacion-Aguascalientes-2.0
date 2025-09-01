import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'xs8bc8fb',
  dataset: 'production',
  apiVersion: '2025-08-29',
  useCdn: true,
});