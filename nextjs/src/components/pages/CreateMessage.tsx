/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Box, Stack, VStack, HStack, Flex, Center, Grid,
  Card, Icon,
  Heading,
  Button,
  Switch, SwitchCheckedChangeDetails,
  Slider, SliderValueChangeDetails,
} from '@chakra-ui/react';
import { MdSecurity } from 'react-icons/md';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IGifRecord } from '@/lib/consts';
import { IProtectedPageProps } from '../Protected';
import { Toaster, toaster } from '@/components/ui/toaster';
import ShareModalDialog from '../modal/ShareDialog';
import GifPicker from '../modal/GifPicker';
import MessageContentTile from '../tiles/MessageContent';


const showToastError = (title: string) =>
  toaster.create({
    title,
    type: 'error',
    duration: 5000,
    closable: true
  });
const showToastInfo = (title: string, description: string) =>
  toaster.create({
    title,
    description,
    type: 'info',
    duration: 2400,
    closable: false
  });


// MEMO
const MEmojiPickerWrapper = memo(({ onEmojiClick }: {
  onEmojiClick: (emojiData: EmojiClickData) => void;
}) => (
  <EmojiPicker
    onEmojiClick={onEmojiClick}
    lazyLoadEmojis
    width="-webkit-fill-available"
  />
)); MEmojiPickerWrapper.displayName = 'MEmojiPickerWrapper';
const MGifPickerWrapper = memo(({ token, onGifSelect }: {
  token: string;
  onGifSelect: (gif: IGifRecord) => void;
}) => (
  <GifPicker token={token} onGifSelect={onGifSelect} />
)); MGifPickerWrapper.displayName = 'MGifPickerWrapper';
const LMsgContent = memo(({ token, content, onEmojiClick, onGifSelect }: {
  token: string;
  content: string[];
  onEmojiClick: (emojiData: EmojiClickData) => void;
  onGifSelect: (gif: IGifRecord) => void;
}) => (
  <Card.Root mx="auto">
    <Card.Title fontSize="larger">Message content:</Card.Title>
    <Card.Body>
      <MessageContentTile content={content} />
      <Center>
        <MEmojiPickerWrapper onEmojiClick={onEmojiClick} />
        <MGifPickerWrapper token={token} onGifSelect={onGifSelect} />
      </Center>
    </Card.Body>
  </Card.Root>
)); LMsgContent.displayName = 'LMsgContent';

const MMsgOptions = memo(({ expiresIn, handleExpiresInChange, isSecret, handleIsSecretChange }: {
  expiresIn: number[];
  handleExpiresInChange: (details: SliderValueChangeDetails) => void;
  isSecret: boolean;
  handleIsSecretChange: (details: SwitchCheckedChangeDetails) => void;
}) => {
  const expiresInMarks = [
    { value: 1, label: "1h" },
    { value: 6, label: "" },
    { value: 12, label: "" },
    { value: 24, label: "1d" },
    { value: 48, label: "2d" },
    { value: 72, label: "3d" },
    { value: 96, label: "4d" },
    { value: 120, label: "5d" },
    { value: 144, label: "6d" },
    { value: 168, label: "7d" }
  ];
  return (<HStack colorPalette="accent">
    <Slider.Root
      size="sm"
      width="2/3"
      textJustify="inter-word"
      max={168}
      min={1}
      step={6}
      value={expiresIn}
      onValueChange={handleExpiresInChange}>
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb index={0}>
          <Slider.DraggingIndicator
            layerStyle="fill.muted"
            top="-7">
            <Slider.ValueText />h
          </Slider.DraggingIndicator>
        </Slider.Thumb>
        <Slider.Marks marks={expiresInMarks} />
      </Slider.Control>
      <Slider.Label > – expires after</Slider.Label>
    </Slider.Root>
    <Switch.Root
      variant="solid"
      size="sm"
      checked={isSecret}
      onCheckedChange={handleIsSecretChange}>
      <Switch.HiddenInput />
      <Switch.Control>
        <Switch.Thumb>
          <Switch.ThumbIndicator>
            <Icon color="black"><MdSecurity /></Icon>
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>
      <Switch.Label fontSize="md">{isSecret ? 'Secret' : 'Ordinary'}</Switch.Label>
    </Switch.Root>
  </HStack>);
}); MMsgOptions.displayName = 'MMsgOptions';


