import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

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
    <div className="flex items-center justify-between my-10">
      <Pagination>
        <PaginationContent className="gap-4">
          <PaginationItem>
            <PaginationPrevious
              className={
                activePage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
              onClick={() => activePage > 1 && setActivePage(activePage - 1)}
              aria-disabled={activePage === 1}
            />
          </PaginationItem>

          <div className="text-sm text-muted-foreground">
            Page {activePage} of {totalPages}
          </div>

          <PaginationItem>
            <PaginationNext
              className={
                activePage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
              onClick={() =>
                activePage < totalPages && setActivePage(activePage + 1)
              }
              aria-disabled={activePage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationComponent;
