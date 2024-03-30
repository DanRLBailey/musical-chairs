import { useEffect, useRef, useState } from "react";
import styles from "./dropdownContainer.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";

interface DropdownContainerProps {
  values: string[];
  onValueChange: (newVal: string) => void;
  label?: string;
  placeholder?: string;
}

export const DropdownContainer = (props: DropdownContainerProps) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    props.placeholder ?? ""
  );
  const [dropdownActive, setDropdownActive] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownActive
      ) {
        setDropdownActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownActive]);

  useEffect(() => {
    props.onValueChange(
      selectedValue == props.placeholder ? "" : selectedValue
    );
  }, [selectedValue]);

  const formatText = (text: string) => {
    return `${text[0].toUpperCase()}${text.substring(1)}`;
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      {props.label && (
        <div className={styles.label}>
          <span>{props.label}</span>
        </div>
      )}
      <div
        className={`${styles.dropdownSelect} ${
          props.placeholder && selectedValue == props.placeholder
            ? styles.placeholder
            : ""
        } ${dropdownActive ? styles.focus : ""} ${
          props.label ? styles.withLabel : ""
        }`}
        onClick={() => setDropdownActive(!dropdownActive)}
      >
        <span>{formatText(selectedValue)}</span>
        {props.placeholder && selectedValue != props.placeholder && (
          <CloseIcon
            className={`${styles.icon} ${styles.closeIcon}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedValue(props.placeholder ?? "");
            }}
          />
        )}
        <KeyboardArrowDownIcon
          className={`${styles.icon} ${dropdownActive ? styles.active : ""}`}
        />
      </div>
      <div
        className={`${styles.dropdown} ${dropdownActive ? styles.active : ""}`}
      >
        {props.values.map((value, index) => (
          <span
            key={index}
            onClick={() => {
              setSelectedValue(value);
              setDropdownActive(false);
            }}
          >
            {formatText(value)}
          </span>
        ))}
      </div>
    </div>
  );
};
