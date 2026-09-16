import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import PipelinePage from "./pages/PipelinePage";
import TicketDetailPage from "./pages/TicketDetailPage";
import PublicTicketPage from "./pages/PublicTicketPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/public/t/:token" element={<PublicTicketPage />} />
      <Route
        path="/"
        element={
          <MainLayout>
            <PipelinePage />
          </MainLayout>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <MainLayout>
            <TicketDetailPage />
          </MainLayout>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
