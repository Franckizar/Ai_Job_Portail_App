  import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
  
  export function Footer() {
    return (
      <footer className=" bg-zinc-800 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">J</span>
                </div>
                <span className="text-xl font-medium">JobPortal</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Your gateway to finding the perfect job. Connect with top employers and discover opportunities that match your skills.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">For Job Seekers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-primary">Career Resources</a></li>
                <li><a href="#" className="hover:text-primary">Resume Builder</a></li>
                <li><a href="#" className="hover:text-primary">Salary Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">For Employers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Post a Job</a></li>
                <li><a href="#" className="hover:text-primary">Talent Solutions</a></li>
                <li><a href="#" className="hover:text-primary">Employer Resources</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2025 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }