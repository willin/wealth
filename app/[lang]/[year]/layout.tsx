export default async function BasicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className='flex justify-center mb-10'>
        <ins
          class='adsbygoogle'
          style={{ display: 'block' }}
          data-ad-client='ca-pub-5059418763237956'
          data-ad-slot='9518721243'
          data-ad-format='auto'
          data-full-width-responsive='true'></ins>
      </div>
    </>
  );
}
