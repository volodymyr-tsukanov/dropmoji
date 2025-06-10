'use client'
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton
} from '@chakra-ui/react';
//import { MoonIcon, SunIcon, SearchIcon, LinkIcon, WarningIcon } from '@chakra-ui/icons';


const ThemeShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const colorPalettes = [
    { name: 'Brand (Teal)', colors: ['brand.50', 'brand.100', 'brand.300', 'brand.500', 'brand.700', 'brand.900'] },
    { name: 'Accent (Red)', colors: ['accent.50', 'accent.100', 'accent.300', 'accent.500', 'accent.700', 'accent.900'] },
    { name: 'Warning (Amber)', colors: ['warning.50', 'warning.100', 'warning.300', 'warning.500', 'warning.700', 'warning.900'] },
    { name: 'Success (Green)', colors: ['success.50', 'success.100', 'success.300', 'success.500', 'success.700', 'success.900'] },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start">
            <Heading size="2xl" bgGradient="linear(to-r, brand.400, brand.600)" bgClip="text">
              DropMoji Theme Showcase
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Demonstrating the design system for secure emoji messaging
            </Text>
          </VStack>
          <IconButton
            aria-label="Toggle color mode"
            //icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            //onClick={toggleColorMode}
            variant="ghost"
            size="lg"
          />
        </Flex>

        {/* Color Palettes */}
        <Box>
          <Heading size="lg" mb={6}>Color Palettes</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            {colorPalettes.map((palette) => (
              <Card.Root key={palette.name} variant="elevated">
                <CardHeader>
                  <Heading size="md">{palette.name}</Heading>
                </CardHeader>
                <CardBody>
                  <HStack wrap="wrap">
                    {palette.colors.map((color) => (
                      <Box
                        key={color}
                        w={12}
                        h={12}
                        bg={color}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        position="relative"
                        _hover={{
                          transform: 'scale(1.1)',
                          transition: 'transform 0.2s',
                        }}
                      >
                        <Text
                          position="absolute"
                          bottom="-6"
                          left="50%"
                          transform="translateX(-50%)"
                          fontSize="xs"
                          color="gray.600"
                          whiteSpace="nowrap"
                        >
                          {color.split('.')[1]}
                        </Text>
                      </Box>
                    ))}
                  </HStack>
                </CardBody>
              </Card.Root>
            ))}
          </Grid>
        </Box>

        {/* Button Variants */}
        <Box>
          <Heading size="lg" mb={6}>Button Variants</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
            <Card.Root>
              <CardHeader>
                <Heading size="md">Primary Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack>
                  <Button variant="solid" size="lg" w="full">
                    Create Message
                  </Button>
                  <Button variant="solid" size="md" w="full">
                    Share Link
                  </Button>
                  <Button variant="solid" size="sm" w="full">
                    Copy to Clipboard
                  </Button>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root>
              <CardHeader>
                <Heading size="md">Secondary Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack>
                  <Button variant="ghost" size="lg" w="full">
                    View Messages
                  </Button>
                  <Button variant="ghost" size="md" w="full">
                    Settings
                  </Button>
                  <Button variant="ghost" size="sm" w="full">
                    Help
                  </Button>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root>
              <CardHeader>
                <Heading size="md">Danger Actions</Heading>
              </CardHeader>
              <CardBody>
                <VStack>
                  <Button variant="danger" size="lg" w="full">
                    Delete Account
                  </Button>
                  <Button variant="danger" size="md" w="full">
                    Revoke Link
                  </Button>
                  <Button variant="danger" size="sm" w="full">
                    Clear History
                  </Button>
                </VStack>
              </CardBody>
            </Card.Root>
          </Grid>
        </Box>

        {/* Card Variants */}
        <Box>
          <Heading size="lg" mb={6}>Card Variants</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            <Card.Root variant="message">
              <CardBody>
                <VStack>
                  <Box className="emoji-large">🎉🔥💎</Box>
                  <Text fontSize="sm" color="gray.600">
                    Message Preview Card
                  </Text>
                  <Badge colorScheme="brand">One-time view</Badge>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root variant="warning">
              <CardBody>
                <VStack>
                  <Heading size="md">Security Notice</Heading>
                  <Text fontSize="sm" textAlign="center">
                    This message will self-destruct after viewing
                  </Text>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root>
              <CardHeader>
                <Heading size="md">Standard Card</Heading>
              </CardHeader>
              <CardBody>
                <Text>
                  This is a standard card with glassmorphism effects and hover animations.
                </Text>
              </CardBody>
            </Card.Root>
          </Grid>
        </Box>

        {/* Input Variants */}
        <Box>
          <Heading size="lg" mb={6}>Input Components</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
            <Card.Root>
              <CardHeader>
                <Heading size="md">Form Inputs</Heading>
              </CardHeader>
              <CardBody>
                <VStack>
                  <Input
                    placeholder="Email address"
                    variant="filled"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input placeholder="Search messages..." variant="filled" />
                  <Input placeholder="Password" type="password" variant="filled" />
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root>
              <CardHeader>
                <Heading size="md">Link Display</Heading>
              </CardHeader>
              <CardBody>
                <Box
                  bg="gray.100"
                  border="2px dashed"
                  borderColor="brand.300"
                  borderRadius="md"
                  p={4}
                  fontFamily="mono"
                  fontSize="sm"
                  wordBreak="break-all"
                  _dark={{ bg: "gray.700", borderColor: "brand.400" }}
                >
                  https://dropmoji.app/view/abc123xyz789
                </Box>
                <Button variant="ghost" size="sm" mt={3} w="full">
                  Copy Link
                </Button>
              </CardBody>
            </Card.Root>
          </Grid>
        </Box>

        {/* Typography */}
        <Box>
          <Heading size="lg" mb={6}>Typography Scale</Heading>
          <Card.Root>
            <CardBody>
              <VStack align="start">
                <Heading size="4xl">Heading 4XL - Hero Text</Heading>
                <Heading size="2xl">Heading 2XL - Page Title</Heading>
                <Heading size="xl">Heading XL - Section Header</Heading>
                <Heading size="lg">Heading LG - Card Title</Heading>
                <Heading size="md">Heading MD - Subheading</Heading>
                <Text fontSize="lg">Large body text for emphasis</Text>
                <Text fontSize="md">Regular body text for content</Text>
                <Text fontSize="sm" color="gray.600">Small text for captions</Text>
                <Text fontFamily="mono" fontSize="sm" bg="gray.100" p={2} borderRadius="md">
                  Monospace text for tokens: jwt.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
                </Text>
              </VStack>
            </CardBody>
          </Card.Root>
        </Box>

        {/* Emoji and GIF Showcase */}
        <Box>
          <Heading size="lg" mb={6}>Message Content Display</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
            <Card.Root variant="message">
              <CardBody>
                <VStack spacing={3}>
                  <Text fontSize="sm" color="gray.600">Large Emoji</Text>
                  <Box className="emoji-large">🚀</Box>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root variant="message">
              <CardBody>
                <VStack spacing={3}>
                  <Text fontSize="sm" color="gray.600">Multiple Emojis</Text>
                  <Box className="emoji-large">🎊🎉🥳</Box>
                </VStack>
              </CardBody>
            </Card.Root>

            <Card.Root variant="message">
              <CardBody>
                <VStack>
                  <Text fontSize="sm" color="gray.600">GIF Placeholder</Text>
                  <Box
                    className="gif-container"
                    w="120px"
                    h="90px"
                    bg="gray.200"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="lg"
                  >
                    <Text fontSize="xs" color="gray.500">GIF</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card.Root>
          </Grid>
        </Box>

        {/* Animation Demo */}
        <Box>
          <Heading size="lg" mb={6}>Animation Examples</Heading>
          <Card.Root>
            <CardBody>
              <HStack justify="center">
                <Box
                  className="countdown-pulse"
                  w={16}
                  h={16}
                  bg="accent.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                >
                  5
                </Box>
                <Text>← Countdown pulse animation</Text>
              </HStack>
            </CardBody>
          </Card.Root>
        </Box>

        {/* Modal Demo */}
        <Box>
          <Heading size="lg" mb={6}>Modal Component</Heading>
          <Button variant="solid">
            Open Demo Modal
          </Button>
        </Box>

        {/* Footer */}
        <Text textAlign="center" color="gray.500" fontSize="sm">
          DropMoji Theme Showcase - All components styled with glassmorphism and smooth animations
        </Text>
      </VStack>
    </Container>
  );
};
export default ThemeShowcase;