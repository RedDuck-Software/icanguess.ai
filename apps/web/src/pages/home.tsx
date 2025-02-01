import { useBackendAuth } from '@/hooks/auth/useAuth.ts';

export default function Home() {
  const { data, mutateAsync } = useBackendAuth();
  return (
    <div className="flex h-screen items-center justify-center text-4xl">
      {data}
      <button onClick={() => mutateAsync()}>asd</button>
    </div>
  );
}
