import AdminDeviceGuard from '@/components/admin/AdminDeviceGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminDeviceGuard />
      {children}
    </>
  );
}
