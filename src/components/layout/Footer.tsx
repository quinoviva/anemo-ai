import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
                <HeartPulse className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold">Anemo Check</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Helping you stay informed about your health through smart, image-based anemia screening.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-2">
             <h3 className="text-lg font-semibold text-foreground">Disclaimer</h3>
             <p className="text-sm text-muted-foreground">
               Anemo Check is a health-assistive tool, not a medical diagnostic service. Always consult a qualified healthcare provider for professional diagnosis and treatment.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
           <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear() + 1} AnemoCheck. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
