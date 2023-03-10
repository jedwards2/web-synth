import "./App.css";
import { useState, useEffect, useRef } from "react";
import { createDevice, IPatcher } from "@rnbo/js";
import Grid from "./components/Grid/Grid";
import NoteSet from "./components/NoteSet/NoteSet";
import PianoKey from "./components/PianoKey/PianoKey";
import Slider from "@mui/material/Slider";
import noteData from "./noteData";
import play from "./images/play.png";
import pause from "./images/pause.png";

const App = () => {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [currentRow, setCurrentRow] = useState([true, false, false, false]);
  const [gridState, setGridState] = useState([
    [
      { state: false, id: 0, note: "C3", borderActive: true },
      { state: false, id: 1, note: "C3", borderActive: true },
      { state: false, id: 2, note: "C3", borderActive: true },
      { state: false, id: 3, note: "C3", borderActive: true },
    ],
    [
      { state: false, id: 4, note: "C3", borderActive: false },
      { state: false, id: 5, note: "C3", borderActive: false },
      { state: false, id: 6, note: "C3", borderActive: false },
      { state: false, id: 7, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 8, note: "C3", borderActive: false },
      { state: false, id: 9, note: "C3", borderActive: false },
      { state: false, id: 10, note: "C3", borderActive: false },
      { state: false, id: 11, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 12, note: "C3", borderActive: false },
      { state: false, id: 13, note: "C3", borderActive: false },
      { state: false, id: 14, note: "C3", borderActive: false },
      { state: false, id: 15, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 16, note: "C3", borderActive: false },
      { state: false, id: 17, note: "C3", borderActive: false },
      { state: false, id: 18, note: "C3", borderActive: false },
      { state: false, id: 19, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 20, note: "C3", borderActive: false },
      { state: false, id: 21, note: "C3", borderActive: false },
      { state: false, id: 22, note: "C3", borderActive: false },
      { state: false, id: 23, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 24, note: "C3", borderActive: false },
      { state: false, id: 25, note: "C3", borderActive: false },
      { state: false, id: 26, note: "C3", borderActive: false },
      { state: false, id: 27, note: "C3", borderActive: false },
    ],
    [
      { state: false, id: 28, note: "C3", borderActive: false },
      { state: false, id: 29, note: "C3", borderActive: false },
      { state: false, id: 30, note: "C3", borderActive: false },
      { state: false, id: 31, note: "C3", borderActive: false },
    ],
  ]);

  const [volume, setVolume] = useState(0.5);
  const [tempo, setTempo] = useState(250);
  const [quality, setQuality] = useState(2);

  let context = useRef(new AudioContext());
  let synthParams = useRef([
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ]);
  let noteParams = useRef([
    { value: 0 },
    { value: 0 },
    { value: 0 },
    { value: 0 },
  ]);

  let qualityParam = useRef({ value: 0 });

  let volumeParam = useRef({ value: 0 });

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
    }, tempo);
    // clearing interval
    return () => clearInterval(timer);
  });

  const audioSetup = async () => {
    let rawPatcher = await fetch("/web-synth/exports/main.export.json");

    let patcher: IPatcher = await rawPatcher.json();

    const device = await createDevice({ context: context.current, patcher });
    device.node.connect(context.current.destination);

    for (let i = 0; i < 4; i++) {
      synthParams.current[i] = device.parametersById.get(`synth_${i}`);
    }
    for (let i = 0; i < 4; i++) {
      noteParams.current[i] = device.parametersById.get(`note_${i}`);
    }

    qualityParam.current = device.parametersById.get("freq_mod");
    volumeParam.current = device.parametersById.get("volume");
  };

  const onOffSwitch = async () => {
    if (running) {
      await context.current.suspend().then(() => setRunning(false));
    } else {
      await context.current.resume().then(() => setRunning(true));
      //setup all default params
      // noteParams.current[0].value = 195;
      // noteParams.current[1].value = 174;
      // noteParams.current[2].value = 164;
      // noteParams.current[3].value = 130;
      volumeParam.current.value = volume;
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

  const updateNote = (note: any) => {
    let row = currentRow.indexOf(true);

    noteParams.current[row].value = note.frq;

    setGridState((prevState) => {
      const newState = [];
      for (let i = 0; i < prevState.length; i++) {
        let column = [];
        for (let q = 0; q < prevState[i].length; q++) {
          if (q === row) {
            column.push({
              state: prevState[i][q].state,
              id: prevState[i][q].id,
              note: note.name,
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
    volumeParam.current.value = Number(e.target.value);
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempo(Number(e.target.value));
  };
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
    qualityParam.current.value = Number(e.target.value);
  };

  return (
    <div className="App">
      <div className="synthesizer-div">
        <div className="piano--div">{keys}</div>
        <div className="synth-header">
          <div onClick={onOffSwitch} className="button-div">
            <img
              src={running ? pause : play}
              alt="play pause"
              className="buttonImg"
            ></img>
          </div>
          <h2>Tempo</h2>
          <Slider
            size="small"
            defaultValue={250}
            aria-label="Small"
            min={50}
            max={250}
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
            defaultValue={2}
            min={1}
            max={10}
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
          <Grid
            gridState={gridState}
            setBlock={setBlock}
            synthParams={synthParams}
          />
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
