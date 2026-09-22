import { Flex, Heading } from "@radix-ui/themes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BackButtonProps {
  url?: string;
}

const BackButton = ({ url = "/" }: BackButtonProps) => {
  return (
    <div>
      <Flex gap="3" align="center" mb="6">
        <Link href={url}>
          <ArrowLeft className="cursor-pointer text-xl text-[#ac004d]" />
        </Link>
        <Heading size="4">Back</Heading>
      </Flex>
    </div>
  );
};

export default BackButton;
