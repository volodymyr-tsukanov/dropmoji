/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Box, VStack, HStack, Spacer,
  Card,
  Badge, Status,
  Icon,
  Text, SkeletonText,
  Button,
} from '@chakra-ui/react';
import { MdSupervisorAccount } from 'react-icons/md';
import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IProtectedPageProps } from '../Protected';
import { IMessage } from '@/models/Message';
import { Toaster, toaster } from '../ui/toaster';
import { SessionManager } from '@/lib/sec/client';
import AlertModalDialog from '../modal/AlertDialog';
import { CInsecureRandInt } from '@/lib/consts';
import MessageListTile from '../tiles/MessageList';
import ShareModalDialog from '../modal/ShareDialog';


enum DashboardPageAction {
  none,
  create, delete
};

const showToastError = (title: string) =>
  toaster.create({
    title: title,
    type: 'error',
    duration: 5000,
    closable: true
  });
const showToastInfo = (title: string, description: string) =>
  toaster.create({
    title,
    description,
    type: 'info',
    duration: 3000,
    closable: true
  });


// MEMO
interface LDashboardHeaderProps {
  userEmail: string;
  onCreate: () => void;
  isCreating: boolean;
}
const LDashboardHeader = memo(({ userEmail, onCreate, isCreating }: LDashboardHeaderProps) => (
  <Card.Root variant="elevated" mb="1.5" position="sticky">
    <Card.Title m={4}>
      <HStack>
        <>Wassup, <Badge variant="subtle" size="md" fontSize="large">{userEmail}</Badge>!</>
        <Spacer />
        <Icon size="2xl" color="tomato"><MdSupervisorAccount /></Icon>
      </HStack>
    </Card.Title>
    <Card.Body alignItems="center">
      <Button
        colorPalette="teal"
        minW="1/4"
        mb="4"
        onClick={onCreate}
        loading={isCreating}
      >
        Create new Message
      </Button>
    </Card.Body>
  </Card.Root>
));
LDashboardHeader.displayName = 'LDashboardHeader';



