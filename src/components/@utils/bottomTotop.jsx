import { ActionIcon } from "@mantine/core";
import { IconChevronUp } from "@tabler/icons-react";

export default function BottomToTop({ scrollPosition, viewport }) {
  return (
    <div className="absolute md:right-8 right-3 md:bottom-8 bottom-4 flex flex-col gap-2">
      {scrollPosition.y > 0 && (
        <ActionIcon
          variant="outline"
          radius={"xl"}
          size={"xl"}
          color="gray"
          onClick={() =>
            viewport.current?.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <IconChevronUp size={"2rem"} color="gray" />
        </ActionIcon>
      )}
      {/* {scrollPosition.y <= viewport.current?.scrollHeight && (
        <ActionIcon
          variant="outline"
          radius={"xl"}
          size={"xl"}
          color="gray"
          onClick={() =>
            viewport.current?.scrollTo({
              top: viewport.current?.scrollHeight,
              behavior: "smooth",
            })
          }
        >
          <IconChevronDown size={"2rem"} color="gray" />
        </ActionIcon>
      )} */}
    </div>
  );
}
