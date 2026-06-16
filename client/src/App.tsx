import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import RegulatoryResilience from './pages/RegulatoryResilience'
import Contact from './pages/Contact'

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-ov-canvas">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 bg-ov-canvas">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/regulatory-resilience" element={<RegulatoryResilience />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
