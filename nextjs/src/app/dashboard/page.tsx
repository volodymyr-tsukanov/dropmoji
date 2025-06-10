/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
import DashboardPage from "@/components/pages/Dashboard";
import ProtectedRoute from "@/components/Protected";
import { Provider } from '@/components/ui/provider';


export default async function Page() {
  return (
    <Provider>
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    </Provider>
  )
}
