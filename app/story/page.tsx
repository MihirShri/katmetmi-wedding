import NavBar from '@/components/NavBar'
import Timeline from '@/components/Timeline'

export const metadata = {
  title: 'Our Story — KatMetMi',
}

export default function StoryPage() {
  return (
    <>
      <NavBar />
      <main>
        <Timeline />
      </main>
    </>
  )
}
