import Link from 'next/link';

// Header component to display navigation links based on user authentication status
const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'List a New Item', href: '/products/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
  .filter(linkConfig => linkConfig)  // Filter out any undefined links
  // Map over the filtered links to create an array of JSX elements
  // <Link> component is used to create a client-side navigation link
  .map(({ label, href }) => {
    return (
      <li key={href} className="nav-item">
        <Link href={href} className="nav-link">{label}</Link>
      </li>
    );
  });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link className="navbar-brand" href="/">PROVINS</Link>
      
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
