import { ReactNode } from 'react';

interface props {
   children: ReactNode,
   href?: string,
   onClick?: () => void
}

function Link({
   children,
   href,
   onClick
} : props) {
   return (
      <a href={href} className="inline-block no-underline text-link-text hover:text-link-hover hover:underline cursor-pointer" onClick={onClick}>
         {children}
      </a>
   );
}

export default Link;