import { cookies } from 'next/headers';
import DismissButton from './dismiss-button';

export default function Toast() {
  const cookieStore = cookies();
  const isHidden = cookieStore.get('template-banner-hidden');

  return isHidden ? null : (
    <div className="fixed w-full h-40 z-10 bottom-0 left-0 right-0">
      <div className="w-full h-full bg-gray-50 border-t border-gray-200 flex flex-col items-center justify-center space-y-3 px-5">
        <p className="text-black text-[13px] font-mono w-[304px] h-10 flex items-center justify-center p-3">
          该项目正处于开发阶段 <DismissButton />
        </p>
        <a
          className="text-white text-[13px] font-mono bg-black hover:bg-gray-700 transition-all rounded-md w-[220px] h-10 flex items-center justify-center whitespace-nowrap"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          了解更多
        </a>
      </div>
    </div>
  );
}
