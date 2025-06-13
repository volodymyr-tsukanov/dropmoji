/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Flex, Box,
  Text,
  SkeletonCircle
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from 'react';
import { GifImage } from "../modal/GifPicker";
import { IGifRecord } from "@/lib/consts";


interface GifStatus {
  loading: boolean;
  gif: IGifRecord | null;
  error: string | null;
}
interface MessageContentTileProps {
  content: string[];
}
export default function MessageContentTile({ content }: MessageContentTileProps) {
  const [gifStates, setGifStates] = useState<Record<string, GifStatus>>({});

  const fetchGif = useCallback(async (id: string): Promise<IGifRecord | null> => {
    try {
      const response = await fetch(`/api/gif/${id}`, { next: { revalidate: false } });
      const data = await response.json();
      if (data.success && data.data) {
        return data.data as IGifRecord;
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  useEffect(() => {
    const gifIdsToLoad = content.filter(id => id.startsWith('g') && !gifStates[id]);

    if (gifIdsToLoad.length === 0) return;

    gifIdsToLoad.forEach(id => {
      setGifStates(prev => ({
        ...prev,
        [id]: { loading: true, gif: null, error: null }
      }));

      fetchGif(id).then(gif => {
        setGifStates(prev => ({
          ...prev,
          [id]: {
            loading: false,
            gif,
            error: gif ? null : 'Failed to fetch GIF'
          }
        }));
      });
    });
  }, [content, fetchGif, gifStates]);

  if (content.length === 0) return <Text>So empty here…</Text>;

  return (
    <Flex flexWrap="wrap" alignContent="flex-start" maxH="40vh" overflowY="auto">
      {content.map((c, index) => {
        if (c.startsWith('g')) {
          const gifState = gifStates[c];
          if (!gifState || gifState.loading) {
            return (
              <Box key={`mc-${index}`} width="100%">
                <SkeletonCircle colorPalette="success" size="135px" />
              </Box>
            );
          }
          if (gifState.error) {
            return (
              <Box key={`mc-${index}`} width="100%">
                <Text colorPalette="warning">Error: {gifState.error}</Text>
              </Box>
            );
          }
          return (
            <Box key={`mc-${index}`} width="100%">
              <GifImage gif={gifState.gif!} />
            </Box>
          );
        }

        return (
          <Text
            key={`mc-${index}`}
            fontSize="xxx-large"
            margin={0}
            padding={0}
          >
            {c}
          </Text>
        );
      })}
    </Flex>
  );
}
