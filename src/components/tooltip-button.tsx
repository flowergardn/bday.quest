import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function TooltipButton(props: {
  children: JSX.Element;
  tooltip: JSX.Element | string;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{props.children}</TooltipTrigger>
      <TooltipContent side={props.tooltipSide ?? "bottom"}>
        {props.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
