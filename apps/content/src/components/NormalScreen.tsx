export type NormalScreenProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  embedded?: boolean;
  wFull?: boolean;
  disableDefaultBackground?: boolean;
  disablePadding?: boolean;
  disableGap?: boolean;
};

export const NormalScreen = ({
  className,
  disableGap = false,
  embedded = false,
  disablePadding = false,
  wFull = true,
  disableDefaultBackground = false,
  ...props
}: NormalScreenProps) => {
  return (
    <div
      {...props}
      className={[
        "h-full flex flex-col",
        disableGap ? "" : "gap-2",
        embedded ? "max-w-screen-lg" : "max-w-screen-sm overflow-y-auto",
        disablePadding || embedded ? "" : "p-3",
        wFull ? "w-full" : "",
        disableDefaultBackground ? "" : "bg-gray-900",
        className,
      ]
        .join(" ")
        .trim()}
    ></div>
  );
};
