import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { WebSocketProvider } from "./context/WebSocketContext";
import AppContent from "./AppContent";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WebSocketProvider>
                <ReactQueryDevtools />
                <AppContent />
            </WebSocketProvider>
        </QueryClientProvider>
    );
}

export default App;
