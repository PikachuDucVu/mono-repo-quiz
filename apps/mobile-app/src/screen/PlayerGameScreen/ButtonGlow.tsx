import { cn } from "../../utils/cn";

export type ButtonGlowProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  bgColor: string;
  glowColor: string;
  children: React.ReactNode;
  glowTop: string;
  rounded?: string;
  squareButton?: boolean;
  formButton?: boolean;
  size?: string;
};

export const ButtonGlow = ({
  bgColor,
  glowColor,
  children,
  size,
  glowTop,
  squareButton,
  rounded,
  formButton,
  onClick,
  ...props
}: ButtonGlowProps) => {
  return (
    <div
      className={cn(
        (squareButton && "aspect-square") || size,
        size,
        "relative"
      )}
    >
      <button
        className={cn(
          squareButton && !size && "w-full h-full",
          size,
          rounded,
          glowColor,
          glowTop,
          "absolute right-0"
        )}
      ></button>
      <button
        disabled={props.disabled}
        className={cn(
          squareButton && !size && "w-full h-full",
          size,
          rounded,
          bgColor,
          "shadow justify-center items-center flex absolute top-0 right-0"
        )}
        onClick={
          formButton
            ? onClick
            : (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onClick) onClick(e);
              }
        }
        onMouseDown={
          formButton
            ? props.onMouseDown
            : (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (props.onMouseDown) props.onMouseDown(e);
              }
        }
      >
        {children}
      </button>
    </div>
  );
};
