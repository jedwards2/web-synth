import "./PianoKey.css";

const PianoKey = ({ note, updateNote }: any) => {
  let offsetNote =
    (note.name.includes("D") && !note.name.includes("#")) ||
    (note.name.includes("E") && !note.name.includes("#")) ||
    (note.name.includes("G") && !note.name.includes("#")) ||
    (note.name.includes("A") && !note.name.includes("#")) ||
    (note.name.includes("B") && !note.name.includes("#"))
      ? true
      : false;
  return (
    <div className="key">
      <div
        className={`${note.name.includes("#") ? "black" : "white"} ${
          offsetNote ? "offset" : ""
        }`}
        onClick={() => {
          updateNote(note);
        }}
      ></div>
    </div>
  );
};

export default PianoKey;
