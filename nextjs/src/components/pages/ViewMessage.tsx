/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Box, VStack, HStack, Center,
  Badge,
  Button,
  Heading,
  Text
} from '@chakra-ui/react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMessage } from '@/models/Message';
import { Toaster, toaster } from '@/components/ui/toaster';
import AlertModalDialog from '../modal/AlertDialog';
import MessageContentTile from '../tiles/MessageContent';


const showToastError = (title: string) =>
  toaster.create({
    title,
    type: 'error',
    duration: 5000,
    closable: true
  });


// MEMO
interface LEmojiPickerWrapperProps {
  onEmojiClick: (emojiData: EmojiClickData) => void;
}
const LEmojiPickerWrapper = memo(({ onEmojiClick }: LEmojiPickerWrapperProps) => (
  <EmojiPicker
    onEmojiClick={onEmojiClick}
    lazyLoadEmojis
    width="-webkit-fill-available"
  />
));
LEmojiPickerWrapper.displayName = 'LEmojiPickerWrapper';


interface ViewMessageProps {
  vtoken: string;
}
export default function ViewMessagePage({ vtoken }: ViewMessageProps) {
  const [message, setMessage] = useState<IMessage | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const content = useMemo<string[] | null>(() => message ? JSON.parse(message.content) : null, [message]);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`/api/message/view/${vtoken}`);
        const result = await res.json();
        if (result.success) {
          setMessage(result.message);
        } else {
          showToastError(result.error || 'Failed to fetch message');
        }
      } catch (err) {
        console.error(err);
        showToastError('An error occurred while fetching the message');
      } finally {
        setLoading(false);
      }
    }; fetchMessage();

    // Warn on reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (vtoken.length > 0) {
        e.preventDefault();
        e.returnValue = '-'; // Required for Chrome to show the warning
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [vtoken]);

  const handleResponse = async () => {
    if (!response || !message) return;
    try {
      console.log(response);
      const res = await fetch(`/api/message/view/${vtoken}`, {
        method: 'POST',
        body: JSON.stringify({ response2Msg: response.trim() }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.success) {
        vtoken = '';  //to prevent handleBeforeUnload
        router.replace('/view/void');
        setLoading(true);
        return;
      } else {
        showToastError(data.error || 'Failed to send response');
      }
    } catch (err) {
      console.error(err);
      showToastError('An error occurred while sending your response');
    }
  };

  if (loading) return <Center>Loading...</Center>;
  if (!message) {
    return (
      <Center>
        <VStack colorPalette="warning">
          <Heading>Message Not Found</Heading>
          <Text>The message you&apos;re trying to view is no longer available.</Text>
          <Button onClick={() => router.push('/')}>Go Back</Button>
        </VStack>
      </Center>
    );
  } else return (
    <Box maxW="xl" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <VStack colorPalette="brand">
        <Heading size="md">Message Content</Heading>
        <MessageContentTile content={content!} />
        <HStack>
          <Text fontSize="sm" color="gray.500">
            Expires at: {new Date(message.expiresAt).toLocaleString()}
          </Text>
        </HStack>
        <VStack>
          <Heading size="sm">Your Response: <Badge variant="outline" size="lg" fontSize="xxx-large">{response}</Badge></Heading>
          <LEmojiPickerWrapper onEmojiClick={(emojiData) => setResponse(emojiData.emoji)} />
          <Button
            colorScheme="teal"
            onClick={() => setIsSending(true)}
            disabled={!response}
            loading={isSending}
          >
            Send Response
          </Button>
        </VStack>
      </VStack>
      {isSending && <AlertModalDialog
        title='Confirm Response'
        message='Proceed with responding? This action can be done ONLY ONCE!'
        isOpen={response !== null}
        onClose={(wasConfirmed) => {
          if (wasConfirmed) { handleResponse(); }
          else setIsSending(false);
        }} />}
      <Toaster />
    </Box>
  );
}
