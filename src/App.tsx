import { useState } from 'react'
import { Carousel3d } from '@/components/carousel-3d'

import './App.scss'

const App = () => {
  const items = [
    'https://img.favpng.com/10/6/13/number-0-computer-icons-blue-clip-art-png-favpng-Q69GyATD54wpx0Jdfw67Rrjyi_t.jpg',
    'https://media.baamboozle.com/uploads/images/140571/1602219863_6002',
    'https://gamedata.britishcouncil.org/sites/default/files/attachment/number-2_1.jpg',
    'https://www.pinclipart.com/picdir/middle/321-3212719_-numbers-1-10-math-numbers-name-letters.png',
    'https://i.ytimg.com/vi/I6I2tBmMxMY/hqdefault.jpg',
    'https://www.pngfind.com/pngs/m/121-1212576_numbers-numbers-1-10-letters-and-numbers.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Eo_circle_red_number-6.svg/2048px-Eo_circle_red_number-6.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Eo_circle_blue_number-7.svg/1200px-Eo_circle_blue_number-7.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Eo_circle_pink_white_number-8.svg/1200px-Eo_circle_pink_white_number-8.svg.png',
    'https://www.pngitem.com/pimgs/m/423-4233905_blue-number-9-clipart-number-9-blue-color.png'
  ]

  const [loop, setLoop] = useState(true)
  const [disable3d, setDisable3d] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
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
        loop={loop}
        disable3d={disable3d}
        autoplay={autoplay}
        autoplayHoverPause={autoplayHoverPause}
        controlsVisible={controlsVisible}
        oneDirectional={oneDirectional}
        clickable={clickable}
        onLastSlide={(index) => console.log('onLastSlide', index)}
        onSlideChange={(index) => console.log('onSlideChange', index)}
        onMainSlideClick={(e, index) => console.log('onMainSlideClick', e, index)}
        startIndex={Math.floor(items.length / 2)}
        display={display}
        items={items.map(item => (
          <img src={item} alt="temp" />
        ))}
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

        <br />
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

        <br />
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

        <br />
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

        <br />
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

        <br />
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

        <br />
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

        <br />
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
