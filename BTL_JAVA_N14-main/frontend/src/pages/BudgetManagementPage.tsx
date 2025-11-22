import { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import { Search, Edit, Delete } from "@mui/icons-material";
import DashboardLayout from "../components/DashboardLayout";
import axios from "axios";

// Cấu hình Base URL
const API_BASE_URL = "http://localhost:8080/api";

interface Budget {
  id: number;
  category: string;
  limitAmount: number;
  spent: number; // Backend tự tính từ Transaction và gửi về
  month: string;
  // ĐÃ XÓA walletId
}

const BudgetManagementPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // State lọc theo tháng (Mặc định là tháng hiện tại YYYY-MM)
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // Form dữ liệu (Đã bỏ walletId)
  const [formData, setFormData] = useState({
    category: "",
    limitAmount: 0,
    month: "",
  });

  useEffect(() => {
    fetchBudgets();
    // Không cần fetchWallets nữa
  }, [currentMonth]);

  // --- 1. LẤY DỮ LIỆU ---
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/budgets`, {
        params: {
          userId: 1,
          month: currentMonth
        }
      });
      setBudgets(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải ngân sách:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. XỬ LÝ FORM ---
  const handleOpenAdd = () => {
    setEditingBudget(null);
    setFormData({
      category: "",
      limitAmount: 0,
      month: currentMonth, // Mặc định lấy tháng đang chọn
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limitAmount: budget.limitAmount,
      month: budget.month,
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!formData.category || !formData.limitAmount) {
      alert("⚠️ Vui lòng nhập tên danh mục và hạn mức!");
      return;
    }

    const payload = {
      category: formData.category,
      limitAmount: formData.limitAmount,
      month: formData.month,
      userId: 1
      // KHÔNG GỬI walletId nữa
    };

    try {
      if (editingBudget) {
        await axios.put(`${API_BASE_URL}/budgets/${editingBudget.id}`, payload);
        alert("Cập nhật thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/budgets`, payload);
        alert("Tạo ngân sách thành công!");
      }

      setOpenDialog(false);
      fetchBudgets();
    } catch (err) {
      console.error("❌ Lỗi khi lưu:", err);
      alert("Đã xảy ra lỗi!");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa ngân sách này không?")) {
      try {
        await axios.delete(`${API_BASE_URL}/budgets/${id}`);
        fetchBudgets();
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  // --- 3. HELPER FORMAT ---
  const formatCurrency = (amount: number | undefined | null) => {
    const value = amount || 0;
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const filteredBudgets = budgets.filter((b) =>
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#2E5B47" }}>
          Quản lý ngân sách:
        </Typography>

        {/* Toolbar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
                placeholder="Tìm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Search sx={{ color: "#6B8E7F" }} />
                    </InputAdornment>
                ),
                }}
                sx={{
                minWidth: "200px",
                "& .MuiOutlinedInput-root": { borderRadius: "25px", backgroundColor: "#fff" },
                }}
            />
            <TextField
                type="month"
                size="small"
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleOpenAdd}
            sx={{
              backgroundColor: "#6B8E7F",
              color: "#fff",
              borderRadius: "25px",
              textTransform: "none",
              "&:hover": { backgroundColor: "#2E5B47" },
            }}
          >
            + Tạo ngân sách mới
          </Button>
        </Box>

        {/* Bảng dữ liệu */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#6B8E7F" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Danh mục</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Hạn mức</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Đã chi (Tự động)</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Còn lại</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Tháng</TableCell>
                {/* ĐÃ XÓA CỘT VÍ */}
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">⏳ Đang tải dữ liệu...</TableCell>
                </TableRow>
              ) : filteredBudgets.length > 0 ? (
                filteredBudgets.map((b) => {
                  const limit = b.limitAmount || 0;
                  const spent = b.spent || 0;
                  const remaining = limit - spent;

                  return (
                    <TableRow key={b.id} hover>
                      <TableCell>{b.category}</TableCell>
                      <TableCell>{formatCurrency(limit)}</TableCell>
                      <TableCell sx={{ color: '#f44336', fontWeight: 500 }}>
                        {formatCurrency(spent)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: remaining < 0 ? "#d32f2f" : "#2E7D32",
                          fontWeight: 700,
                        }}
                      >
                        {formatCurrency(remaining)}
                      </TableCell>
                      <TableCell>{b.month}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpenEdit(b)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(b.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không có ngân sách nào trong tháng {currentMonth}.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog Thêm / Sửa */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
          <DialogTitle sx={{ color: '#2E5B47', fontWeight: 600 }}>
            {editingBudget ? "Chỉnh sửa Kế hoạch" : "Tạo Kế hoạch Ngân sách"}
          </DialogTitle>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
                label="Tên danh mục (VD: Ăn uống)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
            />

            <TextField
                label="Hạn mức chi tiêu (VND)"
                type="number"
                value={formData.limitAmount}
                onChange={(e) => setFormData({ ...formData, limitAmount: +e.target.value })}
                fullWidth
                helperText="Số tiền tối đa bạn muốn chi cho mục này"
            />

            <TextField
                label="Tháng áp dụng"
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
            />

            {/* ĐÃ XÓA PHẦN CHỌN VÍ */}

          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6B8E7F" }}
              onClick={handleSave}
            >
              Lưu Kế Hoạch
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default BudgetManagementPage;