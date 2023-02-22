import "./App.css";
import { useState, useEffect, useRef } from "react";
import { createDevice } from "@rnbo/js";
import Grid from "./components/Grid/Grid";
import NoteSet from "./components/NoteSet/NoteSet";
import PianoKey from "./components/PianoKey/PianoKey";
import Slider from "@mui/material/Slider";
import noteData from "./noteData";

const App = () => {
  const [count, setCount] = useState(0);
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

  const [volume, setVolume] = useState(0.5);
  const [tempo, setTempo] = useState(70);
  const [quality, setQuality] = useState(50);

  let context = useRef(new AudioContext());

  useEffect(() => {
    audioSetup();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (running) {
        setCount((prevCount) => prevCount + 1);

        setGridState((prevState) => {
          let index = count % prevState.length;
          let nextIndex = (count + 1) % prevState.length;
          let newState = [...prevState];
          let newNextState = newState[nextIndex].map((obj) => {
            let newObj = { ...obj };
            newObj.borderActive = !newObj.borderActive;
            return newObj;
          });

          newState[nextIndex] = newNextState;

          let currentIndexedState = newState[index].map((obj) => {
            let newObj2 = { ...obj };
            newObj2.borderActive = !newObj2.borderActive;
            return newObj2;
          });

          newState[index] = currentIndexedState;

          return newState;
        });
      }
    }, 250);
    // clearing interval
    return () => clearInterval(timer);
  });

  const audioSetup = async () => {
    let rawPatcher = await fetch("exports/main.export.json");

    let patcher = await rawPatcher.json();

    const device = await createDevice({ context: context.current, patcher });
    device.node.connect(context.current.destination);
  };

  const onOffSwitch = async () => {
    if (running) {
      await context.current.suspend().then(() => setRunning(false));
    } else {
      await context.current.resume().then(() => setRunning(true));
    }
  };

  const setBlock = (id: number) => {
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
  };

  const updateNote = (value: any) => {
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
  };

  return (
    <div className="App">
      <div className="synthesizer-div">
        <div className="piano--div">{keys}</div>
        <div className="synth-header">
          <div onClick={onOffSwitch} className="button-div">
            <img
              src={running ? "images/pause.png" : "images/play.png"}
              alt="pause"
              className="buttonImg"
            ></img>
          </div>
          <h2>Tempo</h2>
          <Slider
            size="small"
            defaultValue={70}
            aria-label="Small"
            min={60}
            max={100}
            valueLabelDisplay="auto"
            value={tempo}
            onChange={(e) =>
              handleTempoChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
          />
          <h2>Volume</h2>
          <Slider
            size="small"
            defaultValue={0.5}
            aria-label="Small"
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
            value={volume}
            onChange={(e) =>
              handleVolumeChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
          />
          <h2>Adjust Sound</h2>
          <Slider
            size="small"
            defaultValue={50}
            min={0}
            max={100}
            aria-label="Small"
            valueLabelDisplay="auto"
            value={quality}
            onChange={(e) =>
              handleQualityChange(
                e as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
          />
        </div>
        <div className="bottom-row">
          <Grid gridState={gridState} setBlock={setBlock} />
          <div className="noteset-columns">{noteSets}</div>
        </div>
      </div>
      <div className="footer">
        <p>created by</p>
        <a href="https://github.com/jedwards2">jedwards2</a>
      </div>
    </div>
  );
};

export default App;
