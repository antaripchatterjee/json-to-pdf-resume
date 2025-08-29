// Loading.jsx
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
      <ArrowPathIcon className="h-8 w-8 animate-spin mb-2 text-blue-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
