"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/">
          <span>REAL HOME SERVICE</span>
          <small>AHMEDABAD PROPERTY MARKETPLACE</small>
        </Link>
        <nav className="nav-links">
          <Link href="/?type=Buy">Buy</Link>
          <Link href="/?type=Rent">Rent</Link>
          <Link href="/sell">Post Property</Link>
          <Link href="/login">Admin Login</Link>
        </nav>
      </div>
    </header>
  );
}
