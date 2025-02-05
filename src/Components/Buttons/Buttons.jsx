import { AwesomeButtonProgress } from "react-awesome-button";
import { BeakerIcon, TrashIcon } from "@primer/octicons-react"; // Custom icons
import "react-awesome-button/dist/styles.css"; // Ensure the styles are imported

const Buttons = () => {
  return (
    <>
      {/* Primary Progress Button */}
      <AwesomeButtonProgress
        type="primary"
        onPress={async (element, next) => {
          // Simulate async operation
          await new Promise((resolve) => setTimeout(resolve, 1000));
          next();
        }}
      >
        Submit
      </AwesomeButtonProgress>

      {/* Icon Button */}
     
    </>
  );
};

export default Buttons;
