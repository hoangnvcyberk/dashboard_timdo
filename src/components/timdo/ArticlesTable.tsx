import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ArticleData, PaginationInfo } from "./ArticleList"
import { convertToVnd } from "@/helpers/convertToVnd"
import { useState } from "react"

interface ArticlesTableProps {
  articles: ArticleData[]
  pagination: PaginationInfo
  handlePageChange: (newPage: number) => void
}

export const ArticlesTable: React.FC<ArticlesTableProps> = ({
  articles,
  pagination,
  handlePageChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Article ID</TableHead>
            <TableHead>Fee Level ID</TableHead>
            <TableHead>Payment Receipt</TableHead>
            <TableHead>Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.map((article, index) => (
            <TableRow key={index}>
              <TableCell>{article.userId}</TableCell>
              <TableCell>{article.articleId}</TableCell>
              <TableCell>{article.feeLevelId}</TableCell>
              <TableCell>
                {article.paymentReceiptImageUrl ? (
                  <div
                    className="inline-block w-12 h-12 border border-gray-300 rounded-md overflow-hidden cursor-pointer"
                    onClick={() =>
                      handleImageClick(article.paymentReceiptImageUrl)
                    }
                  >
                    <img
                      src={article.paymentReceiptImageUrl}
                      alt="Payment Receipt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  "No Receipt"
                )}
              </TableCell>

              {isModalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                  <div className="relative bg-white rounded-lg max-w-full max-h-full overflow-hidden">
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 text-white text-3xl bg-red-600 p-2 rounded-full border-2 border-white shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                    >
                      ×
                    </button>
                    <img
                      src={selectedImage}
                      alt="Payment Receipt"
                      className="max-w-full max-h-screen object-contain p-2"
                    />
                  </div>
                </div>
              )}
              <TableCell>{convertToVnd(article.totalRevenue)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.totalCount)}{" "}
          of {pagination.totalCount} entries
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() =>
                  pagination.page > 1 && handlePageChange(pagination.page - 1)
                }
                aria-disabled={pagination.page === 1}
                className={`${
                  pagination.page === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            </PaginationItem>
            {[...Array(pagination.totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={pagination.page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`${
                    pagination.page === i + 1
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  pagination.page < pagination.totalPages &&
                  handlePageChange(pagination.page + 1)
                }
                aria-disabled={pagination.page === pagination.totalPages}
                className={`${
                  pagination.page === pagination.totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}
