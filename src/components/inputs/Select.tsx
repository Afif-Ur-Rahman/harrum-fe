import { ReactNode } from "react";
import { Select, Text } from "@radix-ui/themes";
import { useFormContext } from "react-hook-form";
import { FormFieldError } from "@/components/form";

type Options = { label: string | ReactNode; value: string };
interface SelectDropdownProps {
  options: Options[];
  field: string;
  placeholder?: string;
  label?: string;
  isdisabled?: boolean;
  type?: "dropdown" | "selectoption";
}

const SelectDropdown = ({
  options,
  field,
  placeholder,
  label,
  isdisabled,
  type = "dropdown",
}: SelectDropdownProps) => {
  const form = useFormContext();
  const value = form?.watch(field);

  return (
    <>
      {type === "dropdown" && (
        <div className="flex flex-col gap-2">
          {label && (
            <Text className="text-sm mb-1" weight="medium">
              {label}
            </Text>
          )}
          <Select.Root
            size="3"
            value={value}
            onValueChange={(val) => form?.setValue(field, val)}
            disabled={isdisabled}
          >
            <Select.Trigger
              placeholder={placeholder}
              className="w-full! cursor-pointer!"
            />
            <Select.Content
              position="popper"
              highContrast
              className="w-full! cursor-pointer! max-h-50!"
            >
              {options
                .filter((option: Options) => option.value !== "")
                .map((option: Options, index: number) => (
                  <Select.Item
                    key={index}
                    value={option.value.toString()}
                    className="cursor-pointer!"
                  >
                    {option.label}
                  </Select.Item>
                ))}
            </Select.Content>
          </Select.Root>
          <FormFieldError name={field} className="text-red-500" />
        </div>
      )}

      {type === "selectoption" && (
        <div className="flex flex-col gap-2">
          {label && (
            <Text className="text-sm mb-1" weight="medium">
              {label}
            </Text>
          )}
          <div className="flex gap-2 flex-wrap">
            {options.map((option: Options, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => form.setValue(field, option.value)}
                className={`px-4 py-1.5 text-sm rounded-full cursor-pointer border-[#D0DAEE] border-[0.5px] ${value === option.value
                  ? "bg-[#3e1406] text-white"
                  : "bg-[#F2F2F3] text-gray-700 "
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <FormFieldError name={field} className="text-red-500" />
        </div>
      )}
    </>
  );
};

export { SelectDropdown };
