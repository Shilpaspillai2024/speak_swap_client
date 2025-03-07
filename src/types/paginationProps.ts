export interface PaginationProps{
    currentPage:number;
    totalPages:number;
    onPageChange:(page:number)=>void;
    totalItems?:number;
    itemsPerPage?:number;
}