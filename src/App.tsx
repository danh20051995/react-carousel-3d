import React from 'react'
import logo from './logo.svg'
import './App.css'
import { Carousel3d } from '@/components/carousel-3d'
import { Slide } from '@/components/carousel-3d/slide'

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <Carousel3d autoplay>
        <Slide>
          <img src="slide.src" alt="slide"/>
        </Slide>
      </Carousel3d>
    </div>
  )
}

export default App
