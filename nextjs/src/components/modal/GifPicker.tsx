/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Box, Grid, VStack, HStack,
  InputGroup, Input,
  Spinner,
  Text,
  Button, IconButton,
  Image,
  Badge,
} from '@chakra-ui/react';

import { useState, useEffect, useCallback, useRef } from 'react';
import { IGifRecord } from '@/lib/consts';
import { Toaster, toaster } from '@/components/ui/toaster';


export const GifImage = ({ gif }: { gif: IGifRecord }) =>
(<Image
  src={gif.previewUrl || gif.url}
  alt={gif.title || 'GIF'}
  w="full"
  h="full"
  objectFit="cover"
  loading="lazy"
  onError={(e) => {
    // Fallback to main URL if preview fails
    const img = e.target as HTMLImageElement;
    if (img.src !== gif.url)
      img.src = gif.url;
  }} />);


interface GifPickerProps {
  token: string;
  onGifSelect: (gif: IGifRecord) => void;
  onClose?: () => void;
  isOpen?: boolean;
  maxHeight?: string;
}
export default function GifPicker({
  token, onGifSelect, onClose, isOpen = true, maxHeight = '400px'
}: GifPickerProps) {
  const [gifs, setGifs] = useState<IGifRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  // initialize as null, use browser setTimeout return type
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch trending GIFs
  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gif', {
        headers: {
          Auth: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 * 4 }  //4m
      });
      const data = await response.json();

      if (data.success) {
        setGifs(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch trending GIFs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load GIFs';
      setError(errorMessage);
      toaster.create({
        type: 'error',
        title: 'Error loading GIFs',
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [token]);
  // Search GIFs
  const searchGifs = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchTrending();
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      const response = await fetch(`/api/gif?q=${encodeURIComponent(query)}`, {
        headers: {
          Auth: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }
      });
      const data = await response.json();
      if (data.success) {
        setGifs(data.data);
        if (data.data.length === 0) {
          setError(`No GIFs found for "${query}"`);
        }
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      toaster.create({
        type: 'error',
        title: 'Search failed',
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsSearching(false);
    }
  }, [fetchTrending, token]);

  // Handle search input with debouncing
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Clear existing timeout
    if (searchTimeoutRef.current)
      clearTimeout(searchTimeoutRef.current);
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchGifs(value);
    }, 1500);
  };
  // Clear search and return to trending
  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchTimeoutRef.current)
      clearTimeout(searchTimeoutRef.current);
    fetchTrending();
  };
  // Handle GIF selection
  const handleGifClick = (gif: IGifRecord) => {
    setSelectedGif(gif.id);
    // Add a small delay for visual feedback
    setTimeout(() => {
      onGifSelect(gif);
      setSelectedGif(null);
    }, 150);
  };

  // Load trending GIFs on mount
  useEffect(() => {
    if (isOpen) {
      fetchTrending();
    }
    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current)
        clearTimeout(searchTimeoutRef.current);
    };
  }, [isOpen, fetchTrending]);

  if (!isOpen) return null;

  return (
    <Box
      bg="whiteAlpha.100"
      backdropFilter="blur(20px)"
      border="1px solid"
      borderColor="whiteAlpha.300"
      borderRadius="xl"
      p={4}
      maxH={maxHeight}
      w="full"
      maxW="500px"
      boxShadow="xl"
    >
      <VStack align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold" color="brand.600">
            {searchQuery ? `Search: "${searchQuery}"` : 'Trending GIFs'}
          </Text>
          {onClose && (
            <IconButton
              aria-label="Close GIF picker"
              size="sm"
              variant="ghost"
              onClick={onClose} />
          )}
        </HStack>

        {/* Search Input */}
        <HStack>
          <Input
            placeholder="Search for GIFs..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            variant="flushed"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
            _focus={{ bg: "whiteAlpha.300", borderColor: "brand.500" }} />

          {searchQuery && (
            <IconButton
              aria-label="Clear search"
              size="sm"
              variant="ghost"
              onClick={handleClearSearch} />
          )}

          <IconButton
            aria-label="Refresh GIFs"
            size="sm"
            variant="ghost"
            onClick={searchQuery ? () => searchGifs(searchQuery) : fetchTrending}
            loading={loading || isSearching} />
        </HStack>

        {/* Content Area */}
        <Box
          maxH="300px"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
            },
          }}
        >
          {/* Loading State */}
          {(loading || isSearching) && (
            <VStack py={8}>
              <Spinner size="lg" color="brand.500" />
              <Text color="gray.500">
                {isSearching ? 'Searching...' : 'Loading trending GIFs...'}
              </Text>
            </VStack>
          )}

          {/* Error State */}
          {error && !loading && !isSearching && (
            <VStack py={8}>
              <Text color="gray.500" textAlign="center">
                {error}
              </Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={searchQuery ? () => searchGifs(searchQuery) : fetchTrending}
              >
                Try Again
              </Button>
            </VStack>
          )}

          {/* GIF Grid */}
          {!loading && !isSearching && !error && gifs.length > 0 && (
            <Grid
              templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
              gap={2}
              py={2}
            >
              {gifs.map((gif) => (
                <Box
                  key={gif.id}
                  position="relative"
                  aspectRatio="1"
                  borderRadius="md"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'lg',
                    zIndex: 2,
                  }}
                  _active={{
                    transform: 'scale(0.95)',
                  }}
                  onClick={() => handleGifClick(gif)}
                  bg="gray.100"
                  _dark={{ bg: "gray.700" }}
                >
                  {/* Selection Overlay */}
                  {selectedGif === gif.id && (
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      bottom={0}
                      bg="brand.500"
                      opacity={0.7}
                      zIndex={1}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Spinner color="white" size="sm" />
                    </Box>
                  )}
                  <GifImage gif={gif} />
                </Box>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && !isSearching && !error && gifs.length === 0 && (
            <VStack py={8}>
              <Text color="gray.500" textAlign="center">
                No GIFs available
              </Text>
              <Button
                size="sm"
                variant="ghost"
                onClick={fetchTrending}
              >
                Load Trending
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
      {/* Footer Info */}
      {!loading && !isSearching && gifs.length > 0 && (
        <HStack justify="space-between" pt={2} borderTop="1px solid" borderColor="whiteAlpha.200">
          <Text fontSize="xs" color="gray.500">
            {gifs.length} GIFs loaded
          </Text>
          <HStack fontSize="xs" color="gray.500">
            {/*<Badge colorScheme="purple" variant="outline" size="xs">GIPHY</Badge>*/}
            <Badge colorScheme="blue" variant="outline" size="xs">Powered by Tenor</Badge>
          </HStack>
        </HStack>
      )}
      <Toaster />
    </Box>);
}
