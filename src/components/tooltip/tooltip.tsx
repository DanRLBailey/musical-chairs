import styles from "./tooltip.module.scss";

interface TooltipProps {
  children: React.ReactNode | React.ReactNode[] | string;
  hovering: boolean;
}

export const Tooltip = (props: TooltipProps) => {
  return (
    <div
      className={`${styles.tooltipContainer} ${
        props.hovering ? styles.hover : ""
      }`}
    >
      {props.children}
    </div>
  );
};
