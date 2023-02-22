import "./NoteSet.css";

function NoteSet({ setCurrentRow, rowState, rowNumber, currentNote }: any) {
  return (
    <div className="noteset-row">
      <div
        className={`music-block ${rowState ? "selected" : "not-selected"}`}
        onClick={() => {
          setCurrentRow(() => {
            let newState = [false, false, false, false];
            newState[rowNumber] = true;
            return newState;
          });
        }}
      ></div>
      <div className="noteset-name">{currentNote}</div>
    </div>
  );
}

export default NoteSet;
