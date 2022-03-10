import { useState } from 'react'
import { Carousel3d } from '@/components/carousel-3d'

import './App.scss'

const App = () => {
  const [items] = useState([
    '/static/images/0.png',
    '/static/images/1.png',
    '/static/images/2.png',
    '/static/images/3.png',
    '/static/images/4.png',
    '/static/images/5.png',
    '/static/images/6.png',
    '/static/images/7.png',
    '/static/images/8.png',
    '/static/images/9.png',
    '/static/images/10.png'
  ])

  const [loop, setLoop] = useState(true)
  const [disable3d, setDisable3d] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const [autoplayTimeout, setAutoplayTimeout] = useState(1)
  const [autoplayHoverPause, setAutoplayHoverPause] = useState(true)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [oneDirectional, setOneDirectional] = useState(false)
  const [clickable, setClickable] = useState(true)
  const [display, setDisplay] = useState(items.length)

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

      <Carousel3d
        autoplay={autoplay}
        autoplayTimeout={Math.max(autoplayTimeout, 1) * 500}
        autoplayHoverPause={autoplayHoverPause}
        loop={loop}
        reverse={reverse}
        disable3d={disable3d}
        clickable={clickable}
        controlsVisible={controlsVisible}
        oneDirectional={oneDirectional}
        items={items}
        display={display}
        startIndex={Math.floor(items.length / 2)}
        onLastSlide={(index) => console.log('onLastSlide', index)}
        onSlideChange={(index) => console.log('onSlideChange', index)}
        onMainSlideClick={(e, index) => console.log('onMainSlideClick', e, index)}
      />

      <div className="carousel-options">
        <div>
          <input
            type="checkbox"
            name="loop"
            id="loop"
            defaultChecked={loop}
            onChange={() => setLoop(!loop)}
          />
          <label htmlFor="loop">loop</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="reverse"
            id="reverse"
            defaultChecked={reverse}
            onChange={() => setReverse(!reverse)}
          />
          <label htmlFor="reverse">reverse</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="disable3d"
            id="disable3d"
            defaultChecked={disable3d}
            onChange={() => setDisable3d(!disable3d)}
          />
          <label htmlFor="disable3d">disable3d</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="autoplay"
            id="autoplay"
            defaultChecked={autoplay}
            onChange={() => setAutoplay(!autoplay)}
          />
          <label htmlFor="autoplay">autoplay</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="autoplayHoverPause"
            id="autoplayHoverPause"
            defaultChecked={autoplayHoverPause}
            onChange={() => setAutoplayHoverPause(!autoplayHoverPause)}
          />
          <label htmlFor="autoplayHoverPause">autoplayHoverPause</label>
        </div>

        <hr />
        <div>
          <label htmlFor="autoplayTimeout">autoplayTimeout (x500ms): </label>
          <input
            type="number"
            name="autoplayTimeout"
            id="autoplayTimeout"
            value={Math.max(Number(autoplayTimeout), 1)}
            onChange={(e) => setAutoplayTimeout(parseInt(e.target.value))}
          />
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="controlsVisible"
            id="controlsVisible"
            defaultChecked={controlsVisible}
            onChange={() => setControlsVisible(!controlsVisible)}
          />
          <label htmlFor="controlsVisible">controlsVisible</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="oneDirectional"
            id="oneDirectional"
            defaultChecked={oneDirectional}
            onChange={() => setOneDirectional(!oneDirectional)}
          />
          <label htmlFor="oneDirectional">oneDirectional</label>
        </div>

        <hr />
        <div>
          <input
            type="checkbox"
            name="clickable"
            id="clickable"
            defaultChecked={clickable}
            onChange={() => setClickable(!clickable)}
          />
          <label htmlFor="clickable">clickable</label>
        </div>

        <hr />
        <div>
          <label htmlFor="display">display: </label>
          <input
            type="number"
            name="display"
            id="display"
            value={Number(display) ? Math.max(Math.min(Number(display), items.length), 0) : 0}
            onChange={(e) => setDisplay(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  )
}

export default App
