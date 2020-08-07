import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import '98.css';
import AudioSpectrum from "react-audio-spectrum"
const proxy = "https://cors-anywhere.herokuapp.com/"
function App() {
  const [keyword, setKeyword] = useState("")
  const [result, setResult] = useState({ lists: [] })
  const [play, setPlay] = useState("")
  const [current, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(100)

  const onSearchClick = (e) => {
    let params = new FormData()
    params.set("skey", keyword)
    params.set("no_pagination", "1")
    params.set("num_per_page", "100")
    axios.post(proxy + "http://uriminzokkiri.com/index.php?ptype=cmusic&mtype=writeList", params)
      .then(res => {
        console.log(res.data)
        setResult(res.data)
      })

    e.preventDefault()
  }
  const playMusic = (no) => {
    let params = new FormData()
    params.set("no", no + "pl")
    axios.post(proxy + "http://uriminzokkiri.com/index.php?ptype=cmusic&mtype=play", params)
      .then(res => {
        console.log("http://uriminzokkiri.com/" + res.data[0]["src"])
        setPlay("http://uriminzokkiri.com/" + res.data[0]["src"])
      })


  }
  const renderSearchResult = () => {
    const content = result.lists.map((item, idx) =>
      <tr key={idx}>
        <td>{item["no"]}</td>
        <td>{item["reg_date"]}</td>
        <td>{item["hit"]}</td>
        <td>{item["key_word"]}</td>
        <td>{item["title"]}</td>
        <td><a href={`http://uriminzokkiri.com/index.php?ptype=cmusic&mtype=download&no=${item["no"]}`}>DL</a></td>
        <td><button onClick={() => playMusic(item["no"])}>PLAY</button></td>
      </tr>
    )
    return content
  }
  const setProgress = (current,length) =>{
    setCurrentTime(current)
    setDuration(length)
    console.log(`CURRENT:${current}/${length}`)
  }
  return (
    <div className="App">
      <h1 style={{ color: "white" }}><span aria-label>🇰🇵</span>NK-PLAYER</h1>
      <audio id="audio-element" src={play} autoPlay onProgress={(e)=>setProgress(e.nativeEvent.target.currentTime,e.nativeEvent.target.duration)}/>
      {/*
        <AudioSpectrum
          id="audio-canvas"
          height={200}
          width={300}
          audioId={'audio-element'}
          capColor={'red'}
          capHeight={2}
          meterWidth={2}
          meterCount={512}
          meterColor={[
            {stop: 0, color: '#f00'},
            {stop: 0.5, color: '#0CD7FD'},
            {stop: 1, color: 'red'}
          ]}
          gap={4}
        />
        */}
      <div className="window" style={{ width: "90%" }}>
        <div className="title-bar">
          <div className="title-bar-text">NK-PLAYER</div>
        </div>
        <div className="window-body">
          <div className="field-row">
            <label>SONG NAME:</label>
            <input style={{ width: "100%" }} type="text" value={keyword} onChange={(e) => { setKeyword(e.target.value) }} />
            <button onClick={onSearchClick}>SEARCH</button>
          </div>
          <br/>
          <div class="field-row">
            <input id="range22" type="range" min="0" max={duration} value={current} />
          </div>
          <br/>
          <div className="field-row">
            <pre style={{ width: "100%" }}>
              <table style={{ width: "100%", textAlign: "left",fontSize:15 }}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>HOT</th>
                    <th>KEYWORD</th>
                    <th>TITLE</th>
                    <th>DOWNLOAD</th>
                    <th>PLAY</th>
                  </tr>
                </thead>
                <tbody>
                  {renderSearchResult()}
                </tbody>
              </table>
            </pre>
          </div>
        </div>
      </div>
      <p style={{ backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 5, borderRadius: "20px", fontWeight: "bold" }}>NK Player | Powered by project sparrow</p>
    </div>
  );
}

export default App;