import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-[#1C1C1E] text-white p-4 border-b border-[#3A3A3C]">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/src/assets/img/StackIT-LOGO.png" alt="StackIt" className="h-10 w-auto" />
        </Link>
        <div className="space-x-4">
          <Link to="/login" className="text-[#8E8E93] hover:text-white px-3 py-2 rounded border border-[#3A3A3C] hover:border-[#FF6B35] hover:bg-[#2C2C2E] transition-all">Login</Link>
          <Link to="/register" className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] px-4 py-2 rounded hover:shadow-lg hover:-translate-y-0.5 transition-all font-semibold">Sign Up</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;