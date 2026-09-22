import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { XIcon } from "lucide-react";

import { cn } from "@/utils";

const CloseDialogIcon = () => (
  <Dialog.Close className="absolute top-2 right-3 cursor-pointer">
    <Flex
      align="center"
      justify="center"
      className="text-gray-11 hover:bg-gray-3 h-8.75 w-8.75 rounded-full transition-colors"
    >
      <XIcon width={20} height={20} strokeWidth={1.5} />
    </Flex>
  </Dialog.Close>
);

const DialogTitle = ({ className, ...rest }: React.ComponentProps<typeof Text>) => (
  <Dialog.Title>
    <Text
      className={cn("text-accent-12 mb-7 block font-sans text-[22px] sm:text-[26px]", className)}
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
