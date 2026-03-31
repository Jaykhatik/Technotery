import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../sections/Hero/Hero'
import Client from '../sections/Client/Client'
import Community from '../sections/Community/Community'
import Feature from '../sections/Features/Feature'
import Stats from '../sections/State/State'
import Testimonial from '../sections/Testimonial/Testimonial'
import Blog from '../sections/Blog/Blog'
import Footer from '../components/Footer/Footer'
import CTA from '../sections/CTA/Cta'
import images from '../assets/images/indexImg'


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Client />
      <Community />
      <Feature img={images.Features.Feature_Image_1}
        title="The unseen of spending three years at Pixelgrade"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt labore beatae hic sit? Tempore voluptatem maxime est vitae autem! Dolor obcaecati odio, amet aspernatur atque fugiat esse tenetur quas voluptatibus."
        btnText="Learn More"
      />
      <Stats />
      <Feature img={images.Features.Feature_Image_2}
        title="The unseen of spending three years at Pixelgrade"
        desc="Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt labore beatae hic sit? Tempore voluptatem maxime est vitae autem! Dolor obcaecati odio, amet aspernatur atque fugiat esse tenetur quas voluptatibus."
        btnText="Learn More" />
      <Testimonial />
      <Blog />
      <CTA />
      <Footer />
    </>

  )
}

export default Home