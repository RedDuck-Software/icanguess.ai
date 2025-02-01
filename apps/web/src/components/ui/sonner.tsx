import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light'}
      className="toaster group"
      toastOptions={{
        style: { backgroundImage: "url('/Noise2.png')" },
        classNames: {
          success: 'bg-light-gray',
          loading: 'bg-purple',
          error: 'bg-[#bc544b]',
          toast:
            'group toast  group-[.toaster]:text-dark font-space text-[14px] border  group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
