import "./MusicBlock.css";
import { useEffect } from "react";

const MusicBlock = ({ blockState, setBlock, synthParams }: any) => {
  useEffect(() => {
    if (blockState.state && blockState.borderActive) {
      synthParams.current[blockState.id % 4].value = Math.random();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockState]);

  return (
    <div
      className={`music-block ${blockState.state ? "on" : "off"} ${
        blockState.borderActive ? "border-on" : "border-off"
      }`}
      onClick={() => setBlock(blockState.id)}
    ></div>
  );
};

export default MusicBlock;
