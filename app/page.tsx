import NavBar from '@/components/NavBar'
import Hero from '@/components/Hero'
import StoryIntro from '@/components/StoryIntro'
import Events from '@/components/Events'
import LucknowGuide from '@/components/LucknowGuide'
import RSVP from '@/components/RSVP'
import FunQuiz from '@/components/FunQuiz'
import GuestBook from '@/components/GuestBook'
import SongRequest from '@/components/SongRequest'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <section id="story">
          <StoryIntro />
        </section>
        <Events />
        <section id="lucknow">
          <LucknowGuide />
        </section>
        <RSVP />
        <section id="quiz">
          <FunQuiz />
        </section>
        <GuestBook />
        <SongRequest />
      </main>
      <Footer />
    </>
  )
}
