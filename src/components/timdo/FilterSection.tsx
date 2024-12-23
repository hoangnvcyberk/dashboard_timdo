import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

interface FilterSectionProps {
  startDate: string
  endDate: string
  month: string
  year: string
  setStartDate: React.Dispatch<React.SetStateAction<string>>
  setEndDate: React.Dispatch<React.SetStateAction<string>>
  setMonth: React.Dispatch<React.SetStateAction<string>>
  setYear: React.Dispatch<React.SetStateAction<string>>
  onApplyFilters: () => void
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  startDate,
  endDate,
  month,
  year,
  setStartDate,
  setEndDate,
  setMonth,
  setYear,
  onApplyFilters,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isFilterChanged, setIsFilterChanged] = useState(false)

  const defaultStartDate = "2024-12-23"
  const defaultMonth = (new Date().getMonth() + 1).toString()
  const currentYear = new Date().getFullYear()

  const handleResetFilters = () => {
    setStartDate(defaultStartDate)
    setEndDate("")
    setMonth(defaultMonth)
    setYear(currentYear.toString())
    setIsFilterChanged(false)
  }

  useEffect(() => {
    if (
      startDate !== defaultStartDate ||
      endDate !== "" ||
      month !== defaultMonth ||
      year !== currentYear.toString()
    ) {
      setIsFilterChanged(true)
    } else {
      setIsFilterChanged(false)
    }
  }, [startDate, endDate, month, year])

  useEffect(() => {
    setMonth(defaultMonth)
    setYear(currentYear.toString())
  }, [setMonth, setYear])

  return (
    <div className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
        <div className="w-60">
          <Label>Tháng</Label>
          <Select value={month} onValueChange={(value) => setMonth(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tháng" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {new Date(0, index).toLocaleString("default", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-60">
          <Label>Năm</Label>
          <Select value={year} onValueChange={(value) => setYear(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn năm" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(5)].map((_, index) => {
                const yearOption = currentYear + index
                return (
                  <SelectItem key={yearOption} value={yearOption.toString()}>
                    {yearOption}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end justify-start">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            {showAdvancedFilters ? "Ẩn Lọc Nâng Cao" : "Hiện Lọc Nâng Cao"}
          </Button>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
          <div>
            <Label>Ngày Bắt Đầu</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={defaultStartDate}
              className="w-60"
            />
          </div>

          <div>
            <Label>Ngày Kết Thúc</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-60"
            />
          </div>

          {isFilterChanged && (
            <div className="flex items-end gap-2">
              <Button
                onClick={onApplyFilters}
                className={`${!isFilterChanged ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Áp Dụng
              </Button>
              <Button
                variant="secondary"
                onClick={handleResetFilters}
                className={`${!isFilterChanged ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Làm mới
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
