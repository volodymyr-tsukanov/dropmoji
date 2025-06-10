/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Card, HStack,
  Badge,
  Button
} from '@chakra-ui/react';
import { ReactElement } from 'react';


interface MessageListTileProps {
  content: ReactElement;
  status: ReactElement;
  metadata?: ReactElement;
  onDelete?: () => void;
  onShare?: () => void;
  isDeleting: boolean;
  cantShare: boolean;
  isDisabled: boolean;
  isExpired: boolean;
}
export default function MessageListTile({
  content,
  status,
  metadata,
  onDelete,
  onShare,
  isDeleting = false,
  cantShare,
  isDisabled,
  isExpired,
}: MessageListTileProps) {
  return (
    <Card.Root
      variant="outline"
      width="100%"
      p="1"
      borderWidth="1px" borderRadius="md"
      colorPalette={isExpired ? "orange" : undefined}
      size={isExpired ? "sm" : "md"}>
      <HStack justify="space-between">
        <Card.Title ml="2.5">{content}</Card.Title>
        {status}
      </HStack>
      <Card.Body colorPalette="brand">
        {metadata ? <HStack mt={2}>{metadata}</HStack> : <Badge>Not viewed yet</Badge>}
      </Card.Body>
      <Card.Footer>
        {onDelete && (
          <Button
            variant="solid"
            colorPalette="red"
            size="sm"
            mt={4}
            onClick={onDelete}
            loading={isDeleting}
            disabled={isDisabled}
          >
            Delete
          </Button>
        )}
        {onShare && isExpired===false && (
          <Button
            variant="surface"
            size="sm"
            mt={4}
            onClick={onShare}
            disabled={isDisabled || cantShare}
          >
            Share
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
