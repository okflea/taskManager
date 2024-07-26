import AuthProvider from "./provider/AuthProvider";
import { QueryProvider } from "./provider/QueryProvider";
import Routes from "./routes";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
