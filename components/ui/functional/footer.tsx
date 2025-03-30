"use client";

const Footer = () => {
  return (
    <footer className="border-t bg-background/95 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <p className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Created by Elmars
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
