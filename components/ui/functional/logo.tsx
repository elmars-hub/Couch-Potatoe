import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={30}
        height={30}
        className="sm:hidden md:flex"
      />
      <span className="text-red-600 uppercase font-bold text-lg leading-7 sm:text-base md:text-2xl md:flex">
        Couch Potato
      </span>
    </div>
  );
};

export default Logo;
