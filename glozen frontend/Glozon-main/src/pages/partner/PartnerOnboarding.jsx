import { useParams } from "react-router-dom";

export default function PartnerOnboarding() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-zinc-50 p-10">
      <h1 className="text-3xl font-bold">
        Partner Onboarding
      </h1>

      <p className="mt-4">
        Partner: {slug}
      </p>
    </div>
  );
}