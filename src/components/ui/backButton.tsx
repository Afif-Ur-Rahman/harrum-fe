import { Flex, Heading } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  url?: string;
}

const BackButton = ({ url = "/" }: BackButtonProps) => {
  return (
    <div>
      <Flex gap="3" align="center" mb="6">
        <Link href={url}>
          <ArrowLeft className="text-[#ac004d] text-xl cursor-pointer" />
        </Link>
        <Heading size="4">Back</Heading>
      </Flex>
    </div>
  );
};

export default BackButton;
