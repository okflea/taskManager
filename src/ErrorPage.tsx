import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-[400px] ">
      <div className="w-fit flex flex-col items-center justify-center border-2 rounded-lg shadow-lg p-20">
        <h1 className="text-9xl p-4 text-rose-800">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
