"use client";
import { usePersistStore } from "@/store/presistStore";
import { Avatar, DropdownMenu, Flex } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { MdArrowDropDown } from "react-icons/md";

function ProfileDropMenu({
  logout,
  url,
}: {
  logout?: () => void;
  url: string;
}) {
  const { user } = usePersistStore();

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="outline-none">
          <Link href="">
            <Flex gap="2" align="center">
              <Avatar
                size="2"
                src={user?.image}
                radius="full"
                fallback={user?.username?.[0] || "👤"}
                className="bg-green-300"
              />
              <MdArrowDropDown size="1.3rem" color="black" />
            </Flex>
          </Link>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          variant="soft"
          color="indigo"
          className="min-w-28!"
        >
          <Link href={`/${url}/profile`}>
            <DropdownMenu.Item className="cursor-pointer! flex! justify-center!">
              Profile
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="cursor-pointer! flex! justify-center! bg-red-400! text-white!"
            onClick={logout}
          >
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

export default ProfileDropMenu;