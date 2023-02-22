import Column from "../Column/Column";
import "./Grid.css";

const Grid = ({ gridState, setBlock, synthParams }: any) => {
  const columns = gridState.map((array: any, idx: number) => {
    return (
      <Column
        columnState={array}
        setBlock={setBlock}
        key={`array + ${idx}`}
        synthParams={synthParams}
      ></Column>
    );
  });

  return <div className="grid">{columns}</div>;
};

export default Grid;
