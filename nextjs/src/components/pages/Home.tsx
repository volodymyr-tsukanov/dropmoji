/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useRouter } from "next/navigation"


export default function HomePage() {
  const [viewToken, setViewToken] = useState('')
  const router = useRouter()

  const handleCreate = () => {
    router.push("/auth")
  }
  const handleView = () => {
    const vtoken = viewToken.trim();
    if (vtoken.length < 9) return
    router.push(`/view/${encodeURIComponent(vtoken)}`)
  }

  return (
    <Container maxW="md" py={12}>
      <Stack textAlign="center" colorPalette="brand">
        <Heading as="h1" size="2xl" color="brand.300">
          DropMoji
        </Heading>

        <Text fontSize="lg" color="brand.50">
          Secure one-time emoji messages. Create or view a message below.
        </Text>

        <Stack>
          <Button
            size="lg"
            onClick={handleCreate}
          >
            Create your own message
          </Button>
        </Stack>

        <Box pt={8} colorPalette="accent">
          <Heading as="h2" size="md" mb={4}>
            View a message
          </Heading>

          <Stack direction={{ base: "column", md: "row" }}>
            <Input
              placeholder="Enter view token"
              value={viewToken}
              onChange={(e) => setViewToken(e.target.value)}
            />

            <Button
              onClick={handleView}
            >
              View Message
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
