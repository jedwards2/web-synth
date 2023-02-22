import "./App.css";
import { useState, useEffect } from "react";
import Grid from "./components/Grid/Grid";
import NoteSet from "./components/NoteSet/NoteSet";
// import TempoSlider from "./components/TempoSlider";
// import DistortionSlider from "./components/DistortionSlider";
// import ReverbSlider from "./components/ReverbSlider";
import PianoKey from "./components/PianoKey/PianoKey";
import play from "./images/play.png";
import pause from "./images/pause.png";
import noteData from "./noteData";

function App() {
  // const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentRow, setCurrentRow] = useState([true, false, false, false]);
  const [gridState, setGridState] = useState([
    [
      { state: false, id: 0, note: "G3", borderActive: true },
      { state: false, id: 1, note: "F3", borderActive: true },
      { state: false, id: 2, note: "E3", borderActive: true },
      { state: false, id: 3, note: "C3", borderActive: true },
    ],
    [
      { state: false, id: 4, note: "G3", borderActive: false },
      { state: false, id: 5, note: "F3", borderActive: false },
      { state: false, id: 6, note: "E3", borderActive: false },
      { state: false, id: 7, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 8, note: "G3", borderActive: false },
      { state: false, id: 9, note: "F3", borderActive: false },
      { state: false, id: 10, note: "E3", borderActive: false },
      { state: false, id: 11, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 12, note: "G3", borderActive: false },
      { state: false, id: 13, note: "F3", borderActive: false },
      { state: false, id: 14, note: "E3", borderActive: false },
      { state: false, id: 15, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 16, note: "G3", borderActive: false },
      { state: false, id: 17, note: "F3", borderActive: false },
      { state: false, id: 18, note: "E3", borderActive: false },
      { state: false, id: 19, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 20, note: "G3", borderActive: false },
      { state: false, id: 21, note: "F3", borderActive: false },
      { state: false, id: 22, note: "E3", borderActive: false },
      { state: false, id: 23, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 24, note: "G3", borderActive: false },
      { state: false, id: 25, note: "F3", borderActive: false },
      { state: false, id: 26, note: "E3", borderActive: false },
      { state: false, id: 27, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 28, note: "G3", borderActive: false },
      { state: false, id: 29, note: "F3", borderActive: false },
      { state: false, id: 30, note: "E3", borderActive: false },
      { state: false, id: 31, note: "C3", borderActive: false },
    ],
  ]);
  const [synth, setSynth] = useState();
  const [distAmount, setDistAmount] = useState(0.5);
  const [reverbAmount, setReverbAmount] = useState(0.99);

  useEffect(() => {
    // eslint-disable-next-line
  }, [reverbAmount, distAmount]);

  useEffect(() => {});

  function setBlock(id: number) {
    setGridState((prevState) => {
      const newState = [];
      for (let i = 0; i < prevState.length; i++) {
        let column = [];
        for (let q = 0; q < prevState[i].length; q++) {
          if (prevState[i][q].id === id) {
            column.push({
              state: !prevState[i][q].state,
              id: id,
              note: prevState[i][q].note,
              borderActive: prevState[i][q].borderActive,
            });
          } else {
            column.push(prevState[i][q]);
          }
        }
        newState.push(column);
      }
      return newState;
    });
  }

  function updateNote(value: any) {
    let row = currentRow.indexOf(true);

    setGridState((prevState) => {
      const newState = [];
      for (let i = 0; i < prevState.length; i++) {
        let column = [];
        for (let q = 0; q < prevState[i].length; q++) {
          if (q === row) {
            column.push({
              state: prevState[i][q].state,
              id: prevState[i][q].id,
              note: value,
              borderActive: prevState[i][q].borderActive,
            });
          } else {
            column.push(prevState[i][q]);
          }
        }
        newState.push(column);
      }
      return newState;
    });
  }

  const switchRunning = () => {
    setRunning((prevState) => !prevState);
  };

  const keys = noteData.map((note) => {
    return (
      <PianoKey note={note} updateNote={updateNote} currentRow={currentRow} />
    );
  });

  const noteSets = currentRow.map((rowState, index) => {
    return (
      <NoteSet
        setCurrentRow={setCurrentRow}
        rowState={rowState}
        rowNumber={index}
        currentNote={gridState[0][index].note}
      />
    );
  });

  return (
    <div className="App">
      <div className="synthesizer-div">
        <div className="synth-header">
          <h1>Sequencer</h1>
          <div onClick={switchRunning} className="button-div">
            {running ? (
              <img src={pause} alt="pause" className="buttonImg"></img>
            ) : (
              <img src={play} alt="play" className="buttonImg"></img>
            )}
          </div>
          <h2>Tempo</h2>
          {/* <TempoSlider />
          <h2>Distortion</h2>
          <DistortionSlider
            distAmount={distAmount}
            setDistAmount={setDistAmount}
          />
          <h2>Reverb</h2>
          <ReverbSlider
            reverbAmount={reverbAmount}
            setReverbAmount={setReverbAmount}
          /> */}
        </div>
        <div className="bottom-row">
          <Grid gridState={gridState} setBlock={setBlock} synth={synth} />
          <div className="noteset-columns">{noteSets}</div>
        </div>
        <div className="piano--div">{keys}</div>
      </div>
      <div className="footer">
        <p>created by</p>
        <a href="https://github.com/jedwards2">jedwards2</a>
      </div>
    </div>
  );
}

export default App;
