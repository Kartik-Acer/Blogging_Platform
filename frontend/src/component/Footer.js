import { PenTool, Github, Twitter, Linkedin } from "lucide-react"
import "../styles/Footer.css"
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <PenTool className="mr-2" style={{ width: "2rem", height: "2rem", color: "#60a5fa" }} />
              <span className="text-2xl font-bold">BlogHub</span>
            </div>
            <p className="text-gray-400 mb-4">
              A platform for writers and readers to connect, share stories, and explore diverse perspectives from around
              the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github style={{ width: "1.25rem", height: "1.25rem" }} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter style={{ width: "1.25rem", height: "1.25rem" }} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin style={{ width: "1.25rem", height: "1.25rem" }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/create-blog" className="text-gray-400 hover:text-white transition-colors">
                  Write Blog
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-white transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/?category=Technology" className="text-gray-400 hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="/?category=Travel" className="text-gray-400 hover:text-white transition-colors">
                  Travel
                </a>
              </li>
              <li>
                <a href="/?category=Food" className="text-gray-400 hover:text-white transition-colors">
                  Food
                </a>
              </li>
              <li>
                <a href="/?category=Lifestyle" className="text-gray-400 hover:text-white transition-colors">
                  Lifestyle
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2025 BlogHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
