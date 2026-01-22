import Loader from "@/components/Loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-blue-50 z-50">
      <Loader />
    </div>
  );
}
