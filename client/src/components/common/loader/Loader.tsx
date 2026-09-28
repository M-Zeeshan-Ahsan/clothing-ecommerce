import { ScaleLoader } from "react-spinners";
import "./Loader.scss";

interface LoaderProps {
  height?: number;
  width?: number;
  margin?: number;
}

const Loader = ({ height = 35, width = 4, margin = 3 }: LoaderProps) => {
  return (
    <div className="loader">
      <ScaleLoader height={height} width={width} margin={margin} />
    </div>
  );
};

export default Loader;