export default function CreateMessagePage({ sessionManager }: IProtectedPageProps) {
  const [content, setContent] = useState<string[]>([]);
  const [expiresIn, setExpiresIn] = useState<number[]>([24]);
  const [isSecret, setIsSecret] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleEmojiClick = useCallback((emojiData: EmojiClickData) => {
    if (content.length >= 100) {
      showToastInfo('Limit reached', 'You can only add up to 100 emojis.');
      return;
    }
    setContent((prev) => [...prev, emojiData.emoji]);
  }, [content]);
  const handleGifSelect = useCallback((gif: IGifRecord) => {
    if (content.length >= 100) {
      showToastInfo('Limit reached', 'You can only add up to 100 emojis.');
      return;
    }
    setContent((prev) => [...prev, gif.id]);  //?
  }, [content]);
  const handleExpiresInChange = useCallback(
    (details: SliderValueChangeDetails) => setExpiresIn(details.value),
    []
  );

  if (!sessionManager || !sessionManager.token) {
    router.replace('/auth');
    return
  }
  const token = sessionManager.token;

  const handleSubmit = async () => {
    if (isSubmitting === true) return;
    if (content.length === 0) {
      showToastInfo('Empty Message', 'Please select at least one emoji.');
      return;
    }
    setIsSubmitting(true);
    try {
      const draft = JSON.stringify({
        content: content,
        expiresIn: expiresIn[0].toFixed(0),
        secrecy: isSecret ? 1 : 0
      });
      sessionManager.messageDraft = draft;
      const res = await fetch('/api/message', {
        method: 'POST',
        headers: {
          Auth: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: draft,
      });

      const result = await res.json();
      if (result.success) {
        toaster.create({
          title: 'Message Created',
          description: 'Your message link is ready!',
          type: 'success',
          duration: 1900,
          closable: true,
        });
        const _draft = sessionManager.messageDraft; //removes draft
        setShareUrl(`${window.location.origin}/view/${result.message.vtoken}`);
      } else if (res.status === 401) {
        sessionManager.invalidateToken();
        router.replace('/auth');
        return;
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error(err);
      showToastError(err.message || 'Unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={8}
      maxW={{ base: '100%', md: '2xl', lg: '4xl' }}
      mx="auto"
      colorPalette="brand"
    >
      <Heading mb={6} fontSize={{ base: '2xl', md: '3xl' }}>Create new Drop</Heading>
      <Stack>
        {/* Content Input Area */}
        <Card.Root>
          <Card.Title fontSize="lg">Message content:</Card.Title>
          <Card.Body>
            <MessageContentTile content={content} />

            {/* Emoji & GIF Picker Layout */}
            <Grid
              templateColumns={{ base: '1fr', md: '1fr 1fr' }}
              gap={4}
              mt={4}
              alignItems="start"
            >
              <Box overflow="hidden">
                <MEmojiPickerWrapper onEmojiClick={handleEmojiClick} />
              </Box>
              <Box overflow="hidden">
                <MGifPickerWrapper token={token} onGifSelect={handleGifSelect} />
              </Box>
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Message Options */}
        <MMsgOptions
          expiresIn={expiresIn}
          handleExpiresInChange={handleExpiresInChange}
          isSecret={isSecret}
          handleIsSecretChange={(e) => setIsSecret(e.checked)} />

        {/* Submit Button */}
        <Flex justify="flex-end" colorPalette="accent">
          <Button
            variant="solid"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={shareUrl !== null}
          >
            Create Message
          </Button>
        </Flex>

        {/* Share Modal */}
        {shareUrl && (
          <ShareModalDialog
            shareUrl={shareUrl}
            description={isSecret ? 'Save this link now, you won’t be able to see it again later' : undefined}
            isOpen={true}
            onClose={() => {
              router.replace('/dashboard');
              setShareUrl(null);
              setIsSubmitting(true);
            }}
          />
        )}
      </Stack>

      <Toaster />
    </Box>
  );
}
