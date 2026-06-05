import React from "react";
import { Avatar, Flex, Text } from "@radix-ui/themes";
interface DashboadCardProps {
  image?: string;
  title?: string;
  subtitle?: string;
  radius?: "full" | "large" | "medium" | "small" | "none";
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  className?: string;
}

const ReusableAvatar: React.FC<DashboadCardProps> = ({
  image,
  title,
  radius,
  size,
  className,
  subtitle,
}) => {
  return (
    <Flex gap="3" align="center">
      <Avatar
        size={size || "3"}
        src={image}
        radius={radius || "full"}
        fallback={title?.charAt(0) || ""}
      />
      <Flex direction="column">
        <Text size={"2"} weight="medium" className={className}>
          {title}
        </Text>
        {subtitle && (
          <Text size="1" className="text-muted-foreground">
            {subtitle}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default ReusableAvatar;
