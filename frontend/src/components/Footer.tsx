import React from 'react';

const Footer = () => (
  <footer className="bg-white shadow mt-8 py-4 text-center text-red-600 border-t !sticky !bottom-0">
    &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
  </footer>
);

export default Footer;
