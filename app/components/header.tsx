import LocaleSwitch from './locale-switch';
import ThemeSwitch from './theme-switch';
import { LocaleLink } from './link';

export default function MainHeader() {
  return (
    <header className='sticky top-0 flex justify-center w-full z-[9999] opacity-90 hover:opacity-100 bg-base-100 mb-4'>
      <div className='navbar bg-base-100'>
        <div className='navbar-start'>
          <LocaleLink to='/' className='btn btn-ghost normal-case text-xl'>
            Willin Wealth
          </LocaleLink>
        </div>
        <div className='navbar-end'>
          <LocaleSwitch />
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
