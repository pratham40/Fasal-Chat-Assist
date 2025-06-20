import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <AiOutlineLoading className="animate-spin text-4xl text-gray-500" />
    </div>
  );
}