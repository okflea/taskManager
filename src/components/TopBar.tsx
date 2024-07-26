import { ReaderIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"
import { useAuth } from "@/provider/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function TopBar() {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken(null);
    navigate("/", { replace: true });
    toast.success("Logout success")
  }
  const { pathname } = useLocation()

  return (
    <div className="w-full h-[50px] bg-gradient-to-b from-blue-400 to-blue-500 shadow-2xl flex justify-between items-center px-4 ">
      <div className=""><ReaderIcon className="w-5 h-5 text-white" /></div>
      <div>
        {token &&
          <Button variant={"destructive"} onClick={handleLogout} >Logout</Button>
        }
        {
          !token && (

            <div className="space-x-2">
              <Button
                variant={pathname === "/login" ? "ghost" : "secondary"}
                disabled={pathname === "/login"}
                onClick={() => navigate("/login")}
              > Login</Button>
              <Button
                variant={pathname === "/register" ? "ghost" : "secondary"}
                disabled={pathname === "/register"}
                onClick={() => navigate("/register")}
              >Signup</Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default TopBar
