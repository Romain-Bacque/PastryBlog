import classes from "./style.module.css";

interface LoaderProps {
  absolutePosition?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ absolutePosition }) => {
  return (
    <div
      className={`${classes["loader-container"]} ${
        absolutePosition ? classes["loader-container--p-absolute"] : ""
      }`}
    >
      <span className={classes["loader-container__dot"]}></span>
      <span className={classes["loader-container__dot"]}></span>
      <span className={classes["loader-container__dot"]}></span>
    </div>
  );
};

export default Loader;
