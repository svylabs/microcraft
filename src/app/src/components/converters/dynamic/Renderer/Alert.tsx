import React, { ReactNode } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, useMantineTheme } from "@mantine/core";
import { Text, Paper } from "@mantine/core";
import { useEffect } from "react";

interface props {
  message: string | ReactNode;
  isOpened: number;
  setAlertMessage: (message: string) => void;
  setAlertOpen: (isOpened: number) => void;
  addNetwork: () => void;
}

function Alert({
  message,
  isOpened,
  setAlertOpen,
  setAlertMessage,
  addNetwork,
}: props) {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (isOpened !== 0) {
      open();
    } else {
      close();
    }
  }, [isOpened]);

  const handleOpen = () => {
    open();
  };
  const handleClose = () => {
    setAlertOpen(0);
    setAlertMessage("");
    addNetwork();
  };

  return (
    <>
      <Modal
        withCloseButton={true} // to show the close option make it withCloseButton =  true
        opened={opened}
        onClose={handleClose}
        title={"Alert"}
        centered
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
      >
        <Paper shadow="xs" p="md">
          <Text fw={500}>{message}</Text>
          <div style={{ marginTop: "20px", float: "right" }}>
            <Button
              variant="outline"
              radius={5}
              onClick={handleClose}
              color="red.5"
              style={{
                backgroundColor: "transparent",
              }}
            >
              Switch Network
            </Button>
          </div>
        </Paper>
      </Modal>

      {/* <Group position="center">
          <Button onClick={handleOpen}>Open modal</Button>
        </Group> */}
    </>
  );
}

export default Alert;