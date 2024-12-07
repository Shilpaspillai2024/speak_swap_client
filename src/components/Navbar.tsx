import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-1 bg-customBlue">
      {/* logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/assets/speaklogo.png"
            alt="speak_swap_logo"
            width={70}
            height={50}
          />
        </Link>

        <div className="flex space-x-6 text-customTeal ml-12 font-bold">
          <Link href="/about">About Us</Link>
          <Link href="/tutor">Become A Tutor</Link>
          <Link href="/tutor_market">Find Tutor</Link>
        </div>
      </div>

      <div className="flex space-x-6 text-customTeal mr-10 font-bold">
        <Link href="/signup">Signup</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
};

export default Navbar;
