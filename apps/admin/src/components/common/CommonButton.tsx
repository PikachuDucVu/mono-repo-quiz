import { ReactElement } from "react";

export type CommonButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  text?: string;
  secondaryStyle?: boolean;
  addon?: ReactElement;
  addonRight?: boolean;
  singleLine?: boolean;
  customDisableClass?: string;
  disableDefaultPadding?: boolean;
  disableDefaultColor?: boolean;
  formButton?: boolean;
};

export const CommonButton = ({
  text,
  secondaryStyle,
  addon,
  addonRight,
  customDisableClass,
  singleLine,
  disableDefaultPadding,
  disableDefaultColor,
  formButton,
  onClick,
  ...props
}: CommonButtonProps) => {
  return (
    <button
      onClick={
        formButton
          ? onClick
          : (e) => {
              e.stopPropagation();
              e.preventDefault();
              onClick && onClick(e);
            }
      }
      onMouseDown={
        formButton
          ? props.onMouseDown
          : (e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onMouseDown && props.onMouseDown(e);
            }
      }
      {...props}
      className={[
        props.className,
        disableDefaultPadding ? "" : "py-3 px-4",
        "rounded flex flex-row gap-2 justify-center items-center",
        customDisableClass || "disabled:opacity-50",
        disableDefaultColor
          ? ""
          : secondaryStyle
            ? "bg-gray-600 text-gray-200"
            : "bg-blue-800 hover:bg-blue-900 text-white font-bold",
      ]
        .join(" ")
        .trim()}
    >
      {addon && !addonRight && addon}
      {text !== undefined && (
        <div className={singleLine ? "line-clamp-1" : ""}>{text && text}</div>
      )}
      {addon && addonRight && addon}
    </button>
  );
};
