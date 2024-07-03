import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Group, useMantineTheme } from "@mantine/core";
import { Text, Paper } from "@mantine/core";

interface Props {
  message: string;
  isOpened: boolean;
  setAlertOpen: (isOpened: boolean) => void;
  // addNetwork: () => void;
}

const Alert: React.FC<Props> = ({ message, isOpened, setAlertOpen }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (isOpened) {
      open();
    } else {
      close();
    }
  }, [isOpened]);

  const handleClose = () => {
    setAlertOpen(false);
    // addNetwork();
  };

  return (
    <Modal
      withCloseButton={true}
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
  );
};

export default Alert;
