import { cn } from "@/utils";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { XIcon } from "lucide-react";

const CloseDialogIcon = () => (
  <Dialog.Close className="absolute right-3 top-2 cursor-pointer">
    <Flex
      align="center"
      justify="center"
      className="rounded-full h-8.75 w-8.75 text-gray-11 transition-colors hover:bg-gray-3"
    >
      <XIcon width={20} height={20} strokeWidth={1.5} />
    </Flex>
  </Dialog.Close>
);

const DialogTitle = ({
  className,
  ...rest
}: React.ComponentProps<typeof Text>) => (
  <Dialog.Title>
    <Text
      className={cn(
        "mb-7 block font-sans text-[22px] text-accent-12 sm:text-[26px]",
        className
      )}
      {...rest}
    />
  </Dialog.Title>
);

const CancelDialogButton = (props: React.ComponentProps<typeof Button>) => (
  <Dialog.Close>
    <Button size="4" variant="outline" highContrast {...props}>
      Cancel
    </Button>
  </Dialog.Close>
);

export { DialogTitle, CloseDialogIcon, CancelDialogButton };
