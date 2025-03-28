import React from "react";

interface PaginationComponentProps {
  activePage: number;
  totalPages: number;
  setActivePage: (page: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  activePage,
  totalPages,
  setActivePage,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 max-w-[250px] my-10">
        <button
          className={`
            px-4 py-2 rounded border 
            ${
              activePage === 1
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100 text-black"
            }
          `}
          onClick={() => setActivePage(activePage - 1)}
          disabled={activePage === 1}
        >
          Prev
        </button>
        <button
          className={`
            px-4 py-2 rounded border 
            ${
              activePage === totalPages
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-white hover:bg-gray-100 text-black"
            }
          `}
          onClick={() => setActivePage(activePage + 1)}
          disabled={activePage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="flex gap-1">
        <span>{activePage}</span>
        <span>of</span>
        <span>{totalPages}</span>
      </div>
    </div>
  );
};

export default PaginationComponent;
