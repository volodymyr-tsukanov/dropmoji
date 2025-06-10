/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Button,
  Dialog, Portal
} from '@chakra-ui/react';
import { useState } from 'react';


interface AlertModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: (wasConfirmed: boolean) => void;
}
export default function AlertModalDialog({ title, message, isOpen, onClose }: AlertModalProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog.Root
      placement="top"
      motionPreset="slide-in-top"
      role="alertdialog"
      open={isOpen}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body><p>{message}</p></Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" loading={loading} onClick={() => {
                  onClose(false);
                  setLoading(true);
                }}>Cancel</Button>
              </Dialog.ActionTrigger>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="red" loading={loading} onClick={() => {
                  setLoading(true);
                  onClose(true);
                }}>Confirm</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
