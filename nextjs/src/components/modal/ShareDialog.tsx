/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Center,
  InputGroup, Input,
  Button, IconButton,
  Dialog, Portal,
  Clipboard, QrCode,
} from '@chakra-ui/react';


interface ShareModalProps {
  shareUrl: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
}
export default function ShareModalDialog({ shareUrl, description, isOpen, onClose }: ShareModalProps) {
  const LUrlCopy = () => (
    <Clipboard.Root value={shareUrl}>
      <Clipboard.Label textStyle="label">Message View Link</Clipboard.Label>
      <InputGroup endElement={<Clipboard.Trigger asChild>
        <IconButton variant="outline" size="xs" me="-1.5">
          <Clipboard.Indicator />
        </IconButton>
      </Clipboard.Trigger>}>
        <Clipboard.Input asChild>
          <Input />
        </Clipboard.Input>
      </InputGroup>
    </Clipboard.Root>
  );
  const LUrlQr = () => (
    <QrCode.Root value={shareUrl} encoding={{ ecc: "Q" }} size="full">
      <QrCode.DownloadTrigger
        asChild
        fileName="dropmoji-msg.png"
        mimeType="image/png">
        <Button variant="ghost" size="xs" mt="3.5">Save</Button>
      </QrCode.DownloadTrigger>
      <QrCode.Frame>
        <QrCode.Pattern />
      </QrCode.Frame>
    </QrCode.Root>
  );

  return (
    <Dialog.Root
      placement="center"
      scrollBehavior="inside"
      motionPreset="scale"
      open={isOpen}>
      <Portal>
        <Dialog.Positioner colorPalette="success">
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Share the Message</Dialog.Title>
              {description && <Dialog.Description colorPalette="accent">{description}</Dialog.Description>}
            </Dialog.Header>
            <Dialog.Body>
              <LUrlCopy />
              <Center><LUrlQr /></Center>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="accent" variant="subtle" onClick={onClose}>Done</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