export default function DashboardPage({ sessionManager }: IProtectedPageProps) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [targetShareUrl, setTargetShareUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<{ action: DashboardPageAction, arg: string }>({ action: DashboardPageAction.none, arg: '' });
  const router = useRouter();

  useEffect(() => {
    if (!sessionManager) {
      router.replace('/auth');
      return;
    }
    const fetchMessages = async () => {
      try {
        const token = sessionManager.token!;
        // Send Draft
        const draft = sessionManager.messageDraft;
        if (draft) {
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
            showToastInfo('Draft Message Created', 'The last drafted message was created');
            setTargetShareUrl(result.message.shareUrl);
          } else {
            sessionManager.messageDraft = draft;
            showToastError('Failed to create drafted Message. Reload the page');
          }
        }
        //Fetch messages
        const response = await fetch('/api/message', {
          headers: {
            Auth: `Bearer ${token}`,
          },
        });
        const manager = new SessionManager(sessionStorage);
        switch (response.status) {
          case 200:
            const data = await response.json();
            setMessages(data.messages);
            return;
          case 401:
            manager.invalidateToken();
            router.replace('/auth');
            return;
        }
      } catch (error) {
        console.error(error);
        showToastError('Error fetching messages');
      } finally {
        setLoading(false);
      }
    }; fetchMessages();
  }, [sessionManager, router]);

  if (!sessionManager) return 'Arr…';
  const token = sessionManager.token;
  const user = sessionManager.user!;


  const handleDelete = async (messageId: string) => {
    try {
      const response = await fetch(`/api/message/${messageId}`, {
        method: 'DELETE',
        headers: {
          Auth: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setMessages(messages.filter((msg) => msg._id !== messageId));
        toaster.create({
          title: 'Message deleted',
          description: 'Your message has been successfully deleted.',
          type: 'success',
          duration: 4000,
          closable: true,
        });
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error(error);
      showToastError('Failed to delete message');
    } finally {
      setStatus({ action: DashboardPageAction.none, arg: '' });
    }
  };

  const handleCreateNewMessage = () => {
    router.push('/dashboard/create');
    setStatus({ action: DashboardPageAction.create, arg: '' });
  };

  if (loading) {
    return (
      <>
        <LDashboardHeader
          userEmail={user.email}
          onCreate={handleCreateNewMessage}
          isCreating={status.action === DashboardPageAction.create} />
        <Box maxW="xl" mx="auto" mt={10} p={6} overflowY="auto" borderWidth="1px" borderRadius="lg">
          <VStack>
            {Array(CInsecureRandInt({ min: 3, max: 9 })).fill(null).map((_, index) => (
              <MessageListTile
                key={index}
                content={<SkeletonText noOfLines={1} width="60%" variant="pulse" />}
                status={
                  <Status.Root colorPalette="gray">
                    <Status.Indicator />
                    <SkeletonText noOfLines={1} width="40px" variant="pulse" />
                  </Status.Root>
                }
                metadata={
                  <>
                    <SkeletonText noOfLines={1} width="50%" variant="shine" />
                    <SkeletonText noOfLines={1} width="30%" variant="shine" />
                  </>
                }
                isDisabled
              />
            ))}
          </VStack>
        </Box>
        <Toaster />
      </>
    );
  }
  return (
    <Box maxH="100vh">
      <LDashboardHeader
        userEmail={user.email}
        onCreate={handleCreateNewMessage}
        isCreating={status.action === DashboardPageAction.create} />
      <Box maxW="xl" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
        <VStack maxH="60vh" overflowY="auto" colorPalette="accent">
          {messages.map((message) => {
            const messageId = message._id as string;
            const messageIsSecret = !message.content.startsWith('[');
            const messageContent = messageIsSecret ? '**Secret 🔐🤫**' : JSON.parse(message.content).join('');
            const messageShareUrl = `${window.location.origin}/view/${message.viewToken}`;
            const messageIsViewed = message.viewedAt !== null;
            const messageIsExpired = new Date(message.expiresAt) < new Date();

            const statusLabel = messageIsViewed
              ? 'Viewed'
              : messageIsExpired
                ? 'Expired'
                : 'Pending';
            const statusColor = messageIsViewed
              ? 'green'
              : messageIsExpired
                ? 'red'
                : 'yellow';
            return (
              <MessageListTile
                key={messageId}
                content={
                  <Text colorPalette={messageContent.startsWith('**') ? 'warning' : undefined} fontSize="xl" fontWeight="bold" overflow="clip">
                    {messageContent}
                  </Text>
                }
                status={
                  <Status.Root colorPalette={statusColor}>
                    <Status.Indicator />
                    {statusLabel}
                  </Status.Root>
                }
                metadata={
                  message.viewedAt ? (
                    <VStack>
                      <Text fontSize="sm">
                        Viewed at: <Badge colorPalette="accent" variant="outline" size="md">{new Date(message.viewedAt).toLocaleString()}</Badge>
                      </Text>
                      {message.response && (
                        <Text key={`mr-${message.response}`}>
                          Responded with: <Badge variant="plain" size="lg" fontSize="xx-large">{message.response}</Badge>
                        </Text>
                      )}
                    </VStack>
                  ) : undefined
                }
                onDelete={() => setStatus({ action: DashboardPageAction.delete, arg: messageId })}
                onShare={() => setTargetShareUrl(messageShareUrl)}
                isDeleting={status.action === DashboardPageAction.delete && status.arg === messageId}
                cantShare={messageIsSecret}
                isDisabled={messageIsViewed}
                isExpired={messageIsExpired}
              />
            );
          })}
        </VStack>
        {status.action === DashboardPageAction.delete && <AlertModalDialog title="Delete Message" message="fr delete?" isOpen={status.action === DashboardPageAction.delete} onClose={(wasConfirmed) => {
          if (wasConfirmed) handleDelete(status.arg);
          else setStatus({ action: DashboardPageAction.none, arg: '' });
        }} />}
        {targetShareUrl && (
          <ShareModalDialog
            shareUrl={targetShareUrl}
            isOpen={targetShareUrl !== null}
            onClose={() => setTargetShareUrl(null)}
          />
        )}
      </Box>
      <Toaster />
    </Box>
  );
};
