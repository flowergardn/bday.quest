import { UseFormRegister } from "react-hook-form";

export type CardDataValues = {
  title: string;
  description: string;
  birthday: string;
  showAge: boolean;
};
// used for type-checking in our textbox component
type CardDataTypes = "title" | "description" | "birthday";

export const Textbox = (props: {
  title: React.ReactNode;
  type: CardDataTypes;
  register: UseFormRegister<CardDataValues>;
  required?: boolean;
  placeholder?: string;
  inputType?: string;
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{props.title}</span>
      </label>
      <input
        type={props.inputType ? props.inputType : "text"}
        placeholder={props.placeholder ? props.placeholder : props.type}
        className="input input-bordered rounded-lg"
        required={props.required}
        {...props.register(props.type)}
      />
    </div>
  );
};
