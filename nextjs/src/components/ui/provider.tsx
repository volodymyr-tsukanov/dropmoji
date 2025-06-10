/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { themedSystem } from "@/app/theme"


export function Provider(props: ColorModeProviderProps) {
  return (
    <div suppressHydrationWarning>
      <ChakraProvider value={themedSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </div>
  )
}
