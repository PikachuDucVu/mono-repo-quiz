import ReactTextareaAutosize, {
  TextareaAutosizeProps,
} from "react-textarea-autosize";

export const MultilineTextInput = ({
  className,
  disableStyles,
  defaultRows,
  maxRows,
  ...props
}: TextareaAutosizeProps &
  React.RefAttributes<HTMLTextAreaElement> & {
    disableStyles?: boolean;
    defaultRows?: number;
    maxRows?: number;
  }) => {
  return (
    <ReactTextareaAutosize
      {...props}
      minRows={defaultRows}
      maxRows={maxRows}
      className={[
        "w-full rounded-md shadow-md p-3 ",
        !disableStyles &&
          " bg-gray-700 text-gray-300  border-none outline-none rounded-md shadow-md",
        className,
      ]
        .join(" ")
        .trim()}
    />
  );
};
