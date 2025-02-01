import { Card } from '../ui/card';

export const Header = () => {
  return (
    <Card
      variant={'dark'}
      radius={8}
      className="items-center justify-between px-5"
    >
      <h1 className="font-space text-2xl">icanguess.ai</h1>
    </Card>
  );
};
