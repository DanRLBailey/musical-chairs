import styles from "./textInput.module.scss";
import typography from "@/styles/typography.module.scss";
import ErrorIcon from "@mui/icons-material/Error";

interface TextInputProps {
  value: string | number;
  onValueChange: (newVal: string | number) => void;
  label?: string;
  placeholder?: string;
  type?: "input" | "textArea";
  onButtonClick?: () => void;
  buttonText?: string | React.ReactNode;
  disabled?: boolean;
  isError?: boolean;
  loading?: boolean;
  success?: boolean;
  required?: boolean;
}

export const TextInput = (props: TextInputProps) => {
  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key.toLowerCase() == "enter" &&
      props.onButtonClick &&
      !(props.value == "" || props.disabled || props.isError)
    )
      props.onButtonClick();
  };

  return (
    <div className={styles.textInputContainer}>
      {props.label && (
        <div className={styles.label}>
          <div>
            <span>{props.label} </span>
            {props.required && <ErrorIcon className={styles.requiredIcon} />}
          </div>
        </div>
      )}
      <div className={styles.input}>
        {(props.type == "input" || !props.type) && (
          <>
            <input
              type="text"
              value={props.value}
              onChange={(e) => props.onValueChange(e.target.value)}
              onKeyDown={(e) => handleInput(e)}
              className={`${props.label ? styles.withLabel : ""} ${
                props.onButtonClick ? styles.withButton : ""
              } ${props.isError ? styles.error : ""}`}
              placeholder={props.placeholder ?? ""}
            ></input>
            {props.onButtonClick && (
              <button
                disabled={props.value == "" || props.disabled || props.isError}
                onClick={props.onButtonClick}
                className={props.success ? typography.success : ""}
              >
                {props.loading && !props.success && "Loading..."}
                {!props.loading && props.success && "Tick"}
                {(!props.loading && !props.success && props.buttonText) ??
                  "Save"}
              </button>
            )}
          </>
        )}
        {props.type == "textArea" && (
          <textarea
            value={props.value}
            onChange={(e) => props.onValueChange(e.target.value)}
            className={props.label ? styles.withLabel : ""}
            placeholder={props.placeholder ?? ""}
          ></textarea>
        )}
      </div>
    </div>
  );
};
