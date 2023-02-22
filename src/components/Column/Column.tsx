import MusicBlock from "../MusicBlock/MusicBlock";
import "./Column.css";

const Column = ({ columnState, setBlock, synthParams }: any) => {
  const blocks = columnState.map((obj: any, idx: number) => {
    return (
      <MusicBlock
        blockState={obj}
        setBlock={setBlock}
        key={`obj + ${idx}`}
        synthParams={synthParams}
      ></MusicBlock>
    );
  });
  return <div className="column">{blocks}</div>;
};

export default Column;
