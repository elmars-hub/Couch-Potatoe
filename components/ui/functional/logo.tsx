import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <Image src="/images/logo.png" alt="Logo" width={30} height={30} />
      <span className="text-red-600 uppercase font-bold text-2xl leading-7">
        Couch Potato
      </span>
    </div>
  );
};

export default Logo;
