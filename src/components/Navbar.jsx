import { Search, Menu, LogOut, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Navbar({ searchTerm, setSearchTerm }) {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ChefHat className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CVT</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "Summary", "Polls"].map((item) => (
              <a key={item} href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{item}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input type="search" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {["Profile", "Settings"].map((option) => (
                  <a key={option} href="#" className="block px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">{option}</a>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon"><LogOut className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
