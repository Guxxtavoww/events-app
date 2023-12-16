import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function Layout({ children }: WithChildren) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
